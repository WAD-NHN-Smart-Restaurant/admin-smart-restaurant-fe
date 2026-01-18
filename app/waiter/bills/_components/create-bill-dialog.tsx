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
import { useState, useCallback, useMemo } from "react";
import { useGetWaiterOrders } from "@/hooks/use-waiter-query";
import { OrderStatus } from "@/types/waiter-type";

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (orderId: string, tableId: string) => void;
  isProcessing?: boolean;
}

export function CreateBillDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing = false,
}: CreateBillDialogProps) {
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // Get active orders (payment_pending status)
  const { data: ordersData } = useGetWaiterOrders({
    status: OrderStatus.PAYMENT_PENDING,
  });

  const orders = useMemo(() => ordersData?.items || [], [ordersData]);

  const handleConfirm = useCallback(() => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (order) {
      onConfirm(order.id, order.tableId);
    }
  }, [selectedOrderId, orders, onConfirm]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId),
    [orders, selectedOrderId],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bill</DialogTitle>
          <DialogDescription>
            Select an order to create a bill for payment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="order" className="mb-2 block">
              Select Order
            </Label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger id="order">
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                {orders.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    No orders available for billing
                  </div>
                ) : (
                  orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      Table {order.table.tableNumber} - $
                      {order.totalAmount.toFixed(2)} ({order.orderItems.length}{" "}
                      items)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedOrder && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Table</span>
                  <span className="text-gray-900">
                    {selectedOrder.table.tableNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="text-gray-900">
                    {selectedOrder.orderItems.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="text-gray-900">{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
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
            disabled={!selectedOrderId || isProcessing}
          >
            {isProcessing ? "Creating..." : "Create Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
