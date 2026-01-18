"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  AlertTriangle,
  Utensils,
  StickyNote,
  CheckCircle2,
  Flame,
  X,
} from "lucide-react";
import { KitchenOrder, OrderItemStatus } from "@/types/kitchen-type";
import { cn } from "@/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useBulkUpdateOrderItems } from "@/hooks/use-kitchen-query";

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStartPreparing: (orderItemIds: string[]) => void;
  onMarkReady: (orderItemIds: string[]) => void;
  onReject?: (orderItemId: string, reason: string) => void;
  isOverdue: (item: KitchenOrder["orderItems"][0]) => boolean;
  getElapsedTime: (createdAt: string) => string;
}

export const KitchenOrderCard = memo(function KitchenOrderCard({
  order,
  onReject,
  isOverdue,
  getElapsedTime,
}: KitchenOrderCardProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Group items by status
  const itemsByStatus = useMemo(() => {
    const preparing = order.orderItems.filter(
      (item) => item.status === OrderItemStatus.PREPARING,
    );
    const ready = order.orderItems.filter(
      (item) => item.status === OrderItemStatus.READY,
    );

    return { preparing, ready };
  }, [order.orderItems]);
  const bulkUpdateMutation = useBulkUpdateOrderItems();
  // Check if any item is overdue
  const hasOverdueItems = useMemo(() => {
    return order.orderItems.some(
      (item) => item.status === OrderItemStatus.PREPARING && isOverdue(item),
    );
  }, [order.orderItems, isOverdue]);

  // Check if this is a new order (just received, less than 30 seconds old)
  const isNewOrder = useMemo(() => {
    const oldestItem = order.orderItems[0];
    if (!oldestItem) return false;
    const ageInSeconds =
      // eslint-disable-next-line react-hooks/purity
      (Date.now() - new Date(oldestItem.createdAt).getTime()) / 1000;
    return (
      ageInSeconds < 30 &&
      itemsByStatus.preparing.length > 0 &&
      itemsByStatus.ready.length === 0
    );
  }, [order.orderItems, itemsByStatus]);

  // Get elapsed time for the order (based on oldest item)
  const elapsedTime = useMemo(() => {
    const oldestItem = order.orderItems.reduce((oldest, item) =>
      new Date(item.createdAt) < new Date(oldest.createdAt) ? item : oldest,
    );
    return getElapsedTime(oldestItem.createdAt);
  }, [order.orderItems, getElapsedTime]);

  // Get elapsed time color class
  const getTimeColorClass = useCallback(() => {
    if (hasOverdueItems) return "text-red-600 font-bold";
    const minutes = parseInt(elapsedTime.split(":")[0]);
    if (minutes >= 10) return "text-amber-600 font-semibold";
    return "text-slate-600";
  }, [hasOverdueItems, elapsedTime]);

  // Handle mark all ready
  const handleMarkAllReady = useCallback(() => {
    const preparingItemIds = itemsByStatus.preparing.map((item) => item.id);
    if (preparingItemIds.length > 0) {
      bulkUpdateMutation.mutate({
        orderItemIds: preparingItemIds,
        status: OrderItemStatus.READY,
      });
    }
  }, [bulkUpdateMutation, itemsByStatus.preparing]);

  // Handle reject dialog open
  const handleOpenRejectDialog = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setRejectDialogOpen(true);
    setRejectReason("");
  }, []);

  // Handle reject confirm
  const handleConfirmReject = useCallback(() => {
    if (selectedItemId && rejectReason.trim() && onReject) {
      onReject(selectedItemId, rejectReason.trim());
      setRejectDialogOpen(false);
      setSelectedItemId(null);
      setRejectReason("");
    }
  }, [selectedItemId, rejectReason, onReject]);

  // Check if order has only accepted items (show reject buttons)
  const hasOnlyAcceptedItems = useMemo(() => {
    return order.orderItems.every(
      (item) => item.status === OrderItemStatus.ACCEPTED,
    );
  }, [order.orderItems]);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all hover:shadow-md rounded-lg border",
      )}
    >
      {/* Header */}
      <CardHeader className="p-4 pb-3 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono font-bold text-sm">
              #{order.id.slice(-3).toUpperCase()}
            </Badge>
            {hasOverdueItems && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Overdue
              </Badge>
            )}
          </div>
          <Badge className="bg-orange-500 hover:bg-orange-600 font-semibold">
            Table {order.table.tableNumber}
          </Badge>
        </div>

        {order.table.location && (
          <p className="text-xs text-slate-500 mt-2">
            Location: {order.table.location}
          </p>
        )}
      </CardHeader>

      {/* New Order Banner */}
      {isNewOrder && (
        <div className="bg-amber-100 border-y border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-900 font-semibold text-sm">
          <AlertTriangle className="h-4 w-4" />
          NEW ORDER - Just received
        </div>
      )}

      {/* Order Items */}
      <CardContent className="p-4 space-y-3">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock
            className={cn(
              "h-4 w-4",
              hasOverdueItems ? "text-red-600" : "text-slate-500",
            )}
          />
          <span className={cn("text-sm font-medium", getTimeColorClass())}>
            {elapsedTime}
          </span>
        </div>

        <Separator />

        {/* Items List */}
        <div className="space-y-3">
          {order.orderItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start gap-3">
                {/* Quantity Badge */}
                <Badge
                  variant="secondary"
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-base p-0 bg-orange-500 text-white hover:bg-orange-600"
                >
                  {item.quantity}
                </Badge>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-slate-400" />
                    {item.menuItem.name}
                  </div>
                  {item.orderItemOptions &&
                    item.orderItemOptions.length > 0 && (
                      <div className="text-amber-700 text-sm mt-1 flex items-start gap-1">
                        <span className="text-amber-600 font-medium">+</span>
                        <span>
                          {item.orderItemOptions
                            .map((opt) => opt.modifierOption?.name)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  {item.notes && (
                    <div className="flex items-start gap-1 text-purple-700 text-sm mt-1 bg-purple-50 p-2 rounded border border-purple-200">
                      <StickyNote className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex items-center gap-2">
                  {item.status === OrderItemStatus.READY ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Flame className="h-5 w-5 text-orange-500" />
                  )}
                  {/* Reject button for accepted items */}
                  {hasOnlyAcceptedItems && onReject && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRejectDialog(item.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {index < order.orderItems.length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardContent className="p-4 pt-0 flex gap-2">
        {itemsByStatus.preparing.length > 0 &&
          itemsByStatus.ready.length === 0 && (
            <>
              <Button
                onClick={handleMarkAllReady}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Ready
              </Button>
            </>
          )}

        {itemsByStatus.ready.length > 0 && (
          <Badge
            className="flex-1 border-green-300 text-green-400"
            variant={"outline"}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Wait for waiter to serve
          </Badge>
        )}
      </CardContent>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Order Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
                setSelectedItemId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
