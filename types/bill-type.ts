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
  tableNumber: string;
  totalAmount: number;
  status: string;
  itemCount: number;
  paymentStatus?: string;
  paymentMethod?: string;
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
    payments: Payment[];
    createdAt: string;
    updatedAt: string;
  };
}

// Request interfaces
export type CreateBillRequest = CreateBillForm;
export type ApplyDiscountRequest = ApplyDiscountForm;
export type ProcessPaymentRequest = ProcessPaymentForm;
