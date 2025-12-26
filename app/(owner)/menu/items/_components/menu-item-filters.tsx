"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import { MenuItemFilterForm } from "@/schema/menu-item-schema";
import { MenuItemStatus } from "@/types/menu-item-type";
import { Category } from "@/types/category-type";
import { useDebounce } from "@/hooks/use-debounce";

interface MenuItemFiltersProps {
  filters: MenuItemFilterForm;
  onFiltersChange: (filters: Partial<MenuItemFilterForm>) => void;
  isLoading: boolean;
  categories: Category[];
}

export function MenuItemFilters({
  filters,
  onFiltersChange,
  isLoading,
  categories,
}: MenuItemFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch });
  }, [debouncedSearch, onFiltersChange]);

  const handleReset = useCallback(() => {
    setSearchInput("");
    onFiltersChange({
      search: "",
      categoryId: undefined,
      status: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, [onFiltersChange]);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All Status" },
      { value: MenuItemStatus.ACTIVE, label: "Active" },
      { value: MenuItemStatus.INACTIVE, label: "Inactive" },
      { value: MenuItemStatus.OUT_OF_STOCK, label: "Out of Stock" },
    ],
    [],
  );

  const sortOptions = useMemo(
    () => [
      { value: "name", label: "Name" },
      { value: "price", label: "Price" },
      { value: "createdAt", label: "Created Date" },
      { value: "popularity", label: "Popularity" },
    ],
    [],
  );

  const sortOrderOptions = useMemo(
    () => [
      { value: "asc", label: "A-Z / Low-High" },
      { value: "desc", label: "Z-A / High-Low" },
    ],
    [],
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filters.categoryId ?? "all"}
            onValueChange={(value) =>
              onFiltersChange({
                categoryId: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status ?? "all"}
            onValueChange={(value) =>
              onFiltersChange({
                status: value === "all" ? undefined : (value as MenuItemStatus),
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={filters.sortBy || "createdAt"}
            onValueChange={(value) =>
              onFiltersChange({
                sortBy: value as "name" | "price" | "createdAt" | "popularity",
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={filters.sortOrder || "desc"}
            onValueChange={(value) =>
              onFiltersChange({ sortOrder: value as "asc" | "desc" })
            }
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              {sortOrderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
