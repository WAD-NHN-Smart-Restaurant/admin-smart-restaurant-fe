"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentBill } from "@/apis/payment-api";
import { format } from "date-fns";
import { useGetBillByPayment } from "@/hooks/use-bill-query";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PrintBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: PaymentBill | null;
}

export function PrintBillDialog({
  open,
  onOpenChange,
  bill,
}: PrintBillDialogProps) {
  const { data: billDetails } = useGetBillByPayment(
    bill?.paymentId || "",
    open && !!bill?.paymentId,
  );

  const displayBill = billDetails?.bill;

  const handlePrint = async () => {
    const node = document.getElementById("print-bill-content");
    if (!node) return;

    const dataUrl = await toPng(node, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    const fileName = `bill-table-${displayBill?.tableNumber || "unknown"}-${Date.now()}.pdf`;
    pdf.save(fileName);
  };

  if (!displayBill && !bill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="no-print">
          <DialogTitle>Print Bill</DialogTitle>
        </DialogHeader>

        <div id="print-bill-content" className="space-y-6 px-10 bg-white">
          {/* Restaurant Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🍽️ Smart Restaurant
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Table {displayBill?.tableNumber || bill?.tableNumber} |{" "}
              {format(
                new Date(
                  displayBill?.createdAt || bill?.createdAt || new Date(),
                ),
                "MMM dd, yyyy HH:mm",
              )}
            </p>
          </div>

          {/* Order Items */}
          {displayBill?.items && displayBill.items.length > 0 ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Order Items
              </h3>
              <div className="space-y-3">
                {displayBill.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.quantity}x {item.name}
                        </p>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="text-sm text-gray-600 mt-1 ml-4">
                            {item.modifiers.map((mod, idx) => (
                              <div key={idx}>
                                + {mod.name}
                                {mod.price > 0 && (
                                  <span className="ml-2">
                                    ${mod.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
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
            <div className="text-center text-gray-500 py-4">No items found</div>
          )}

          {/* Pricing Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-base">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">
                ${(displayBill?.subtotal ?? bill?.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>

            {(displayBill?.discount ?? bill?.discountAmount ?? 0) > 0 && (
              <div className="flex justify-between text-base">
                <span className="text-gray-700">
                  Discount
                  {bill?.discountRate && (
                    <span className="text-sm ml-1">
                      ({bill?.discountRate}%)
                    </span>
                  )}
                </span>
                <span className="text-red-600">
                  -$
                  {(displayBill?.discount ?? bill?.discountAmount ?? 0).toFixed(
                    2,
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base">
              <span className="text-gray-700">Tax (10%)</span>
              <span className="text-gray-900">
                ${(displayBill?.tax ?? bill?.tax ?? 0).toFixed(2)}
              </span>
            </div>

            {displayBill?.payments?.[0]?.metadata &&
              (displayBill.payments[0].metadata as { tipAmount?: number })
                .tipAmount &&
              (displayBill.payments[0].metadata as { tipAmount?: number })
                .tipAmount! > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Tip</span>
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

            <div className="flex justify-between text-xl font-bold border-t-2 pt-3 mt-3">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                $
                {displayBill?.payments?.[0]?.amount?.toFixed(2) ??
                  bill?.totalAmount?.toFixed(2) ??
                  "0.00"}
              </span>
            </div>

            {(displayBill?.payments?.[0]?.paymentMethod ||
              bill?.paymentMethod) && (
              <div className="flex justify-between text-base pt-2">
                <span className="text-gray-700">Payment Method</span>
                <span className="text-gray-900 capitalize">
                  {displayBill?.payments?.[0]?.paymentMethod ||
                    bill?.paymentMethod}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Thank you for dining with us!</p>
            <p className="mt-1">See you again soon!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end no-print pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <span className="mr-2">🖨️</span>
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
