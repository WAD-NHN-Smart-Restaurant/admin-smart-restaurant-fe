"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "./use-safe-query";
import { useSafeMutation } from "./use-safe-mutation";
import {
  getPendingOrders,
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

// Hook to get pending orders
export const useGetPendingOrders = () => {
  return useSafeQuery(
    waiterQueryKeys.pendingOrders(),
    () => getPendingOrders(),
    {
      errorMessage: "Failed to fetch pending orders",
      staleTime: 30000, // 30 seconds
    },
  );
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
export const useWaiterSocketListeners = () => {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  useEffect(() => {
    // Listen for new orders
    const unsubscribeNewOrder = subscribe(
      WaiterSocketEvent.NEW_ORDER,
      (data: unknown) => {
        console.log("New order received:", data);
        queryClient.invalidateQueries({
          queryKey: waiterQueryKeys.pendingOrders(),
        });
      },
    );

    // Listen for order ready (kitchen finished preparing)
    const unsubscribeOrderReady = subscribe(
      WaiterSocketEvent.ORDER_READY,
      (data: unknown) => {
        console.log("Order ready:", data);
        queryClient.invalidateQueries({
          queryKey: waiterQueryKeys.orders(),
        });
      },
    );

    return () => {
      unsubscribeNewOrder();
      unsubscribeOrderReady();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);
};
