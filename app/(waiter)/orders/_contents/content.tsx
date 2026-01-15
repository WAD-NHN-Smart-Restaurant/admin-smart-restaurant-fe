"use client";

import { useState, useMemo, useCallback } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { OrdersHeader } from "../_components/orders-header";
import { OrderStats } from "../_components/order-stats";
import { OrderCard } from "../_components/order-card";
import { RejectOrderDialog } from "../_components/reject-order-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import {
  useGetPendingOrders,
  useAcceptOrderItem,
  useRejectOrderItem,
  useSendToKitchen,
  useMarkAsServed,
  useWaiterSocketListeners,
} from "@/hooks/use-waiter-query";
import { OrderItemStatus } from "@/types/waiter-type";
import { useRouter } from "next/navigation";

export function OrdersContent() {
  const router = useRouter();

  // State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );
  const [selectedOrderItemName, setSelectedOrderItemName] =
    useState<string>("");

  // Queries
  const { data: orders = [], isLoading: ordersLoading } = useGetPendingOrders();

  // Mutations
  const acceptMutation = useAcceptOrderItem();
  const rejectMutation = useRejectOrderItem();
  const sendToKitchenMutation = useSendToKitchen();
  const markServedMutation = useMarkAsServed();

  // Listen for real-time updates
  useWaiterSocketListeners();

  // Calculate stats
  const stats = useMemo(() => {
    const allItems = orders.flatMap((o) => o.orderItems);
    return {
      total: orders.length,
      pending: allItems.filter((i) => i.status === OrderItemStatus.PENDING)
        .length,
      preparing: allItems.filter((i) => i.status === OrderItemStatus.PREPARING)
        .length,
      ready: allItems.filter((i) => i.status === OrderItemStatus.READY).length,
      served: allItems.filter((i) => i.status === OrderItemStatus.SERVED)
        .length,
      rejected: allItems.filter((i) => i.status === OrderItemStatus.REJECTED)
        .length,
    };
  }, [orders]);

  // Handlers
  const handleCreateBill = useCallback(() => {
    router.push("/bills");
  }, [router]);

  const handleAcceptItem = useCallback(
    (orderItemId: string) => {
      acceptMutation.mutate({ orderItemId });
    },
    [acceptMutation],
  );

  const handleRejectItem = useCallback(
    (orderItemId: string) => {
      // Find the order item to get its name
      const order = orders.find((o) =>
        o.orderItems.some((item) => item.id === orderItemId),
      );
      const item = order?.orderItems.find((item) => item.id === orderItemId);

      setSelectedOrderItemId(orderItemId);
      setSelectedOrderItemName(item?.menuItem.name || "");
      setRejectDialogOpen(true);
    },
    [orders],
  );

  const handleRejectConfirm = useCallback(
    (reason: string) => {
      if (selectedOrderItemId) {
        rejectMutation.mutate(
          { orderItemId: selectedOrderItemId, reason },
          {
            onSuccess: () => {
              setRejectDialogOpen(false);
              setSelectedOrderItemId(null);
              setSelectedOrderItemName("");
            },
          },
        );
      }
    },
    [selectedOrderItemId, rejectMutation],
  );

  const handleSendToKitchen = useCallback(
    (orderItemIds: string[]) => {
      sendToKitchenMutation.mutate({ orderItemIds });
    },
    [sendToKitchenMutation],
  );

  const handleMarkServed = useCallback(
    (orderItemIds: string[]) => {
      markServedMutation.mutate({ orderItemIds });
    },
    [markServedMutation],
  );

  const isProcessing =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    sendToKitchenMutation.isPending ||
    markServedMutation.isPending;

  if (ordersLoading) {
    return (
      <ProtectedRoute>
        <PageLoadingSkeleton />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <OrdersHeader onCreateBill={handleCreateBill} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <OrderStats stats={stats} />

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="There are no pending orders at the moment."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAcceptItem={handleAcceptItem}
                  onRejectItem={handleRejectItem}
                  onSendToKitchen={handleSendToKitchen}
                  onMarkServed={handleMarkServed}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reject Dialog */}
        <RejectOrderDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          onConfirm={handleRejectConfirm}
          orderItemName={selectedOrderItemName}
          isProcessing={rejectMutation.isPending}
        />
      </div>
    </ProtectedRoute>
  );
}
