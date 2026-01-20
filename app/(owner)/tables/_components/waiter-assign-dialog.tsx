"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useWaitersByRestaurant } from "../_contents/use-table-query";

interface WaiterAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
  tableNumber: string;
  currentWaiterId?: string | null;
  onAssign: (waiterId: string | null) => void;
}

export function WaiterAssignDialog({
  open,
  onOpenChange,
  tableNumber,
  currentWaiterId,
  onAssign,
}: WaiterAssignDialogProps) {
  const { profile } = useAuth();
  const waitersQuery = useWaitersByRestaurant(profile?.restaurantId);

  const waiters = waitersQuery.data?.data || [];
  const loading = waitersQuery.isLoading;

  const handleAssign = (waiterId: string | null) => {
    onAssign(waiterId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Waiter to Table {tableNumber}</DialogTitle>
          <DialogDescription>
            Select a waiter to assign to this table, or unassign the current
            waiter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : waiters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No waiters available
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Waiter</label>
                <Select
                  value={currentWaiterId || "unassigned"}
                  onValueChange={(value) =>
                    handleAssign(value === "unassigned" ? null : value)
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
                        <div className="flex items-center gap-2">
                          <span>{waiter.fullName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
