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

// Bill interface
export interface Bill {
  id: string;
  orderId: string;
  tableId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    status: string;
    createdAt: string;
    orderItems: Array<{
      id: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      menuItem: {
        id: string;
        name: string;
      };
      orderItemOptions: Array<{
        id: string;
        priceAtTime: number;
        modifierOption?: {
          id: string;
          name: string;
        };
      }>;
    }>;
  };
  table: {
    id: string;
    tableNumber: string;
    location?: string;
  };
  payments: Payment[];
}

// Request interfaces
export type CreateBillRequest = CreateBillForm;
export type ApplyDiscountRequest = ApplyDiscountForm;
export type ProcessPaymentRequest = ProcessPaymentForm;
