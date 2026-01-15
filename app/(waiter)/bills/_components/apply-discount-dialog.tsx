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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";
import { Bill } from "@/types/bill-type";

interface ApplyDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    discountType: "percentage" | "fixed",
    discountValue: number,
  ) => void;
  bill: Bill | null;
  isProcessing?: boolean;
}

export function ApplyDiscountDialog({
  open,
  onOpenChange,
  onConfirm,
  bill,
  isProcessing = false,
}: ApplyDiscountDialogProps) {
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState("");

  const handleConfirm = useCallback(() => {
    const value = parseFloat(discountValue);
    if (!isNaN(value) && value > 0) {
      onConfirm(discountType, value);
      // Reset after confirm
      setDiscountValue("");
      setDiscountType("percentage");
    }
  }, [discountValue, discountType, onConfirm]);

  const calculatedDiscount = useCallback(() => {
    if (!bill) return 0;
    const value = parseFloat(discountValue);
    if (isNaN(value)) return 0;

    if (discountType === "percentage") {
      return (bill.subtotal * value) / 100;
    }
    return value;
  }, [bill, discountValue, discountType]);

  const newTotal = bill ? bill.total - calculatedDiscount() : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
          <DialogDescription>
            Apply a discount to Table {bill?.table.tableNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="discountType" className="mb-2 block">
              Discount Type
            </Label>
            <Select
              value={discountType}
              onValueChange={(value) =>
                setDiscountType(value as "percentage" | "fixed")
              }
            >
              <SelectTrigger id="discountType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discountValue" className="mb-2 block">
              {discountType === "percentage" ? "Percentage" : "Amount"}
            </Label>
            <Input
              id="discountValue"
              type="number"
              placeholder={discountType === "percentage" ? "10" : "5.00"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min="0"
              step={discountType === "percentage" ? "1" : "0.01"}
            />
          </div>
          {bill && discountValue && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Total</span>
                <span className="text-gray-900">${bill.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">
                  -${calculatedDiscount().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span className="text-gray-900">New Total</span>
                <span className="text-gray-900">${newTotal.toFixed(2)}</span>
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
              !discountValue || parseFloat(discountValue) <= 0 || isProcessing
            }
          >
            {isProcessing ? "Applying..." : "Apply Discount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
