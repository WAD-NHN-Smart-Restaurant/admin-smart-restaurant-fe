import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableStatus } from "@/types/table-type";
import { TableCard } from "./table-card";

interface TableGridProps {
  tables: Table[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (table: Table) => void;
  onUpdateStatus: (table: Table, newStatus: TableStatus) => void;
  onGenerateQR: (id: string) => void;
  onDownloadQR: (table: Table, format: "png" | "pdf") => void;
  onViewQR: (table: Table) => void;
  onDelete: (table: Table) => void;
  isGeneratingQR: boolean;
}

export function TableGrid({
  tables,
  isLoading,
  error,
  onEdit,
  onUpdateStatus,
  onGenerateQR,
  onDownloadQR,
  onViewQR,
  onDelete,
  isGeneratingQR,
}: TableGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tables ({tables.length})</CardTitle>
        <CardDescription>View and manage all restaurant tables</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading tables...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error loading tables: {error.message}
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tables found. Add your first table to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onEdit={onEdit}
                onUpdateStatus={onUpdateStatus}
                onGenerateQR={onGenerateQR}
                onDownloadQR={onDownloadQR}
                onViewQR={onViewQR}
                onDelete={onDelete}
                isGeneratingQR={isGeneratingQR}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
