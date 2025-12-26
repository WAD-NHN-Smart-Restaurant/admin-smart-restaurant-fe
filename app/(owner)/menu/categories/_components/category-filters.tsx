"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, RefreshCw } from "lucide-react";
import { CategoryStatus } from "@/types/category-type";
import { CategoryFilterForm } from "@/schema/category-schema";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface CategoryFiltersProps {
  filters: CategoryFilterForm;
  onFiltersChange: (filters: Partial<CategoryFilterForm>) => void;
  isLoading: boolean;
}

export function CategoryFilters({
  filters,
  onFiltersChange,
  isLoading,
}: CategoryFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch });
  }, [debouncedSearch, onFiltersChange]);

  const handleReset = () => {
    setSearchInput("");
    onFiltersChange({
      search: "",
      status: undefined,
      sortBy: "displayOrder",
      sortOrder: "asc",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              onFiltersChange({
                status: value ? (value as CategoryStatus) : undefined,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={CategoryStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={CategoryStatus.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={filters.sortBy || "displayOrder"}
            onValueChange={(value) =>
              onFiltersChange({
                sortBy: value as
                  | "name"
                  | "displayOrder"
                  | "itemCount"
                  | "createdAt",
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="displayOrder">Display Order</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="itemCount">Item Count</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={filters.sortOrder || "asc"}
            onValueChange={(value) =>
              onFiltersChange({ sortOrder: value as "asc" | "desc" })
            }
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
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
      </CardContent>
    </Card>
  );
}
