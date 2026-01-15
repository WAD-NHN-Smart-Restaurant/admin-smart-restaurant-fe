import {
  OrderStatus,
  OrderItemStatus,
  AcceptOrderItemForm,
  RejectOrderItemForm,
  SendToKitchenForm,
  MarkAsServedForm,
  OrderFilter,
} from "@/schema/waiter-schema";

export { OrderStatus, OrderItemStatus };
export type {
  AcceptOrderItemForm,
  RejectOrderItemForm,
  SendToKitchenForm,
  MarkAsServedForm,
  OrderFilter,
};

// Order Item Option interface
export interface OrderItemOption {
  id: string;
  orderItemId: string;
  modifierOptionId: string;
  priceAtTime: number;
  createdAt: string;
  modifierOption?: {
    id: string;
    name: string;
    priceAdjustment: number;
  };
}

// Order Item interface
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: OrderItemStatus;
  createdAt: string;
  updatedAt: string;
  menuItem: {
    id: string;
    name: string;
    description?: string;
    categoryName?: string;
    prepTimeMinutes?: number;
  };
  orderItemOptions: OrderItemOption[];
}

// Order interface
export interface Order {
  id: string;
  orderNumber?: string;
  tableId: string;
  customerId?: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  table: {
    id: string;
    tableNumber: string;
    capacity: number;
    location?: string;
  };
  customer?: {
    id: string;
    fullName?: string;
    phoneNumber?: string;
  };
  orderItems: OrderItem[];
}

// Table assignment interface
export interface TableAssignment {
  id: string;
  waiterId: string;
  tableId: string;
  assignedAt: string;
  table: {
    id: string;
    tableNumber: string;
    capacity: number;
    location?: string;
    status: string;
  };
}

// Request interfaces
export type AcceptOrderItemRequest = AcceptOrderItemForm;
export type RejectOrderItemRequest = RejectOrderItemForm;
export type SendToKitchenRequest = SendToKitchenForm;
export type MarkAsServedRequest = MarkAsServedForm;
