"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "./use-safe-query";
import { useSafeMutation } from "./use-safe-mutation";
import {
  getBills,
  getBillById,
  getBillByOrderId,
  getBillByPaymentId,
  createBill,
  applyDiscount,
  processPayment,
  printBill,
} from "@/api/bill-api";
import {
  acceptPaymentWithDiscount,
  confirmCashPayment,
  getCompletedPayments,
  getPendingPayments,
  // PaymentBill,
  // PendingPayment,
} from "@/api/payment-api";
import {
  Bill,
  BillFilter,
  CreateBillRequest,
  ApplyDiscountRequest,
  ProcessPaymentRequest,
} from "@/types/bill-type";
import { useCallback, useMemo } from "react";

// Query keys
export const billQueryKeys = {
  all: ["bills"] as const,
  list: (filters?: BillFilter) =>
    [...billQueryKeys.all, "list", filters] as const,
  detail: (id: string) => [...billQueryKeys.all, "detail", id] as const,
  byOrder: (orderId: string) =>
    [...billQueryKeys.all, "by-order", orderId] as const,
  byPayment: (paymentId: string) =>
    [...billQueryKeys.all, "by-payment", paymentId] as const,
};

export const paymentQueryKeys = {
  all: ["payments"] as const,
  completed: (page?: number, limit?: number) =>
    [...paymentQueryKeys.all, "completed", page, limit] as const,
  pending: () => [...paymentQueryKeys.all, "pending"] as const,
};

// Hook to get completed payments (for Bills page)
export const useGetCompletedPayments = (
  page: number = 1,
  limit: number = 50,
) => {
  const queryKey = useMemo(
    () => paymentQueryKeys.completed(page, limit),
    [page, limit],
  );

  return useSafeQuery(queryKey, () => getCompletedPayments(page, limit), {
    errorMessage: "Failed to fetch payments",
    staleTime: 30000, // 30 seconds
  });
};

// Hook to get pending payment requests (for Create Bill dialog)
export const useGetPendingPayments = () => {
  const queryKey = useMemo(() => paymentQueryKeys.pending(), []);

  return useSafeQuery(queryKey, () => getPendingPayments(), {
    errorMessage: "Failed to fetch pending payments",
    staleTime: 10000, // 10 seconds
  });
};

// Hook to get bills with filters (keep for compatibility)
export const useGetBills = (filters?: BillFilter) => {
  const queryKey = useMemo(() => billQueryKeys.list(filters), [filters]);

  return useSafeQuery(queryKey, () => getBills(filters), {
    errorMessage: "Failed to fetch bills",
    staleTime: 30000, // 30 seconds
  });
};

// Hook to get single bill by ID
export const useGetBill = (id: string, enabled = true) => {
  const queryKey = useMemo(() => billQueryKeys.detail(id), [id]);

  return useSafeQuery(queryKey, () => getBillById(id), {
    enabled: enabled && !!id,
    errorMessage: "Failed to fetch bill details",
  });
};

// Hook to get bill by order ID
export const useGetBillByOrder = (orderId: string, enabled = true) => {
  const queryKey = useMemo(() => billQueryKeys.byOrder(orderId), [orderId]);

  return useSafeQuery(queryKey, () => getBillByOrderId(orderId), {
    enabled: enabled && !!orderId,
    errorMessage: "Failed to fetch bill for order",
  });
};

// Hook to get bill by payment ID
export const useGetBillByPayment = (paymentId: string, enabled = true) => {
  const queryKey = useMemo(
    () => billQueryKeys.byPayment(paymentId),
    [paymentId],
  );

  return useSafeQuery(queryKey, () => getBillByPaymentId(paymentId), {
    enabled: enabled && !!paymentId,
    errorMessage: "Failed to fetch bill for payment",
  });
};

// Hook to create bill
export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<Bill, CreateBillRequest>((data) => createBill(data), {
    successMessage: "Bill created successfully",
    errorMessage: "Failed to create bill",
    onSuccess: (data) => {
      // Invalidate bills list
      queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      // Set the new bill in cache
      queryClient.setQueryData(billQueryKeys.detail(data.orderId), data);
      if (data.orderId) {
        queryClient.setQueryData(billQueryKeys.byOrder(data.orderId), data);
      }
    },
  });
};

// Hook to apply discount
export const useApplyDiscount = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<Bill, { orderId: string; data: ApplyDiscountRequest }>(
    ({ orderId, data }) => applyDiscount(orderId, data),
    {
      successMessage: "Discount applied successfully",
      errorMessage: "Failed to apply discount",
      onSuccess: () => {
        // Invalidate all bill queries to refresh everything
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      },
    },
  );
};

// Hook to process payment
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    Bill,
    { orderId: string; data: ProcessPaymentRequest }
  >(({ orderId, data }) => processPayment(orderId, data), {
    successMessage: "Payment processed successfully",
    errorMessage: "Failed to process payment",
    onSuccess: (data) => {
      // Update bill in cache
      queryClient.setQueryData(billQueryKeys.detail(data.orderId), data);
      if (data.orderId) {
        queryClient.setQueryData(billQueryKeys.byOrder(data.orderId), data);
      }
      // Invalidate list to refresh
      queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
    },
  });
};

// Hook to accept payment request with discount (waiter)
export const useAcceptPaymentWithDiscount = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    Awaited<ReturnType<typeof acceptPaymentWithDiscount>>,
    { paymentId: string; discountRate: number; discountAmount?: number }
  >(
    ({ paymentId, discountRate, discountAmount = 0 }) =>
      acceptPaymentWithDiscount(paymentId, discountRate, discountAmount),
    {
      successMessage: "Bill request accepted",
      errorMessage: "Failed to accept bill request",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      },
    },
  );
};

// Hook to confirm cash payment (manual success)
export const useConfirmCashPayment = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    Awaited<ReturnType<typeof confirmCashPayment>>,
    string
  >((paymentId: string) => confirmCashPayment(paymentId), {
    successMessage: "Payment confirmed",
    errorMessage: "Failed to confirm payment",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      if (data?.orderId) {
        queryClient.invalidateQueries({
          queryKey: billQueryKeys.detail(data.orderId),
        });
        queryClient.invalidateQueries({
          queryKey: billQueryKeys.byOrder(data.orderId),
        });
      }
    },
  });
};

// Hook to print bill
export const usePrintBill = () => {
  return useSafeMutation<Blob, string>((billId) => printBill(billId), {
    successMessage: "Bill downloaded successfully",
    errorMessage: "Failed to download bill",
    onSuccess: useCallback((blob: Blob, billId: string) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bill-${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, []),
  });
};

// Hook to accept payment with discount (mark as accepted)
export const useAcceptPayment = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<
    unknown,
    { paymentId: string; discountRate: number; discountAmount: number }
  >(
    ({ paymentId, discountRate, discountAmount }) =>
      acceptPaymentWithDiscount(paymentId, discountRate, discountAmount),
    {
      successMessage: "Payment accepted and discount applied successfully",
      errorMessage: "Failed to accept payment",
      onSuccess: () => {
        // Invalidate all bill queries to refresh everything
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      },
    },
  );
};

// Hook to confirm cash payment (mark as success)
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useSafeMutation<unknown, string>(
    (paymentId) => confirmCashPayment(paymentId),
    {
      successMessage: "Payment confirmed successfully",
      errorMessage: "Failed to confirm payment",
      onSuccess: () => {
        // Invalidate all bill queries to refresh everything
        queryClient.invalidateQueries({ queryKey: billQueryKeys.all });
      },
    },
  );
};
