import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, ChevronDown } from "lucide-react";
import { TableFilter, TableStatus, TableLocation } from "@/types/table-type";

interface TableFiltersProps {
  filters: TableFilter;
  searchQuery: string;
  onFiltersChange: (filters: TableFilter) => void;
  onSearchChange: (search: string) => void;
}

export function TableFiltersSection({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchChange,
}: TableFiltersProps) {
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Filter & Search
          </h3>
        </div>
        <div className="flex w-full justify-between gap-4">
          <div className="flex-1 flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by table number or location..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 w-[300px]"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status:
                      value === "all" ? undefined : (value as TableStatus),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>{" "}
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className=" flex flex-col gap-y-1">
              <label className="text-sm font-medium">Sort By</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-between"
                  >
                    <div className="flex gap-1 items-center font-normal">
                      {filters.sortBy === "tableNumber" && "Table Number"}
                      {filters.sortBy === "capacity" && "Capacity"}
                      {filters.sortBy === "createdAt" && "Created At"}
                      {!filters.sortBy && "Default"}
                      {filters.sortOrder && (
                        <span>{filters.sortOrder === "desc" ? "↓" : "↑"}</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuItem
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        sortBy: undefined,
                        sortOrder: undefined,
                      })
                    }
                  >
                    Default
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Table Number</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "tableNumber",
                            sortOrder: "asc",
                          })
                        }
                      >
                        ↑ Ascending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "tableNumber",
                            sortOrder: "desc",
                          })
                        }
                      >
                        ↓ Descending
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Capacity</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "capacity",
                            sortOrder: "asc",
                          })
                        }
                      >
                        ↑ Ascending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "capacity",
                            sortOrder: "desc",
                          })
                        }
                      >
                        ↓ Descending
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Created At</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "createdAt",
                            sortOrder: "asc",
                          })
                        }
                      >
                        ↑ Ascending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                          })
                        }
                      >
                        ↓ Descending
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={filters.location || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    location: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Object.values(TableLocation).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
