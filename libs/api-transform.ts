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
 * Converts snake_case to camelCase
 */
export function toFrontendTableFormat(table: any): Table {
  return {
    id: table.id,
    tableNumber: table.table_number,
    capacity: table.capacity,
    location: table.location,
    description: table.description,
    status: table.status,
    qrToken: table.qr_token,
    qrTokenCreatedAt: table.qr_token_created_at,
    qrCodeUrl: table.qrUrl,
    createdAt: table.created_at,
    updatedAt: table.updated_at,
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
