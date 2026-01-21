"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useSafeQuery } from "./use-safe-query";
import { useSafeMutation } from "./use-safe-mutation";
import {
  getKitchenOrders,
  updateOrderItemStatus,
  bulkUpdateOrderItems,
  rejectOrderItem,
} from "@/apis/kitchen-api";
import {
  KitchenOrder,
  KitchenOrderFilter,
  UpdateOrderItemStatusRequest,
  BulkUpdateOrderItemsRequest,
} from "@/types/kitchen-type";
import { useWebSocket, KitchenSocketEvent } from "@/context/websocket-context";
import { useAuth } from "@/context/auth-context";

// Query keys
export const kitchenQueryKeys = {
  all: ["kitchen"] as const,
  orders: () => [...kitchenQueryKeys.all, "orders"] as const,
  ordersList: (filters?: KitchenOrderFilter) =>
    [...kitchenQueryKeys.orders(), "list", filters] as const,
  ordersByStatus: (status: string) =>
    [...kitchenQueryKeys.orders(), "status", status] as const,
};

// Hook to get kitchen orders with filters
export const useGetKitchenOrders = (
  filters?: KitchenOrderFilter,
  options?: {
    refetchInterval: number;
  },
) => {
  // Use ordersByStatus key when filtering by status for consistency with mutations
  const queryKey = filters?.status
    ? kitchenQueryKeys.ordersByStatus(filters.status)
    : kitchenQueryKeys.ordersList(filters);

  return useSafeQuery<KitchenOrder[]>(
    queryKey,
    () => getKitchenOrders(filters),
    {
      refetchInterval: options?.refetchInterval ?? false, // Disable polling, rely on WebSocket updates
      staleTime: 0, // Consider data immediately stale for instant refetch
      refetchOnWindowFocus: false,
    },
  );
};

// Hook to update single order item status
export const useUpdateOrderItemStatus = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<void, UpdateOrderItemStatusRequest>(
    (data) => updateOrderItemStatus(data),
    {
      successMessage: "Order item status updated",
      errorMessage: "Failed to update order item status",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: kitchenQueryKeys.orders() });
      },
    },
  );
};

// Hook to bulk update order items
export const useBulkUpdateOrderItems = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    void,
    BulkUpdateOrderItemsRequest,
    {
      previousOldOrders: KitchenOrder[] | undefined;
      previousNewOrders: KitchenOrder[] | undefined;
      oldStatus: string | null;
      newStatus: string;
    }
  >((data) => bulkUpdateOrderItems(data), {
    successMessage: "Order items updated successfully",
    errorMessage: "Failed to update order items",
    onMutate: async (variables) => {
      // Determine old status - could be from any status now
      let oldStatus: string | null = null;

      // Find which status column contains these items
      for (const status of ["accepted", "preparing", "ready"]) {
        const orders = queryClient.getQueryData<KitchenOrder[]>(
          kitchenQueryKeys.ordersByStatus(status),
        );
        if (
          orders?.some((order) =>
            order.orderItems.some((item) =>
              variables.orderItemIds.includes(item.id),
            ),
          )
        ) {
          oldStatus = status;
          break;
        }
      }

      if (!oldStatus)
        return {
          previousOldOrders: undefined,
          previousNewOrders: undefined,
          oldStatus: null,
          newStatus: variables.status,
        };

      const newStatus = variables.status;

      // Cancel outgoing refetches for both old and new status
      await queryClient.cancelQueries({
        queryKey: kitchenQueryKeys.ordersByStatus(oldStatus),
      });
      await queryClient.cancelQueries({
        queryKey: kitchenQueryKeys.ordersByStatus(newStatus),
      });

      // Snapshot previous values
      const previousOldOrders = queryClient.getQueryData<KitchenOrder[]>(
        kitchenQueryKeys.ordersByStatus(oldStatus),
      );
      const previousNewOrders = queryClient.getQueryData<KitchenOrder[]>(
        kitchenQueryKeys.ordersByStatus(newStatus),
      );

      // Find orders that contain the updated items
      const ordersToMove =
        previousOldOrders?.filter((order) =>
          order.orderItems.some((item) =>
            variables.orderItemIds.includes(item.id),
          ),
        ) || [];

      // Optimistically remove from old status
      if (previousOldOrders) {
        const updatedOldOrders = previousOldOrders.filter(
          (order) =>
            !order.orderItems.some((item) =>
              variables.orderItemIds.includes(item.id),
            ),
        );
        queryClient.setQueryData(
          kitchenQueryKeys.ordersByStatus(oldStatus),
          updatedOldOrders,
        );
      }

      // Optimistically add to new status
      if (ordersToMove.length > 0) {
        const updatedNewOrders = [
          ...(previousNewOrders || []),
          ...ordersToMove.map((order) => ({
            ...order,
            orderItems: order.orderItems.map((item) =>
              variables.orderItemIds.includes(item.id)
                ? { ...item, status: newStatus }
                : item,
            ),
          })),
        ];
        queryClient.setQueryData(
          kitchenQueryKeys.ordersByStatus(newStatus),
          updatedNewOrders,
        );
      }

      return { previousOldOrders, previousNewOrders, oldStatus, newStatus };
    },
    onSuccess: (_, variables, context) => {
      // Invalidate both old and new status to ensure UI is in sync with server
      if (context?.oldStatus) {
        queryClient.invalidateQueries({
          queryKey: kitchenQueryKeys.ordersByStatus(context.oldStatus),
        });
      }
      if (context?.newStatus) {
        queryClient.invalidateQueries({
          queryKey: kitchenQueryKeys.ordersByStatus(context.newStatus),
        });
      }
    },
    onError: (_, __, context) => {
      // Rollback on error - restore both old and new status
      if (context?.oldStatus && context?.previousOldOrders) {
        queryClient.setQueryData(
          kitchenQueryKeys.ordersByStatus(context.oldStatus),
          context.previousOldOrders,
        );
      }
      if (context?.newStatus && context?.previousNewOrders) {
        queryClient.setQueryData(
          kitchenQueryKeys.ordersByStatus(context.newStatus),
          context.previousNewOrders,
        );
      }
    },
  });
};

// Hook to reject order item
export const useRejectOrderItem = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<void, { orderItemId: string; reason: string }>(
    ({ orderItemId, reason }) => rejectOrderItem(orderItemId, { reason }),
    {
      successMessage: "Order item rejected",
      errorMessage: "Failed to reject order item",
      onSuccess: () => {
        // Invalidate accepted status as rejected items are removed from kitchen
        queryClient.invalidateQueries({
          queryKey: kitchenQueryKeys.ordersByStatus("accepted"),
        });
      },
    },
  );
};

// Hook to listen for real-time kitchen updates
export const useKitchenSocketListeners = () => {
  const queryClient = useQueryClient();
  const { subscribe, joinRestaurant, leaveRestaurant, isConnected } =
    useWebSocket();
  const { profile } = useAuth();

  useEffect(() => {
    if (!isConnected) return;

    // Join kitchen room with a small delay to ensure connection is stable
    const joinTimer = setTimeout(() => {
      // Get restaurant_id from user profile
      const restaurantId = profile?.restaurantId;
      joinRestaurant(restaurantId, "kitchen");
    }, 100);

    // Listen for new orders sent to kitchen
    const unsubscribeNewOrder = subscribe(
      KitchenSocketEvent.ORDERS_TO_PREPARE,
      (data: unknown) => {
        console.log("New order received in kitchen:", data);
        // Invalidate 'accepted' status as new orders arrive there
        queryClient.invalidateQueries({
          queryKey: kitchenQueryKeys.ordersByStatus("accepted"),
        });
      },
    );

    // Listen for order acceptance from waiter
    const unsubscribeOrderAccepted = subscribe(
      KitchenSocketEvent.ORDER_ACCEPTED,
      (payload: unknown) => {
        console.log(
          "Order accepted by waiter, refetching kitchen orders:",
          payload,
        );

        // Invalidate 'accepted' status as orders are accepted
        queryClient.invalidateQueries({
          queryKey: kitchenQueryKeys.ordersByStatus("accepted"),
        });
      },
    );

    return () => {
      clearTimeout(joinTimer);
      unsubscribeNewOrder();
      unsubscribeOrderAccepted();
      const restaurantId = profile?.restaurantId;
      if (restaurantId) {
        leaveRestaurant(restaurantId);
      }
    };
  }, [
    isConnected,
    subscribe,
    joinRestaurant,
    leaveRestaurant,
    queryClient,
    profile?.restaurantId,
  ]);
};

// Helper hook to compute kitchen stats
export const useKitchenStats = (orders: KitchenOrder[]) => {
  return useMemo(() => {
    const allItems = orders.flatMap((o) => o.orderItems);

    return {
      totalOrders: orders.length,
      receivedItems: allItems.filter((i) => i.status === "preparing").length,
      preparingItems: allItems.filter((i) => i.status === "preparing").length,
      readyItems: allItems.filter((i) => i.status === "ready").length,
      allItems: allItems.length,
    };
  }, [orders]);
};

// Helper to check if item is overdue
export const useIsItemOverdue = () => {
  return useCallback((item: KitchenOrder["orderItems"][0]): boolean => {
    const prepTime = item.menuItem.prepTimeMinutes || 15;
    const createdAt = new Date(item.createdAt).getTime();
    const now = Date.now();
    const elapsed = (now - createdAt) / 1000 / 60; // minutes

    return elapsed > prepTime;
  }, []);
};

// Helper to get elapsed time
export const useElapsedTime = () => {
  return useCallback((createdAt: string): string => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - created) / 1000 / 60); // minutes

    if (elapsed < 1) return "Just now";
    if (elapsed === 1) return "1 min ago";
    return `${elapsed} mins ago`;
  }, []);
};
