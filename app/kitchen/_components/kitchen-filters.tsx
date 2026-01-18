"use client";

import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { KitchenOrderFilter } from "@/types/kitchen-type";

interface KitchenFiltersProps {
  filters: KitchenOrderFilter;
  onFiltersChange: (filters: KitchenOrderFilter) => void;
}

export const KitchenFilters = memo(function KitchenFilters({
  filters,
  onFiltersChange,
}: KitchenFiltersProps) {
  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, search: value || undefined });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status:
          value === "all"
            ? undefined
            : (value as "accepted" | "preparing" | "ready" | "completed"),
      });
    },
    [filters, onFiltersChange],
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by table number or item name..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-[200px]">
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="accepted">Received</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
});
