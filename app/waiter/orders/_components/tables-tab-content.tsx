"use client";

import { useGetAssignedTables } from "@/hooks/use-waiter-query";
import { EmptyState } from "@/components/empty-state";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import { Bell, BellRing } from "lucide-react";
import { cn } from "@/utils/utils";
import { TableAssignment } from "@/types/waiter-type";

interface TablesTabContentProps {
  onCallWaiter?: (data: { table_id: string; timestamp: string }) => void;
  calledTableIds?: Set<string>;
  onClearTableCall?: (tableId: string) => void;
}

export function TablesTabContent({
  calledTableIds = new Set(),
  onClearTableCall,
}: TablesTabContentProps) {
  // Fetch assigned tables
  const { data: tablesData, isLoading } = useGetAssignedTables();
  const tables = tablesData || [];

  const handleTableClick = (tableId: string) => {
    // Clear the alert for this table when clicked
    onClearTableCall?.(tableId);
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "inactive":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  const getActiveOrdersCount = (table: TableAssignment) => {
    if (!table.orders || table.orders.length === 0) return 0;
    return table.orders.filter((order) => order.status === "active").length;
  };

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  if (tables.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <EmptyState
          title="No tables assigned"
          description="You don't have any tables assigned to you yet."
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          My Assigned Tables
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {tables.length} table(s) assigned to you
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((table) => {
          const isCalled = calledTableIds.has(table.id);
          const activeOrders = getActiveOrdersCount(table);

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => handleTableClick(table.id)}
              className={cn(
                "aspect-square relative flex flex-col items-center justify-center rounded-lg border-2 transition-all hover:shadow-lg",
                isCalled
                  ? "border-amber-500 bg-amber-50 animate-pulse"
                  : "border-gray-200 bg-white hover:border-gray-300",
                table.status === "inactive" && "opacity-50",
              )}
            >
              {/* Alert Icon for called tables */}
              {isCalled && (
                <div className="absolute top-2 right-2 animate-bounce">
                  <BellRing className="h-6 w-6 text-amber-600" />
                </div>
              )}

              {/* Active orders badge */}
              {activeOrders > 0 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {activeOrders}
                </div>
              )}

              {/* Table Number */}
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {table.tableNumber}
              </div>

              {/* Location */}
              <div className="text-xs text-gray-500 mb-2">{table.location}</div>

              {/* Capacity */}
              <div className="text-xs text-gray-600">
                {table.capacity} seats
              </div>

              {/* Status Indicator */}
              <div
                className={cn(
                  "absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full",
                  getTableStatusColor(table.status),
                )}
              />
            </button>
          );
        })}
      </div>

      {calledTableIds.size > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Bell className="h-5 w-5" />
            <p className="text-sm font-medium">
              {calledTableIds.size} table(s) need attention
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
