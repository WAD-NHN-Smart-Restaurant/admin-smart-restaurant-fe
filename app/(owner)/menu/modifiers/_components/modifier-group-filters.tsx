import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import {
  ModifierGroupStatus,
  ModifierSelectionType,
} from "@/types/modifier-type";
import { ModifierGroupFilterForm } from "@/schema/modifier-schema";

interface ModifierGroupFiltersProps {
  filters: ModifierGroupFilterForm;
  onFiltersChange: (filters: Partial<ModifierGroupFilterForm>) => void;
  isLoading: boolean;
}

export function ModifierGroupFilters({
  filters,
  onFiltersChange,
  isLoading,
}: ModifierGroupFiltersProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({ search: e.target.value });
    },
    [onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        status: value === "all" ? undefined : (value as ModifierGroupStatus),
      });
    },
    [onFiltersChange],
  );

  const handleSelectionTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        selectionType:
          value === "all" ? undefined : (value as ModifierSelectionType),
      });
    },
    [onFiltersChange],
  );

  const handleSortByChange = useCallback(
    (value: string) => {
      onFiltersChange({
        sortBy: value as "name" | "displayOrder" | "createdAt",
      });
    },
    [onFiltersChange],
  );

  const handleSortOrderChange = useCallback(
    (value: string) => {
      onFiltersChange({ sortOrder: value as "asc" | "desc" });
    },
    [onFiltersChange],
  );

  const handleReset = useCallback(() => {
    onFiltersChange({
      search: "",
      status: undefined,
      selectionType: undefined,
      sortBy: "displayOrder",
      sortOrder: "asc",
    });
  }, [onFiltersChange]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Search and Reset */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search modifier groups..."
                value={filters.search || ""}
                onChange={handleSearchChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Filters Row */}
          <div className="flex md:flex-row flex-col gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={handleStatusChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ModifierGroupStatus.ACTIVE}>
                    Active
                  </SelectItem>
                  <SelectItem value={ModifierGroupStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selection Type Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Selection Type
              </label>
              <Select
                value={filters.selectionType || "all"}
                onValueChange={handleSelectionTypeChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ModifierSelectionType.SINGLE}>
                    Single Selection
                  </SelectItem>
                  <SelectItem value={ModifierSelectionType.MULTIPLE}>
                    Multiple Selection
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Sort By
              </label>
              <Select
                value={filters.sortBy || "displayOrder"}
                onValueChange={handleSortByChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="displayOrder">Display Order</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Order
              </label>
              <Select
                value={filters.sortOrder || "asc"}
                onValueChange={handleSortOrderChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
