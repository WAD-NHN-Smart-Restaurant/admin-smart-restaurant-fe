import {
  OrderItemStatus,
  UpdateOrderItemStatusForm,
  BulkUpdateOrderItemsForm,
  KitchenOrderFilter,
  KitchenOrderStatus,
} from "@/schema/kitchen-schema";

export { OrderItemStatus, KitchenOrderStatus };
export type {
  UpdateOrderItemStatusForm,
  BulkUpdateOrderItemsForm,
  KitchenOrderFilter,
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

// Order Item interface for kitchen
export interface KitchenOrderItem {
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

// Kitchen Order interface (grouped by order)
export interface KitchenOrder {
  id: string;
  tableId: string;
  customerId?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  table: {
    id: string;
    tableNumber: string;
    capacity: number;
    location?: string;
  };
  orderItems: KitchenOrderItem[];
}

// Request interfaces
export interface UpdateOrderItemStatusRequest {
  orderItemId: string;
  status: "preparing" | "ready" | "accepted";
  note?: string;
}

export interface BulkUpdateOrderItemsRequest {
  orderItemIds: string[];
  status: "preparing" | "ready" | "accepted";
}

export interface RejectOrderItemRequest {
  reason: string;
}
