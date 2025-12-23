import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  QrCode,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  Users,
  XCircle,
  Circle,
} from "lucide-react";
import { Table, TableStatus } from "@/types/table-type";

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onUpdateStatus: (table: Table, newStatus: TableStatus) => void;
  onGenerateQR: (id: string) => void;
  onDownloadQR: (table: Table, format: "png" | "pdf") => void;
  onViewQR: (table: Table) => void;
  onDelete: (table: Table) => void;
  isGeneratingQR: boolean;
}

export function TableCard({
  table,
  onEdit,
  onUpdateStatus,
  onGenerateQR,
  onDownloadQR,
  onViewQR,
  onDelete,
  isGeneratingQR,
}: TableCardProps) {
  const getStatusStyles = () => {
    if (table.status === "available") {
      return "border-green-400 bg-green-50/30";
    }
    if (table.status === "occupied") {
      return "border-orange-400 bg-orange-50/30";
    }
    return "border-gray-300 bg-gray-100/50 opacity-75";
  };

  const getStatusBadge = () => {
    if (table.status === "available") {
      return (
        <Badge className="mt-1 font-semibold flex items-center gap-1 bg-transparent border-green-600 text-black">
          <CheckCircle className="h-3 w-3" />
          Available
        </Badge>
      );
    }
    if (table.status === "occupied") {
      return (
        <Badge className="mt-1 font-semibold flex items-center gap-1 bg-transparent border-orange-600 text-black">
          <Users className="h-3 w-3" />
          Occupied
        </Badge>
      );
    }
    return (
      <Badge className="mt-1 font-semibold flex items-center gap-1 bg-transparent border-gray-600 text-black">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg flex flex-col border-2 ${getStatusStyles()}`}
    >
      <CardContent className="flex flex-col flex-1">
        {/* Table Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {table.tableNumber}
            </h3>
            {getStatusBadge()}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(table)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {/* Status submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Circle className="mr-2 h-4 w-4" />
                  Change Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(table, "available")}
                    disabled={table.status === "available"}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Available
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(table, "occupied")}
                    disabled={table.status === "occupied"}
                  >
                    <Users className="mr-2 h-4 w-4 text-orange-600" />
                    Occupied
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(table, "inactive")}
                    disabled={table.status === "inactive"}
                  >
                    <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {table.qrCodeUrl && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onGenerateQR(table.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate QR
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadQR(table, "png")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadQR(table, "pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(table)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table Info */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{table.capacity} seats</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{table.location}</span>
          </div>
          {table.qrTokenCreatedAt && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">QR Created:</span>
              <span className="font-medium text-xs">
                {new Date(table.qrTokenCreatedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* QR Code Actions - Always at bottom */}
        <div className="flex gap-2 mt-auto pt-3">
          {table.qrCodeUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewQR(table)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              View QR
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onGenerateQR(table.id)}
              disabled={isGeneratingQR}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
