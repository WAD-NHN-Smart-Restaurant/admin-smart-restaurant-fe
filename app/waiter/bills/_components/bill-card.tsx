"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bill, PaymentStatus } from "@/types/bill-type";
import { Clock, Download, DollarSign, CreditCard } from "lucide-react";
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
  // Get payment status from bill.paymentStatus or bill.status
  const paymentStatus = useMemo(() => {
    if (bill.paymentStatus === "success" || bill.status === "completed") {
      return PaymentStatus.SUCCESS;
    }
    if (bill.paymentStatus === "pending" || bill.status === "payment_pending") {
      return PaymentStatus.PENDING;
    }
    return PaymentStatus.PENDING;
  }, [bill.paymentStatus, bill.status]);

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
              Table {bill.tableNumber}
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
      <div className="mb-4 py-3 border-b">
        <div className="text-sm text-gray-600">
          {bill.itemCount} item{bill.itemCount !== 1 ? "s" : ""} ordered
        </div>
      </div>

      {/* Bill Totals */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-base font-bold mb-2">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${bill.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-base">
          <span className="text-gray-900">Payment Method</span>
          <span className="text-gray-900">{bill.paymentMethod}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onPrint(bill.orderId)}
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
