import api from "@/libs/api-request";
import { ApiResponse } from "@/types/api-type";
import {
  Table,
  TableStatus,
  CreateTableForm,
  UpdateTableForm,
  TableFilter,
  QRCodeDownloadOptions,
} from "@/types/table-type";

const TABLES_API = {
  BASE: "api/admin/tables",
  BY_ID: (id: string) => `api/admin/tables/${id}`,
  STATUS: (id: string) => `api/admin/tables/${id}/status`,
  GENERATE_QR: (id: string) => `api/admin/tables/${id}/qr/generate`,
  DOWNLOAD_QR: (id: string) => `api/admin/tables/${id}/qr/download`,
  DOWNLOAD_ALL_QR: "api/admin/tables/qr/download-all",
};

// Get all tables with optional filters
export const getTables = async (
  filters?: TableFilter,
): Promise<ApiResponse<Table[]>> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.location) params.append("location", filters.location);
  if (filters?.search) params.append("search", filters.search);

  const response = await api.get<ApiResponse<Table[]>>(
    `${TABLES_API.BASE}?${params.toString()}`,
  );
  return response.data;
};

// Get single table by ID
export const getTableById = async (id: string): Promise<ApiResponse<Table>> => {
  const response = await api.get<ApiResponse<Table>>(TABLES_API.BY_ID(id));
  return response.data;
};

// Create new table
export const createTable = async (
  data: CreateTableForm,
): Promise<ApiResponse<Table>> => {
  const response = await api.post<CreateTableForm, ApiResponse<Table>>(
    TABLES_API.BASE,
    data,
  );
  return response.data;
};

// Update table
export const updateTable = async (
  id: string,
  data: UpdateTableForm,
): Promise<ApiResponse<Table>> => {
  const response = await api.put<UpdateTableForm, ApiResponse<Table>>(
    TABLES_API.BY_ID(id),
    data,
  );
  return response.data;
};

export const updateTableStatus = async (
  id: string,
  status: TableStatus,
): Promise<ApiResponse<Table>> => {
  const response = await api.patch<{ status: TableStatus }, ApiResponse<Table>>(
    TABLES_API.STATUS(id),
    { status },
  );
  return response.data;
};

export const deleteTable = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(TABLES_API.BY_ID(id));
  return response.data;
};

export const generateQRCode = async (
  id: string,
): Promise<ApiResponse<Table>> => {
  const response = await api.post<undefined, ApiResponse<Table>>(
    TABLES_API.GENERATE_QR(id),
  );
  return response.data;
};

export const downloadQRCode = async (
  id: string,
  options: QRCodeDownloadOptions,
): Promise<Blob> => {
  const params = new URLSearchParams();
  params.append("format", options.format);
  if (options.includeLogo) params.append("includeLogo", "true");
  if (options.includeWifi) params.append("includeWifi", "true");

  const response = await api.get<Blob>(
    `${TABLES_API.DOWNLOAD_QR(id)}?${params.toString()}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

// Download all QR codes as ZIP
export const downloadAllQRCodes = async (
  format: "png" | "pdf" = "png",
): Promise<Blob> => {
  const response = await api.get<Blob>(
    `${TABLES_API.DOWNLOAD_ALL_QR}?format=${format}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

// Helper function to trigger file download
export const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
