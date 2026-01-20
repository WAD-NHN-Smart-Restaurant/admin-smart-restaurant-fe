import {
  PaymentMethod,
  PaymentStatus,
  CreateBillForm,
  ApplyDiscountForm,
  ProcessPaymentForm,
  BillFilter,
} from "@/schema/bill-schema";

export { PaymentMethod, PaymentStatus };
export type {
  CreateBillForm,
  ApplyDiscountForm,
  ProcessPaymentForm,
  BillFilter,
};

// Payment interface
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// Bill interface (matches API response from getBillsByRestaurant)
export interface Bill {
  orderId: string;
  paymentId?: string;
  tableId?: string;
  tableNumber: string;
  totalAmount: number;
  tax?: number;
  discountAmount?: number;
  finalTotal?: number;
  status: string;
  itemCount: number;
  paymentStatus?: PaymentStatus;
  discountRate?: number | null;
  paymentMethod?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// Detailed Bill interface (for getBill endpoint)
export interface BillDetails {
  bill: {
    orderId: string;
    tableNumber: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      modifiers?: Array<{
        name: string;
        price: number;
      }>;
      totalPrice: number;
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    status: string;
    payments: Array<{
      id: string;
      amount: number;
      status: string;
      currency: string | null;
      metadata: Record<string, unknown> | null;
      orderId: string;
      createdAt: string;
      updatedAt: string;
      qrCodeUrl: string | null;
      checkoutUrl: string | null;
      paymentMethod: string | null;
      providerOrderCode: string | null;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

// Request interfaces
export type CreateBillRequest = CreateBillForm;
export type ApplyDiscountRequest = ApplyDiscountForm;
export type ProcessPaymentRequest = ProcessPaymentForm;
