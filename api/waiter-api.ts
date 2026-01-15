import api from "@/libs/api-request";
import {
  Order,
  OrderFilter,
  AcceptOrderItemRequest,
  RejectOrderItemRequest,
  SendToKitchenRequest,
  MarkAsServedRequest,
  TableAssignment,
} from "@/types/waiter-type";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationItems,
} from "@/types/api-type";

// Get all orders for waiter
export const getWaiterOrders = async (
  filters?: OrderFilter,
): Promise<PaginationItems<Order>> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.tableId) params.append("tableId", filters.tableId);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const response = await api.get<ApiPaginatedResponse<Order>>(
    `/api/waiter/orders?${params.toString()}`,
  );
  return response.data.data;
};

// Get single order by ID
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(
    `/api/waiter/orders/${id}`,
  );
  return response.data.data;
};

// Accept order item - Fixed endpoint to match backend
export const acceptOrderItem = async (
  orderItemId: string,
  data: AcceptOrderItemRequest,
): Promise<void> => {
  await api.post<AcceptOrderItemRequest, ApiResponse<void>>(
    `/api/waiter/orders/items/${orderItemId}/accept`,
    data,
  );
};

// Reject order item - Fixed endpoint to match backend
export const rejectOrderItem = async (
  orderItemId: string,
  data: RejectOrderItemRequest,
): Promise<void> => {
  await api.post<RejectOrderItemRequest, ApiResponse<void>>(
    `/api/waiter/orders/items/${orderItemId}/reject`,
    data,
  );
};

// Send orders to kitchen
export const sendToKitchen = async (
  data: SendToKitchenRequest,
): Promise<void> => {
  await api.post<SendToKitchenRequest, ApiResponse<void>>(
    "/api/waiter/orders/send-to-kitchen",
    data,
  );
};

// Mark orders as served
export const markAsServed = async (
  data: MarkAsServedRequest,
): Promise<void> => {
  await api.post<MarkAsServedRequest, ApiResponse<void>>(
    "/api/waiter/orders/mark-served",
    data,
  );
};

// Get assigned tables for waiter - Fixed endpoint to match backend
export const getAssignedTables = async (): Promise<TableAssignment[]> => {
  const response =
    await api.get<ApiResponse<TableAssignment[]>>("/api/waiter/tables");
  return response.data.data;
};

// Get orders by table ID
export const getOrdersByTableId = async (tableId: string): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>(
    `/api/waiter/tables/${tableId}/orders`,
  );
  return response.data.data;
};
