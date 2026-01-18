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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Table Number</p>
              <p className="font-medium text-gray-900">
                {bill.table.tableNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="font-medium text-gray-900">
                {bill.table.location || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(bill.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Order Status</p>
              <p className="font-medium text-gray-900">{bill.order.status}</p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {bill.order.orderItems.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.quantity}x {item.menuItem.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  {item.orderItemOptions.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Options:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {item.orderItemOptions.map((option) => (
                          <li key={option.id}>
                            {option.modifierOption?.name || "Unknown"} (+$
                            {option.priceAtTime.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">${bill.tax.toFixed(2)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Discount</span>
                <span className="text-green-600 font-medium">
                  -${bill.discount.toFixed(2)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${bill.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payments */}
          {bill.payments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payments</h3>
                <div className="space-y-2">
                  {bill.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.paymentMethod}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(payment.createdAt), "MMM dd, HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs ${
                            payment.status === "success"
                              ? "text-green-600"
                              : payment.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onPrint && (
            <Button onClick={() => onPrint(bill.id)}>Print Bill</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
