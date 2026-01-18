"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "./use-safe-query";
import { useSafeInfiniteQuery } from "./use-safe-infinite-query";
import { useSafeMutation } from "./use-safe-mutation";
import {
  getWaiterOrders,
  getOrderById,
  acceptOrderItem,
  rejectOrderItem,
  sendToKitchen,
  markAsServed,
  getAssignedTables,
  getOrdersByTableId,
} from "@/api/waiter-api";
import {
  OrderFilter,
  AcceptOrderItemRequest,
  RejectOrderItemRequest,
  SendToKitchenRequest,
  MarkAsServedRequest,
} from "@/types/waiter-type";
import { useEffect, useMemo } from "react";
import { useWebSocket, WaiterSocketEvent } from "@/context/websocket-context";
import { useAuth } from "@/context/auth-context";

// Query keys
export const waiterQueryKeys = {
  all: ["waiter"] as const,
  orders: () => [...waiterQueryKeys.all, "orders"] as const,
  pendingOrders: () => [...waiterQueryKeys.orders(), "pending"] as const,
  waiterOrders: (filters?: OrderFilter) =>
    [...waiterQueryKeys.orders(), "list", filters] as const,
  order: (id: string) => [...waiterQueryKeys.orders(), id] as const,
  assignedTables: () => [...waiterQueryKeys.all, "assigned-tables"] as const,
  tableOrders: (tableId: string) =>
    [...waiterQueryKeys.all, "table-orders", tableId] as const,
};

// Hook to get waiter orders
export const useGetWaiterOrders = (filters?: OrderFilter) => {
  const queryKey = useMemo(
    () => waiterQueryKeys.waiterOrders(filters),
    [filters],
  );

  return useSafeQuery(queryKey, () => getWaiterOrders(filters), {
    errorMessage: "Failed to fetch orders",
    staleTime: 30000,
  });
};

// Hook to get waiter orders with infinite scroll
export const useGetWaiterOrdersInfinite = (filters?: OrderFilter) => {
  return useSafeInfiniteQuery(
    [...waiterQueryKeys.orders(), "infinite", filters],
    ({ pageParam = 1 }) =>
      getWaiterOrders({ ...filters, page: pageParam as number }),
    {
      getNextPageParam: (lastPage, _) => {
        if (!lastPage.items || lastPage.items.length === 0) return undefined;
        const hasMore =
          lastPage.pagination.page < lastPage.pagination.totalPages;
        return hasMore ? lastPage.pagination.page + 1 : undefined;
      },
      initialPageParam: 1,
      errorMessage: "Failed to fetch orders",
      staleTime: 30000,
    },
  );
};

// Hook to get single order
export const useGetOrder = (id: string, enabled = true) => {
  const queryKey = useMemo(() => waiterQueryKeys.order(id), [id]);

  return useSafeQuery(queryKey, () => getOrderById(id), {
    enabled: enabled && !!id,
    errorMessage: "Failed to fetch order details",
  });
};

// Hook to get assigned tables
export const useGetAssignedTables = () => {
  return useSafeQuery(
    waiterQueryKeys.assignedTables(),
    () => getAssignedTables(),
    {
      errorMessage: "Failed to fetch assigned tables",
      staleTime: 60000, // 1 minute
    },
  );
};

// Hook to get orders by table ID
export const useGetOrdersByTable = (tableId: string, enabled = true) => {
  const queryKey = useMemo(
    () => waiterQueryKeys.tableOrders(tableId),
    [tableId],
  );

  return useSafeQuery(queryKey, () => getOrdersByTableId(tableId), {
    enabled: enabled && !!tableId,
    errorMessage: "Failed to fetch table orders",
  });
};

// Hook to accept order item
export const useAcceptOrderItem = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    void,
    { orderItemId: string; data: AcceptOrderItemRequest }
  >(({ orderItemId, data }) => acceptOrderItem(orderItemId, data), {
    successMessage: "Order item accepted successfully",
    errorMessage: "Failed to accept order item",
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: waiterQueryKeys.orders() });
    },
  });
};

// Hook to reject order item
export const useRejectOrderItem = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    void,
    { orderItemId: string; data: RejectOrderItemRequest }
  >(({ orderItemId, data }) => rejectOrderItem(orderItemId, data), {
    successMessage: "Order item rejected",
    errorMessage: "Failed to reject order item",
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: waiterQueryKeys.orders() });
    },
  });
};

// Hook to send orders to kitchen
export const useSendToKitchen = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<void, SendToKitchenRequest>(
    (data) => sendToKitchen(data),
    {
      successMessage: "Orders sent to kitchen",
      errorMessage: "Failed to send orders to kitchen",
      onSuccess: () => {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: waiterQueryKeys.orders() });
      },
    },
  );
};

// Hook to mark orders as served
export const useMarkAsServed = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<void, MarkAsServedRequest>(
    (data) => markAsServed(data),
    {
      successMessage: "Orders marked as served",
      errorMessage: "Failed to mark orders as served",
      onSuccess: () => {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: waiterQueryKeys.orders() });
      },
    },
  );
};

// Hook to listen for real-time order updates
export const useWaiterSocketListeners = (
  onUnseenUpdate?: (tabs: string[]) => void,
  onCallWaiter?: (data: { table_id: string; timestamp: string }) => void,
) => {
  const queryClient = useQueryClient();
  const { subscribe, joinRestaurant, leaveRestaurant, isConnected } =
    useWebSocket();
  const { user, profile } = useAuth();

  // Fetch assigned tables first
  const { data: tablesData } = useGetAssignedTables();
  const assignedTableIds = useMemo(
    () => (tablesData || []).map((t) => t.id),
    [tablesData],
  );

  useEffect(() => {
    if (!isConnected) return;

    // Join waiter room with a small delay to ensure connection is stable
    const joinTimer = setTimeout(() => {
      // Get restaurant_id from user profile
      const restaurantId = profile?.restaurantId;
      const waiterId = user?.id;

      // Join with assigned table IDs for targeted notifications
      joinRestaurant(restaurantId, "waiter", waiterId, assignedTableIds);
    }, 100);

    // Listen for new orders
    const unsubscribeNewOrder = subscribe(
      WaiterSocketEvent.NEW_ORDER,
      (data: unknown) => {
        console.log("New order received:", data);
        // Refetch immediately for real-time update
        queryClient.refetchQueries({
          queryKey: waiterQueryKeys.orders(),
        });
        // Notify parent about unseen updates in pending tab
        onUnseenUpdate?.(["pending"]);
      },
    );

    // Listen for order ready (kitchen finished preparing)
    const unsubscribeOrderReady = subscribe(
      WaiterSocketEvent.ORDER_READY,
      (data: unknown) => {
        console.log("Order ready:", data);
        // Refetch infinite queries for ready and accepted tabs
        queryClient.refetchQueries({
          queryKey: [...waiterQueryKeys.orders(), "infinite"],
        });
        // Notify parent about unseen updates in ready tab
        onUnseenUpdate?.(["ready"]);
      },
    );

    // Listen for call-waiter events
    const unsubscribeCallWaiter = subscribe(
      WaiterSocketEvent.CALL_WAITER,
      (data: unknown) => {
        console.log("Call waiter event received:", data);
        onCallWaiter?.(data as { table_id: string; timestamp: string });

        // Play sound notification
        const audio = new Audio("/sounds/noti.wav");
        audio.play().catch((err) => console.error("Error playing sound:", err));
      },
    );

    return () => {
      clearTimeout(joinTimer);
      unsubscribeNewOrder();
      unsubscribeOrderReady();
      unsubscribeCallWaiter();
      const restaurantId = profile?.restaurantId;
      if (restaurantId) {
        leaveRestaurant(restaurantId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    subscribe,
    joinRestaurant,
    leaveRestaurant,
    onUnseenUpdate,
    onCallWaiter,
    profile?.restaurantId,
    user?.id,
    assignedTableIds,
  ]);
};
