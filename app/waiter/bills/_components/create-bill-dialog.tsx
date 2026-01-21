"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useMemo } from "react";
import { PendingPayment } from "@/apis/payment-api";

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    paymentId: string,
    discountRate: number,
    discountAmount: number,
  ) => void;
  isProcessing?: boolean;
  pendingPayments: PendingPayment[];
}

export function CreateBillDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing = false,
  pendingPayments = [],
}: CreateBillDialogProps) {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [discountRate, setDiscountRate] = useState<string>("");

  const selectedPayment = useMemo(
    () => pendingPayments.find((p) => p.orderId === selectedOrderId),
    [pendingPayments, selectedOrderId],
  );

  const discountValue = useMemo(() => {
    if (!selectedPayment) return 0;
    const rate = parseFloat(discountRate) || 0;
    return (selectedPayment.totalAmount * rate) / 100;
  }, [selectedPayment, discountRate]);

  const handleConfirm = useCallback(() => {
    const rate = parseFloat(discountRate) || 0;
    if (
      selectedPayment &&
      selectedPayment.paymentId &&
      rate >= 0 &&
      rate <= 100
    ) {
      onConfirm(selectedPayment.paymentId, rate, discountValue);
      // Reset after confirm
      setSelectedOrderId("");
      setDiscountRate("");
    }
  }, [selectedPayment, discountRate, discountValue, onConfirm]);

  const subtotalAfterDiscount = useMemo(() => {
    if (!selectedPayment) return 0;
    return Math.max(0, selectedPayment.totalAmount - discountValue);
  }, [selectedPayment, discountValue]);

  const finalTotal = useMemo(() => {
    if (!selectedPayment) return 0;
    // Final total = (original - discount) + tax
    return (selectedPayment.totalAmount - discountValue) * 1.1;
  }, [selectedPayment, discountValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bill</DialogTitle>
          <DialogDescription>
            Select a payment request and apply discount to create bill
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="payment" className="mb-2 block">
              Select Order
            </Label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger id="payment">
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                {pendingPayments.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    No pending bill requests
                  </div>
                ) : (
                  pendingPayments.map((payment) => (
                    <SelectItem key={payment.orderId} value={payment.orderId}>
                      {`Order ${payment.orderId.slice(0, 8)} - Table ${payment.tableNumber} - $${payment.totalAmount.toFixed(2)}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discountRate" className="mb-2 block">
              Discount (%)
            </Label>
            <Input
              id="discountRate"
              type="number"
              placeholder="0"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              min="0"
              max="100"
              step="1"
            />
          </div>
          {selectedPayment && discountRate && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Table</span>
                <span className="text-gray-900">
                  {selectedPayment.tableNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Total</span>
                <span className="text-gray-900">
                  ${selectedPayment.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  Discount ({discountRate}%)
                </span>
                <span className="text-green-600">
                  -${discountValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal After Discount</span>
                <span className="text-gray-900">
                  ${subtotalAfterDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="text-gray-900">
                  ${(subtotalAfterDiscount * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span className="text-gray-900">Final Total</span>
                <span className="text-gray-900">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !selectedOrderId ||
              !discountRate ||
              parseFloat(discountRate) < 0 ||
              parseFloat(discountRate) > 100 ||
              isProcessing
            }
          >
            {isProcessing ? "Creating..." : "Create Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
