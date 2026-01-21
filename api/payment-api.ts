import api from "@/libs/api-request";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationItems,
} from "@/types/api-type";
import { PaymentStatus } from "@/schema/bill-schema";

export interface PaymentAdminUpdate {
  id: string;
  orderId: string;
  status: PaymentStatus | string;
  paymentMethod?: string | null;
  discountRate?: number | null;
  discountAmount?: number | null;
  metadata?: Record<string, unknown> | null;
}

export type PaymentBill = {
  orderId: string;
  paymentId: string;
  tableNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  tax: number;
  tip: number;
  finalTotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PendingPayment = {
  paymentId: string;
  orderId: string;
  tableNumber: string;
  totalAmount: number;
  tax: number;
  discountAmount: number;
  finalTotal: number;
};

// Get completed payments with metadata (for Bills page)
export const getCompletedPayments = async (
  page: number = 1,
  limit: number = 50,
): Promise<PaginationItems<PaymentBill>> => {
  const response = await api.get<ApiPaginatedResponse<PaymentBill>>(
    `/api/payments/admin/completed?page=${page}&limit=${limit}`,
  );
  // ResponseInterceptor wraps as { success, data: { status, data } }
  const payload: any = response.data?.data;
  if (payload?.data) return payload.data as PaginationItems<PaymentBill>;
  return response.data.data;
};

// Get pending payment requests (for Create Bill dialog)
export const getPendingPayments = async (): Promise<PendingPayment[]> => {
  const response = await api.get<ApiResponse<PendingPayment[]>>(
    "/api/payments/admin/pending",
  );
  const payload: any = response.data?.data;
  if (payload?.data) return payload.data as PendingPayment[];
  return response.data.data;
};

export const acceptPaymentWithDiscount = async (
  paymentId: string,
  discountRate: number,
  discountAmount: number,
): Promise<PaymentAdminUpdate> => {
  const response = await api.post<
    { discountRate: number; discountAmount: number },
    ApiResponse<PaymentAdminUpdate>
  >(`/api/payments/admin/${paymentId}/accept`, {
    discountRate,
    discountAmount,
  });

  return response.data.data;
};

export const confirmCashPayment = async (
  paymentId: string,
): Promise<PaymentAdminUpdate> => {
  const response = await api.post<
    Record<string, never>,
    ApiResponse<PaymentAdminUpdate>
  >(`/api/payments/admin/${paymentId}/confirm`, {});

  return response.data.data;
};

