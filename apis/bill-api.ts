import api from "@/libs/api-request";
import {
  Bill,
  BillFilter,
  CreateBillRequest,
  ApplyDiscountRequest,
  ProcessPaymentRequest,
  BillDetails,
} from "@/types/bill-type";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationItems,
} from "@/types/api-type";

// Get bills with filtering and pagination - Fixed endpoint
export const getBills = async (
  filters?: BillFilter,
): Promise<PaginationItems<Bill>> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.tableId) params.append("tableNumber", filters.tableId);
  if (filters?.paymentStatus) params.append("status", filters.paymentStatus);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const response = await api.get<ApiPaginatedResponse<Bill>>(
    `/api/bills/restaurant/all?${params.toString()}`,
  );
  return response.data.data;
};

// Get single bill by order ID - Fixed endpoint
export const getBillById = async (orderId: string): Promise<Bill> => {
  const response = await api.get<ApiResponse<Bill>>(`/api/bills/${orderId}`);
  return response.data.data;
};

// Get bill by order ID
export const getBillByOrderId = async (orderId: string): Promise<Bill> => {
  const response = await api.get<ApiResponse<Bill>>(`/api/bills/${orderId}`);
  return response.data.data;
};

// Get bill by payment ID
export const getBillByPaymentId = async (
  paymentId: string,
): Promise<BillDetails> => {
  const response = await api.get<ApiResponse<BillDetails>>(
    `/api/bills/payment/${paymentId}`,
  );
  return response.data.data;
};

// Create bill for table
export const createBill = async (data: CreateBillRequest): Promise<Bill> => {
  const response = await api.post<CreateBillRequest, ApiResponse<Bill>>(
    "/api/bills",
    data,
  );
  return response.data.data;
};

// Apply discount to bill - Fixed endpoint
export const applyDiscount = async (
  orderId: string,
  data: ApplyDiscountRequest,
): Promise<Bill> => {
  const response = await api.post<ApplyDiscountRequest, ApiResponse<Bill>>(
    `/api/bills/${orderId}/discount`,
    data,
  );
  return response.data.data;
};

// Process payment - Fixed endpoint
export const processPayment = async (
  orderId: string,
  data: ProcessPaymentRequest,
): Promise<Bill> => {
  const response = await api.post<ProcessPaymentRequest, ApiResponse<Bill>>(
    `/api/bills/${orderId}/payment`,
    data,
  );
  return response.data.data;
};

// Print bill (download as PDF) - Fixed endpoint
export const printBill = async (billId: string): Promise<Blob> => {
  const response = await api.get<Blob>(`/api/bills/${billId}/print`, {
    responseType: "blob",
  });
  return response.data;
};
