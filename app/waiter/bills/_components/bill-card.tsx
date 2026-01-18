"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bill, PaymentStatus } from "@/types/bill-type";
import { Clock, MapPin, Download, DollarSign, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";

interface BillCardProps {
  bill: Bill;
  onViewDetails: (bill: Bill) => void;
  onPrint: (billId: string) => void;
  onProcessPayment: (bill: Bill) => void;
  onApplyDiscount: (bill: Bill) => void;
  isProcessing?: boolean;
}

export function BillCard({
  bill,
  onViewDetails,
  onPrint,
  onProcessPayment,
  onApplyDiscount,
  isProcessing = false,
}: BillCardProps) {
  // Get payment status
  const paymentStatus = useMemo(() => {
    const successPayment = bill.payments.find(
      (p) => p.status === PaymentStatus.SUCCESS,
    );
    if (successPayment) return PaymentStatus.SUCCESS;

    const pendingPayment = bill.payments.find(
      (p) => p.status === PaymentStatus.PENDING,
    );
    if (pendingPayment) return PaymentStatus.PENDING;

    return PaymentStatus.PENDING;
  }, [bill.payments]);

  const getStatusColor = useCallback((status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return "bg-green-100 text-green-800 border-green-200";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const isPaid = paymentStatus === PaymentStatus.SUCCESS;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Bill Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Table {bill.table.tableNumber}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs ${getStatusColor(paymentStatus)}`}
            >
              {paymentStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{bill.table.location || "No location"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(bill.createdAt), "HH:mm")}</span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={() => onViewDetails(bill)}>
          Details
        </Button>
      </div>

      {/* Bill Items Summary */}
      <div className="space-y-2 mb-4">
        {bill.order.orderItems?.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-700">
              {item.quantity}x {item.menuItem.name}
            </span>
            <span className="text-gray-900 font-medium">
              ${item.totalPrice.toFixed(2)}
            </span>
          </div>
        ))}
        {bill.order.orderItems?.length > 3 && (
          <p className="text-xs text-gray-500">
            +{bill.order.orderItems.length - 3} more items...
          </p>
        )}
      </div>

      {/* Bill Totals */}
      <div className="space-y-1 mb-4 pt-3 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${bill.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${bill.tax.toFixed(2)}</span>
        </div>
        {bill.discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">-${bill.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-base font-bold pt-2 border-t">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${bill.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onPrint(bill.id)}
          disabled={isProcessing}
        >
          <Download className="h-3 w-3 mr-2" />
          Print
        </Button>
        {!isPaid && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApplyDiscount(bill)}
              disabled={isProcessing}
            >
              <DollarSign className="h-3 w-3 mr-2" />
              Discount
            </Button>
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={() => onProcessPayment(bill)}
              disabled={isProcessing}
            >
              <CreditCard className="h-3 w-3 mr-2" />
              Pay
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
