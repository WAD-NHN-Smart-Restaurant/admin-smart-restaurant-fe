"use client";

import { Table } from "@/types/table-type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  RefreshCw,
  Calendar,
  Printer,
  CheckCircle,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";

interface TableQRDialogProps {
  table: Table;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (table: Table, format: "png" | "pdf") => void;
  onRegenerate: () => void;
}

export function TableQRDialog({
  table,
  open,
  onOpenChange,
  onDownload,
  onRegenerate,
}: TableQRDialogProps) {
  function printQRCode(_url: string, _tableNumber: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - Table {table.tableNumber}</DialogTitle>
          <DialogDescription>
            Scan this QR code to access the menu for this table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center items-center bg-white p-6 rounded-lg border">
            {table.qrCodeUrl ? (
              <div className="relative w-64 h-64">
                <Image
                  src={table.qrCodeUrl}
                  alt={`QR Code for table ${table.tableNumber}`}
                  fill
                  className="object-contain"
                  unoptimized // For base64 images
                />
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-muted-foreground">
                QR Code not available
              </div>
            )}
          </div>

          {/* Table Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Table Number:</span>
              <span className="font-medium">{table.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{table.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">{table.capacity} seats</span>
            </div>{" "}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                className={`mt-1 font-semibold flex items-center gap-1 ${
                  table.status === "available"
                    ? "bg-transparent border-green-600 text-black"
                    : table.status === "occupied"
                      ? " bg-transparent border-orange-600 text-black"
                      : "bg-transparent border-gray-600 text-black"
                }`}
              >
                {table.status === "available" ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Available
                  </>
                ) : table.status === "occupied" ? (
                  <>
                    <Users className="h-3 w-3" />
                    Occupied
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>
            {table.qrTokenCreatedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">QR Generated:</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(table.qrTokenCreatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            {table.qrCodeUrl && (
              <Button
                variant="outline"
                onClick={() => printQRCode(table.qrCodeUrl!, table.tableNumber)}
                className="w-full sm:w-auto"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onDownload(table, "png")}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button
              onClick={() => onDownload(table, "pdf")}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
