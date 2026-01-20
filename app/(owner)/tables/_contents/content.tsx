"use client";

import { useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { useTableQuery } from "./use-table-query";
import { TableHeader } from "../_components/table-header";
import { TableFiltersSection } from "../_components/table-filters";
import { TableStats } from "../_components/table-stats";
import { TableGrid } from "../_components/table-grid";
import { DeleteTableDialog } from "../_components/delete-table-dialog";
import { TableQRDialog } from "../_components/table-qr-dialog";
import { TableForm } from "../_components/table-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableFilter, TableStatus } from "@/types/table-type";
import {
  downloadQRCode,
  downloadAllQRCodes,
  triggerDownload,
} from "@/api/table-api";
import { toast } from "react-toastify";

export function TablesContent() {
  // State management
  const [filters, setFilters] = useState<TableFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Queries and mutations
  const { tablesQuery, deleteMutation, statusMutation, generateQRMutation } =
    useTableQuery(filters);

  const { data: tables = [], isLoading, error } = tablesQuery;

  // Filter tables by search query
  const filteredTables = tables.filter((table) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      table.tableNumber.toLowerCase().includes(query) ||
      table.location.toLowerCase().includes(query)
    );
  });
  // Stats
  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    withQR: tables.filter((t) => t.qrUrl).length,
  };

  // Derive updated selectedTable from current tables data
  const currentSelectedTable = useMemo(() => {
    if (!selectedTable || !tablesQuery.isSuccess) return selectedTable;

    const updatedTable = tables.find((t) => t.id === selectedTable.id);
    return updatedTable || null;
  }, [selectedTable, tables, tablesQuery.isSuccess]);

  // Handlers
  const handleCreateClick = () => {
    setEditingTable(null);
    setTableDialogOpen(true);
  };

  const handleEditClick = (table: Table) => {
    setEditingTable(table);
    setTableDialogOpen(true);
  };

  const handleTableFormSuccess = () => {
    setTableDialogOpen(false);
    setEditingTable(null);
  };

  const handleDeleteClick = (table: Table) => {
    setSelectedTable(table);
    setDeleteDialogOpen(true);
  };

  const handleQRClick = (table: Table) => {
    setSelectedTable(table);
    setQrDialogOpen(true);
  };
  const handleUpdateStatus = (table: Table, newStatus: TableStatus) => {
    statusMutation.mutate({ id: table.id, status: newStatus });
  };

  const handleDownloadQR = async (table: Table, format: "png" | "pdf") => {
    try {
      const blob = await downloadQRCode(table.id, { format });
      triggerDownload(blob, `table-${table.tableNumber}-qr.${format}`);
      toast.success("QR code downloaded");
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  const handleDownloadAllQR = async (format: "png" | "pdf") => {
    try {
      const blob = await downloadAllQRCodes(format);
      triggerDownload(
        blob,
        `all-tables-qr.${format === "png" ? "zip" : "pdf"}`,
      );
      toast.success("All QR codes downloaded");
    } catch {
      toast.error("Failed to download QR codes");
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedTable) {
      deleteMutation.mutate(selectedTable.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedTable(null);
        },
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 p-4">
        {/* Header */}
        <TableHeader
          onCreateClick={handleCreateClick}
          onDownloadAll={handleDownloadAllQR}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <TableFiltersSection
            filters={filters}
            searchQuery={searchQuery}
            onFiltersChange={setFilters}
            onSearchChange={setSearchQuery}
          />
          {/* Stats */}
          <TableStats stats={stats} /> {/* Tables Grid */}
          <TableGrid
            tables={filteredTables}
            isLoading={isLoading}
            error={error as Error | null}
            onEdit={handleEditClick}
            onUpdateStatus={handleUpdateStatus}
            onGenerateQR={(id) => generateQRMutation.mutate(id)}
            onDownloadQR={handleDownloadQR}
            onViewQR={handleQRClick}
            onDelete={handleDeleteClick}
            isGeneratingQR={generateQRMutation.isPending}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteTableDialog
          open={deleteDialogOpen}
          table={currentSelectedTable}
          isDeleting={deleteMutation.isPending}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
        />

        {/* Create/Edit Table Dialog */}
        <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle>
                {editingTable ? "Edit Table" : "Create New Table"}
              </DialogTitle>
              <DialogDescription>
                {editingTable
                  ? "Update the table details below."
                  : "Add a new table to your restaurant. Fill in the details below."}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-4 pt-1">
              <TableForm
                table={editingTable || undefined}
                onSuccess={handleTableFormSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        {currentSelectedTable && (
          <TableQRDialog
            table={currentSelectedTable}
            open={qrDialogOpen}
            onOpenChange={setQrDialogOpen}
            onDownload={handleDownloadQR}
            onRegenerate={() =>
              generateQRMutation.mutate(currentSelectedTable.id)
            }
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
