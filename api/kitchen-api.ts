import api from "@/libs/api-request";
import {
  KitchenOrder,
  UpdateOrderItemStatusRequest,
  BulkUpdateOrderItemsRequest,
  KitchenOrderFilter,
} from "@/types/kitchen-type";
import { ApiResponse } from "@/types/api-type";

// Get kitchen orders (orders with items in preparing or ready status)
export const getKitchenOrders = async (
  filters?: KitchenOrderFilter,
): Promise<KitchenOrder[]> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);

  const queryString = params.toString();
  const url = `/api/kitchen/orders${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<ApiResponse<KitchenOrder[]>>(url);
  return response.data.data;
};

// Update single order item status
export const updateOrderItemStatus = async (
  data: UpdateOrderItemStatusRequest,
): Promise<void> => {
  await api.patch<UpdateOrderItemStatusRequest, ApiResponse<void>>(
    `/api/kitchen/order-items/${data.orderItemId}/status`,
    data,
  );
};

// Bulk update order items status
export const bulkUpdateOrderItems = async (
  data: BulkUpdateOrderItemsRequest,
): Promise<void> => {
  await api.patch<BulkUpdateOrderItemsRequest, ApiResponse<void>>(
    `/api/kitchen/order-items/bulk-update`,
    data,
  );
};

// Reject order item
export const rejectOrderItem = async (
  orderItemId: string,
  data: { reason: string },
): Promise<void> => {
  await api.post<{ reason: string }, ApiResponse<void>>(
    `/api/kitchen/order-items/${orderItemId}/reject`,
    data,
  );
};
