import { z } from "zod";

// Enums for kitchen operations
export enum KitchenOrderStatus {
  RECEIVED = "accepted", // Just received from waiter (preparing status)
  PREPARING = "preparing",
  READY = "ready",
  COMPLETED = "completed", // All items picked up/served
}

export enum OrderItemStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
}

// Schema for updating order item status in kitchen
export const updateOrderItemStatusSchema = z.object({
  orderItemId: z.string().uuid(),
  status: z.enum(["preparing", "ready"]),
  note: z.string().optional(),
});

// Schema for bulk updating order items
export const bulkUpdateOrderItemsSchema = z.object({
  orderItemIds: z.array(z.string().uuid()).min(1),
  status: z.enum(["preparing", "ready"]),
});

// Schema for kitchen order filters
export const kitchenOrderFilterSchema = z.object({
  status: z.enum(["accepted", "preparing", "ready", "completed"]).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Export types
export type UpdateOrderItemStatusForm = z.infer<
  typeof updateOrderItemStatusSchema
>;
export type BulkUpdateOrderItemsForm = z.infer<
  typeof bulkUpdateOrderItemsSchema
>;
export type KitchenOrderFilter = z.infer<typeof kitchenOrderFilterSchema>;
