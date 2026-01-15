"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order, OrderItemStatus } from "@/types/waiter-type";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { X, StickyNote } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onAcceptItem: (itemId: string) => void;
  onRejectItem: (itemId: string, itemName: string) => void;
  onAcceptAllItems: (order: Order) => void;
  onRejectAllItems: (order: Order) => void;
  onMarkServed: (order: Order) => void;
  isProcessing?: boolean;
  selectedTab?: string;
}

export function OrderCard({
  order,
  onRejectItem,
  onAcceptAllItems,
  onRejectAllItems,
  onMarkServed,
  isProcessing = false,
  selectedTab = "pending",
}: OrderCardProps) {
  // Determine order status and styling
  const orderStatus = useMemo(() => {
    const hasPending = order.orderItems.some(
      (i) => i.status === OrderItemStatus.PENDING,
    );
    const hasPreparing = order.orderItems.some(
      (i) => i.status === OrderItemStatus.PREPARING,
    );
    const hasReady = order.orderItems.some(
      (i) => i.status === OrderItemStatus.READY,
    );

    const isNew =
      hasPending &&
      new Date().getTime() - new Date(order.createdAt).getTime() < 60000;

    if (hasReady) {
      return {
        label: "Ready to Serve",
        className: "bg-green-100 text-green-700",
        borderColor: "border-l-green-500",
        animate: false,
      };
    }
    if (hasPreparing) {
      return {
        label: "In Kitchen",
        className: "bg-blue-100 text-blue-700",
        borderColor: "",
        animate: false,
      };
    }
    if (hasPending) {
      return {
        label: "Pending",
        className: "bg-amber-100 text-amber-700",
        borderColor: isNew ? "border-l-red-500" : "",
        animate: isNew,
      };
    }
    return {
      label: "Unknown",
      className: "bg-slate-50 text-slate-800",
      borderColor: "",
      animate: false,
    };
  }, [order]);

  const timeAgo = useMemo(() => {
    const time = formatDistanceToNow(new Date(order.createdAt), {
      addSuffix: true,
    });
    const minutes = Math.floor(
      (new Date().getTime() - new Date(order.createdAt).getTime()) / 60000,
    );
    return { text: time, isUrgent: minutes < 1 };
  }, [order.createdAt]);

  const hasReady = order.orderItems.some(
    (i) => i.status === OrderItemStatus.READY,
  );

  return (
    <Card
      className={`overflow-hidden border-l-4 py-0 ${orderStatus.borderColor} ${
        orderStatus.animate ? "animate-pulse-slow shadow-lg" : "shadow-md"
      }`}
    >
      {/* Order Header */}
      <div className="p-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white px-3 py-2 rounded-lg font-bold">
            T{order.table?.tableNumber || "?"}
          </div>
          <div>
            <div className="font-bold text-slate-900">
              #{order.orderNumber || order.id.slice(0, 8)}
            </div>
            <div className="text-sm text-slate-500">
              {order.orderItems.length} items
            </div>
          </div>
        </div>
        <div className="text-right">
          <Badge className={orderStatus.className}>{orderStatus.label}</Badge>
          <div
            className={`text-xs mt-1 ${
              timeAgo.isUrgent ? "text-red-600 font-semibold" : "text-slate-500"
            }`}
          >
            {timeAgo.text}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-3">
        {order.orderItems.map((item, index) => (
          <div key={item.id}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex gap-2 flex-1">
                <div className="bg-slate-100 px-2.5 py-1 rounded font-bold text-sm h-fit">
                  {item.quantity}x
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">
                      {item.menuItem?.name}
                    </div>
                    {/* Status Badge */}
                    {item.status === OrderItemStatus.ACCEPTED && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        Accepted
                      </Badge>
                    )}
                    {item.status === OrderItemStatus.PREPARING && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        Preparing
                      </Badge>
                    )}
                    {item.status === OrderItemStatus.REJECTED && (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        Rejected
                      </Badge>
                    )}
                    {item.status === OrderItemStatus.READY && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Ready
                      </Badge>
                    )}
                  </div>
                  {item.orderItemOptions &&
                    item.orderItemOptions.length > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        +{" "}
                        {item.orderItemOptions
                          .map((opt) => opt.modifierOption?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  {item.notes && (
                    <div className="flex items-start gap-1 text-xs text-orange-600 mt-1 bg-orange-50 p-2 rounded border border-orange-200">
                      <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-slate-900 text-right">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
                {/* Per-item actions for pending items */}
                {item.status === OrderItemStatus.PENDING &&
                  selectedTab === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() =>
                          onRejectItem(item.id, item.menuItem?.name || "Item")
                        }
                        disabled={isProcessing}
                        title="Reject item"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
              </div>
            </div>
            {index < order.orderItems.length - 1 && (
              <Separator className="mt-3" />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      {hasReady && selectedTab === "ready" && (
        <div className="bg-slate-50 p-4 flex gap-3">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onMarkServed(order)}
            disabled={isProcessing}
          >
            Mark as Served
          </Button>
        </div>
      )}

      {/* Accept/Reject All Actions for Pending Tab */}
      {order.orderItems.some((i) => i.status === OrderItemStatus.PENDING) &&
        selectedTab === "pending" && (
          <div className="bg-slate-50 p-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => onRejectAllItems(order)}
              disabled={isProcessing}
            >
              Reject All
            </Button>
            <Button
              className="flex-[2] bg-green-600 hover:bg-green-700"
              onClick={() => onAcceptAllItems(order)}
              disabled={isProcessing}
            >
              Accept & Send to Kitchen
            </Button>
          </div>
        )}
    </Card>
  );
}
