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
import { useState, useCallback } from "react";
import { Bill, PaymentMethod } from "@/types/bill-type";
import { PAYMENT_METHOD_OPTIONS } from "@/schema/bill-schema";
import { CreditCard } from "lucide-react";

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
  bill: Bill | null;
  isProcessing?: boolean;
}

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
  bill,
  isProcessing = false,
}: ProcessPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );

  const handleConfirm = useCallback(() => {
    onConfirm(paymentMethod);
  }, [paymentMethod, onConfirm]);

  const getPaymentIcon = useCallback((method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return "💵";
      case PaymentMethod.STRIPE:
        return <CreditCard className="h-5 w-5" />;
      default:
        return "💳";
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Select payment method for Table {bill?.tableNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="paymentMethod" className="mb-2 block">
              Payment Method
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(option.value)}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {bill && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-gray-900">
                  ${bill.totalAmount.toFixed(2)}
                </span>
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
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
