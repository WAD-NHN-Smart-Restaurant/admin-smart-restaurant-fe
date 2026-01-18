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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";

interface RejectOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  orderItemName?: string;
  isProcessing?: boolean;
}

export function RejectOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  orderItemName,
  isProcessing = false,
}: RejectOrderDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = useCallback(() => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  }, [reason, onConfirm]);

  const handleCancel = useCallback(() => {
    setReason("");
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Order Item</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting{" "}
            {orderItemName ? `"${orderItemName}"` : "this item"}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="reason" className="mb-2 block">
            Reason for rejection
          </Label>
          <Textarea
            id="reason"
            placeholder="E.g., Out of stock, Item not available..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isProcessing}
          >
            {isProcessing ? "Rejecting..." : "Reject Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
