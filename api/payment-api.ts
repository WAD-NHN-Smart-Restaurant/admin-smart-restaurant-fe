import api from "@/libs/api-request";
import { ApiResponse } from "@/types/api-type";
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
