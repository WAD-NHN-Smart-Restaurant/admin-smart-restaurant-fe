import { z } from "zod";

// Enums for payment
export enum PaymentMethod {
  CASH = "cash",
  ZALOPAY = "zalopay",
  MOMO = "momo",
  VNPAY = "vnpay",
  STRIPE = "stripe",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

// Schema for creating a bill
export const createBillSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

// Schema for applying discount
export const applyDiscountSchema = z.object({
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount value must be positive"),
  reason: z.string().optional(),
});

// Schema for processing payment
export const processPaymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
});

// Filter schema for bills
export const billFilterSchema = z.object({
  search: z.string().optional(),
  tableId: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Payment method options
export const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.CASH, label: "Cash" },
  { value: PaymentMethod.ZALOPAY, label: "ZaloPay" },
  { value: PaymentMethod.MOMO, label: "MoMo" },
  { value: PaymentMethod.VNPAY, label: "VNPay" },
  { value: PaymentMethod.STRIPE, label: "Stripe" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: PaymentStatus.PENDING, label: "Pending" },
  { value: PaymentStatus.SUCCESS, label: "Success" },
  { value: PaymentStatus.FAILED, label: "Failed" },
] as const;

// Export types from schemas
export type CreateBillForm = z.infer<typeof createBillSchema>;
export type ApplyDiscountForm = z.infer<typeof applyDiscountSchema>;
export type ProcessPaymentForm = z.infer<typeof processPaymentSchema>;
export type BillFilter = z.infer<typeof billFilterSchema>;
