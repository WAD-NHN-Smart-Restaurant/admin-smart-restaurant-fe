/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Data Transformation Utilities
 * Converts between frontend camelCase and backend snake_case formats
 */

import type {
  Table,
  CreateTableForm,
  UpdateTableForm,
} from "@/types/table-type";

/**
 * Transform frontend table data to backend format
 * Converts camelCase to snake_case
 */
export function toBackendTableFormat(
  table: Partial<CreateTableForm> | Partial<UpdateTableForm>,
) {
  const transformed: Record<string, any> = {};

  if (table.tableNumber !== undefined) {
    transformed.table_number = table.tableNumber;
  }
  if (table.capacity !== undefined) {
    transformed.capacity = table.capacity;
  }
  if (table.location !== undefined) {
    transformed.location = table.location;
  }
  if (table.description !== undefined) {
    transformed.description = table.description;
  }
  if ("status" in table && table.status !== undefined) {
    transformed.status = table.status;
  }

  return transformed;
}

/**
 * Transform backend table data to frontend format
 * Backend already transforms snake_case to camelCase via ResponseInterceptor
 */
export function toFrontendTableFormat(table: any): Table {
  return {
    id: table.id,
    tableNumber: table.tableNumber,
    restaurantId: table.restaurantId,
    capacity: table.capacity,
    location: table.location,
    description: table.description,
    status: table.status,
    qrTokenCreatedAt: table.qrTokenCreatedAt,
    qrUrl: table.qrUrl,
    createdAt: table.createdAt,
    updatedAt: table.updatedAt,
  };
}

/**
 * Transform array of backend tables to frontend format
 */
export function toFrontendTablesFormat(tables: any[]): Table[] {
  return tables.map(toFrontendTableFormat);
}

/**
 * Transform backend table response (with nested table property)
 */
export function toFrontendTableWithOrderStatus(data: any) {
  return {
    table: toFrontendTableFormat(data.table),
    hasActiveOrders: data.hasActiveOrders,
    activeOrderCount: data.activeOrderCount,
  };
}

/**
 * Transform backend staff member data to frontend format
 * Converts camelCase from backend to snake_case for frontend
 */
export function toFrontendStaffFormat(staff: any) {
  return {
    id: staff.id,
    email: staff.email,
    name: staff.name,
    role: staff.role,
    phone_number: staff.phoneNumber,
    avatar_url: staff.avatarUrl,
    is_active: staff.isActive,
    created_at: staff.createdAt,
    restaurant_id: staff.restaurantId,
  };
}

/**
 * Transform array of backend staff members to frontend format
 */
export function toFrontendStaffListFormat(staffList: any[]) {
  return staffList.map(toFrontendStaffFormat);
}
