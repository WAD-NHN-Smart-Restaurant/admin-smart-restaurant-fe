"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bill } from "@/types/bill-type";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BillDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill | null;
  onPrint?: (billId: string) => void;
}

export function BillDetailsDialog({
  open,
  onOpenChange,
  bill,
  onPrint,
}: BillDetailsDialogProps) {
  if (!bill) return null;

  const getStatusColor = (status?: string) => {
    if (status === "success" || status === "completed") {
      return "bg-green-100 text-green-800";
    }
    if (status === "pending" || status === "payment_pending") {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bill Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Table Number</p>
              <p className="font-medium text-gray-900">{bill.tableNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(bill.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Order Status</p>
              <Badge className={getStatusColor(bill.status)}>
                {bill.status}
              </Badge>
            </div>
            <div>
              <p className="text-gray-600">Payment Status</p>
              <Badge className={getStatusColor(bill.paymentStatus)}>
                {bill.paymentStatus || "pending"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Items Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Items</span>
                <span className="font-medium text-gray-900">
                  {bill.itemCount}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click &quot;View Full Details&quot; to see individual items and
              breakdown
            </p>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-gray-900">
                ${bill.totalAmount.toFixed(2)}
              </span>
            </div>
            {bill.paymentMethod && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">{bill.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onPrint && (
            <Button onClick={() => onPrint(bill.orderId)}>Print Bill</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
