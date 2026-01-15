import { z } from "zod";

// Enums based on database types
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
  PAYMENT_PENDING = "payment_pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum OrderItemStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
}

// Schema for accepting/rejecting order items
export const acceptOrderItemSchema = z.object({
  note: z.string().optional(),
});

export const rejectOrderItemSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// Schema for sending orders to kitchen
export const sendToKitchenSchema = z.object({
  orderItemIds: z
    .array(z.string())
    .min(1, "At least one order item is required"),
});

// Schema for marking order as served
export const markAsServedSchema = z.object({
  orderItemIds: z
    .array(z.string())
    .min(1, "At least one order item is required"),
  note: z.string().optional(),
});

// Filter schema for orders list
export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  itemStatus: z.nativeEnum(OrderItemStatus).optional(),
  tableId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Status options for dropdowns
export const ORDER_ITEM_STATUS_OPTIONS = [
  { value: OrderItemStatus.PENDING, label: "Pending" },
  { value: OrderItemStatus.ACCEPTED, label: "Accepted" },
  { value: OrderItemStatus.REJECTED, label: "Rejected" },
  { value: OrderItemStatus.PREPARING, label: "Preparing" },
  { value: OrderItemStatus.READY, label: "Ready" },
  { value: OrderItemStatus.SERVED, label: "Served" },
] as const;

// Export types from schemas
export type AcceptOrderItemForm = z.infer<typeof acceptOrderItemSchema>;
export type RejectOrderItemForm = z.infer<typeof rejectOrderItemSchema>;
export type SendToKitchenForm = z.infer<typeof sendToKitchenSchema>;
export type MarkAsServedForm = z.infer<typeof markAsServedSchema>;
export type OrderFilter = z.infer<typeof orderFilterSchema>;
