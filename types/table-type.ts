import { z } from "zod";
import {
  tableSchema,
  updateTableSchema,
  tableFilterSchema,
} from "@/schema/table-schema";

export type TableStatus = "available" | "inactive" | "occupied";

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  description?: string;
  status: TableStatus;
  qrToken?: string;
  qrTokenCreatedAt?: string;
  qrCodeUrl?: string; // Backend will send QR code image URL or base64
  createdAt: string;
  updatedAt: string;
}

export interface TableSortOptions {
  field: "tableNumber" | "capacity" | "createdAt" | "location";
  order: "asc" | "desc";
}

export interface QRCodeDownloadOptions {
  format: "png" | "pdf";
  tableId?: string;
  includeLogo?: boolean;
  includeWifi?: boolean;
}

export const TABLE_LOCATIONS = [
  "Indoor",
  "Outdoor",
  "Patio",
  "VIP Room",
  "Main Hall",
  "Balcony",
  "Garden",
] as const;

export type TableLocation = (typeof TABLE_LOCATIONS)[number];

export type CreateTableForm = z.infer<typeof tableSchema>;
export type UpdateTableForm = z.infer<typeof updateTableSchema>;
export type TableFilter = z.infer<typeof tableFilterSchema>;
