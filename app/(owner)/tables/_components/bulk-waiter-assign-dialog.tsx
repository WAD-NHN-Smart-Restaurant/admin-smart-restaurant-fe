"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useWaitersByRestaurant } from "../_contents/use-table-query";
import { Table } from "@/types/table-type";
import { cn } from "@/utils/utils";

interface BulkWaiterAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tables: Table[];
  onBulkAssign: (tableIds: string[], waiterId: string | null) => void;
  isAssigning: boolean;
}

export function BulkWaiterAssignDialog({
  open,
  onOpenChange,
  tables,
  onBulkAssign,
  isAssigning,
}: BulkWaiterAssignDialogProps) {
  const { profile } = useAuth();
  const waitersQuery = useWaitersByRestaurant(profile?.restaurantId);
  const [selectedWaiterId, setSelectedWaiterId] = useState<string | null>(null);
  const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(
    new Set(),
  );

  const waiters = waitersQuery.data?.data || [];
  const loading = waitersQuery.isLoading;

  const toggleTableSelection = (tableId: string) => {
    const newSelection = new Set(selectedTableIds);
    if (newSelection.has(tableId)) {
      newSelection.delete(tableId);
    } else {
      newSelection.add(tableId);
    }
    setSelectedTableIds(newSelection);
  };
  const resetSelection = () => {
    setSelectedTableIds(new Set());
    setSelectedWaiterId(null);
  };
  const handleSubmit = () => {
    if (selectedTableIds.size === 0) return;
    onBulkAssign(Array.from(selectedTableIds), selectedWaiterId);
    resetSelection();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isAssigning) {
      setSelectedTableIds(new Set());
      setSelectedWaiterId(null);
    }
    onOpenChange(newOpen);
  };

  const getWaiterName = (waiterId?: string | null) => {
    if (!waiterId) return "Unassigned";
    const waiter = waiters.find((w) => w.id === waiterId);
    return waiter?.fullName || "Unknown";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Waiter to Tables</DialogTitle>
          <DialogDescription>
            Select a waiter and then click on the tables you want to assign them
            to.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Waiter Selection */}
          <div className="space-y-2 sticky top-0 bg-white z-10 pb-4 border-b">
            <label className="text-sm font-medium">Select Waiter</label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select
                value={selectedWaiterId || "unassigned"}
                onValueChange={(value) =>
                  setSelectedWaiterId(value === "unassigned" ? null : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a waiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    Unassign (No waiter)
                  </SelectItem>
                  {waiters.map((waiter) => (
                    <SelectItem key={waiter.id} value={waiter.id}>
                      {waiter.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedTableIds.size > 0 && (
              <p className="text-sm text-gray-600">
                {selectedTableIds.size} table(s) selected
              </p>
            )}
          </div>

          {/* Table Grid */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Tables</label>
            <div className="grid md:grid-cols-4 gap-3">
              {tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => toggleTableSelection(table.id)}
                  className={cn(
                    "aspect-square relative flex flex-col items-center justify-center rounded-lg border-2 transition-all hover:shadow-md",
                    selectedTableIds.has(table.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300",
                    table.status === "inactive" && "opacity-50",
                  )}
                  //   disabled={table.status === "inactive"}
                >
                  {selectedTableIds.has(table.id) && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-gray-900">
                    {table.tableNumber}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center px-1 line-clamp-1">
                    {getWaiterName(table.assignedWaiterId)}
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full",
                      table.status === "available" && "bg-green-500",
                      table.status === "occupied" && "bg-red-500",
                      table.status === "inactive" && "bg-gray-400",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={selectedTableIds.size === 0 || isAssigning}
          >
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign to {selectedTableIds.size} Table(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
