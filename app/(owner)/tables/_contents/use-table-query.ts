"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "@/hooks/use-safe-query";
import { useSafeMutation } from "@/hooks/use-safe-mutation";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
  generateQRCode,
} from "@/api/table-api";
import {
  TableFilter,
  TableStatus,
  CreateTableForm,
  UpdateTableForm,
} from "@/types/table-type";

export function useTableQuery(filters: TableFilter) {
  const queryClient = useQueryClient();

  // Fetch tables query
  const tablesQuery = useSafeQuery(
    ["tables", filters],
    () => getTables(filters),
    {
      errorMessage: "Failed to load tables",
    },
  );

  // Delete mutation
  const deleteMutation = useSafeMutation((id: string) => deleteTable(id), {
    successMessage: "Table deleted successfully",
    errorMessage: "Failed to delete table",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });

  // Status toggle mutation
  const statusMutation = useSafeMutation(
    ({ id, status }: { id: string; status: TableStatus }) =>
      updateTableStatus(id, status),
    {
      successMessage: "Table status updated",
      errorMessage: "Failed to update status",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
      },
    },
  );

  // Generate QR mutation
  const generateQRMutation = useSafeMutation(
    (id: string) => generateQRCode(id),
    {
      successMessage: "QR code generated successfully",
      errorMessage: "Failed to generate QR code",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
      },
    },
  );

  // Create table mutation
  const createMutation = useSafeMutation(
    (data: CreateTableForm) => createTable(data),
    {
      successMessage: "Table created successfully",
      errorMessage: "Failed to create table",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
      },
    },
  );

  // Update table mutation
  const updateMutation = useSafeMutation(
    ({ id, data }: { id: string; data: UpdateTableForm }) =>
      updateTable(id, data),
    {
      successMessage: "Table updated successfully",
      errorMessage: "Failed to update table",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
      },
    },
  );

  return {
    tablesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    statusMutation,
    generateQRMutation,
  };
}
