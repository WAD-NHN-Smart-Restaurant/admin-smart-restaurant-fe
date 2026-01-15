"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderItemStatus } from "@/types/waiter-type";
import { Clock, MapPin, Check, X, Send, CheckCircle2 } from "lucide-react";
import { useMemo, useCallback } from "react";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
  onAcceptItem: (orderItemId: string) => void;
  onRejectItem: (orderItemId: string) => void;
  onSendToKitchen: (orderItemIds: string[]) => void;
  onMarkServed: (orderItemIds: string[]) => void;
  isProcessing?: boolean;
}

export function OrderCard({
  order,
  onAcceptItem,
  onRejectItem,
  onSendToKitchen,
  onMarkServed,
  isProcessing = false,
}: OrderCardProps) {
  // Calculate order stats
  const orderStats = useMemo(() => {
    const items = order.orderItems;
    return {
      pendingItems: items.filter((i) => i.status === OrderItemStatus.PENDING),
      acceptedItems: items.filter((i) => i.status === OrderItemStatus.ACCEPTED),
      preparingItems: items.filter(
        (i) => i.status === OrderItemStatus.PREPARING,
      ),
      readyItems: items.filter((i) => i.status === OrderItemStatus.READY),
    };
  }, [order.orderItems]);

  // Status badge color
  const getStatusColor = useCallback((status: OrderItemStatus) => {
    switch (status) {
      case OrderItemStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case OrderItemStatus.ACCEPTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case OrderItemStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case OrderItemStatus.PREPARING:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case OrderItemStatus.READY:
        return "bg-green-100 text-green-800 border-green-200";
      case OrderItemStatus.SERVED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  // Handle send accepted items to kitchen
  const handleSendToKitchen = useCallback(() => {
    const acceptedItemIds = orderStats.acceptedItems.map((item) => item.id);
    if (acceptedItemIds.length > 0) {
      onSendToKitchen(acceptedItemIds);
    }
  }, [orderStats.acceptedItems, onSendToKitchen]);

  // Handle mark ready items as served
  const handleMarkServed = useCallback(() => {
    const readyItemIds = orderStats.readyItems.map((item) => item.id);
    if (readyItemIds.length > 0) {
      onMarkServed(readyItemIds);
    }
  }, [orderStats.readyItems, onMarkServed]);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Table {order.table.tableNumber}
            </h3>
            <Badge variant="outline" className="text-xs">
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{order.table.location || "No location"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(order.createdAt), "HH:mm")}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">
                  {item.quantity}x {item.menuItem.name}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </Badge>
              </div>
              {item.menuItem.categoryName && (
                <p className="text-xs text-gray-500 mb-1">
                  {item.menuItem.categoryName}
                </p>
              )}
              {item.orderItemOptions.length > 0 && (
                <div className="text-xs text-gray-600 mb-1">
                  Options:{" "}
                  {item.orderItemOptions
                    .map((opt) => opt.modifierOption?.name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
              {item.notes && (
                <p className="text-xs text-gray-600 italic">
                  Note: {item.notes}
                </p>
              )}
              <p className="text-sm font-medium text-gray-700 mt-1">
                ${item.totalPrice.toFixed(2)}
              </p>
            </div>
            {item.status === OrderItemStatus.PENDING && (
              <div className="flex gap-2 ml-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => onAcceptItem(item.id)}
                  disabled={isProcessing}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onRejectItem(item.id)}
                  disabled={isProcessing}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t">
        {orderStats.acceptedItems.length > 0 && (
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={handleSendToKitchen}
            disabled={isProcessing}
          >
            <Send className="h-3 w-3 mr-2" />
            Send to Kitchen ({orderStats.acceptedItems.length})
          </Button>
        )}
        {orderStats.readyItems.length > 0 && (
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleMarkServed}
            disabled={isProcessing}
          >
            <CheckCircle2 className="h-3 w-3 mr-2" />
            Mark Served ({orderStats.readyItems.length})
          </Button>
        )}
      </div>
    </Card>
  );
}
