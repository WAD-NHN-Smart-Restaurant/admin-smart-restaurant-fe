"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentBill } from "@/api/payment-api";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetBillByPayment } from "@/hooks/use-bill-query";

interface BillDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: PaymentBill | null;
  onPrint?: (billId: string) => void;
}

export function BillDetailsDialog({
  open,
  onOpenChange,
  bill,
  onPrint,
}: BillDetailsDialogProps) {
  // Fetch full bill details by payment ID if available
  const { data: billDetails } = useGetBillByPayment(
    bill?.paymentId || "",
    open && !!bill?.paymentId,
  );

  // Use fetched details if available, otherwise use the bill prop
  const displayBill = billDetails?.bill;
  const hasDetailedData = !!billDetails?.bill;

  // If no detailed data, fallback to show something
  if (!displayBill && !bill) return null;

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
              <p className="font-medium text-gray-900">
                {displayBill?.tableNumber || bill?.tableNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {format(
                  new Date(
                    displayBill?.createdAt || bill?.createdAt || new Date(),
                  ),
                  "MMM dd, yyyy HH:mm",
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Order Status</p>
              <Badge
                className={getStatusColor(displayBill?.status || bill?.status)}
              >
                {displayBill?.status || bill?.status}
              </Badge>
            </div>
            <div>
              <p className="text-gray-600">Payment Status</p>
              <Badge
                className={getStatusColor(
                  displayBill?.payments?.[0]?.status || bill?.paymentStatus,
                )}
              >
                {displayBill?.payments?.[0]?.status ||
                  bill?.paymentStatus ||
                  "pending"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          {hasDetailedData && displayBill?.items ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {displayBill.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 p-3 rounded-lg space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {item.modifiers.map((mod, idx: number) => (
                              <div key={idx}>
                                + {mod.name} (${mod.price.toFixed(2)})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </p>
                        <p className="font-medium text-gray-900">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Order Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Items</span>
                  <span className="font-medium text-gray-900">
                    {bill?.itemCount || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            {hasDetailedData && displayBill && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${displayBill.subtotal?.toFixed(2)}
                  </span>
                </div>
                {displayBill.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-600">
                      -${displayBill.discount?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-900">
                    ${displayBill.tax?.toFixed(2)}
                  </span>
                </div>
                {displayBill.payments?.[0]?.metadata &&
                  (displayBill.payments[0].metadata as { tipAmount?: number })
                    .tipAmount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tip</span>
                      <span className="text-gray-900">
                        $
                        {(
                          (
                            displayBill.payments[0].metadata as {
                              tipAmount?: number;
                            }
                          ).tipAmount || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
              </>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-gray-900">
                $
                {hasDetailedData && displayBill
                  ? displayBill.payments?.[0]?.amount.toFixed(2)
                  : bill?.totalAmount?.toFixed(2)}
              </span>
            </div>
            {(displayBill?.payments?.[0]?.paymentMethod ||
              bill?.paymentMethod) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 capitalize">
                  {displayBill?.payments?.[0]?.paymentMethod ||
                    bill?.paymentMethod}
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onPrint && (
            <Button
              onClick={() =>
                onPrint(displayBill?.orderId || bill?.orderId || "")
              }
            >
              Print Bill
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
