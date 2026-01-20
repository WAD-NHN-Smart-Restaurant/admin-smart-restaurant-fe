import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";
import { StaffFilter, STAFF_ROLES } from "@/types/staff-management-type";

interface StaffFiltersProps {
  filters: StaffFilter;
  searchQuery: string;
  onFiltersChange: (filters: StaffFilter) => void;
  onSearchChange: (search: string) => void;
}

export function StaffFiltersSection({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchChange,
}: StaffFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({});
    onSearchChange("");
  };

  const hasActiveFilters =
    filters.role !== undefined ||
    filters.isActive !== undefined ||
    searchQuery !== "";

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Filter & Search
            </h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8"
            >
              <X className="mr-1 h-3 w-3" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px] space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  role: value === "all" ? undefined : (value as any),
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive
                    ? "active"
                    : "inactive"
              }
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  isActive:
                    value === "all"
                      ? undefined
                      : value === "active"
                        ? true
                        : false,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
