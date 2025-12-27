"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  GuestCategory,
  GuestMenuItem,
  GuestMenuQueryParams,
} from "@/types/guest-menu-type";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useGuestMenuQuery } from "@/app/(owner)/menu/(guest-preview)/_contents/use-guest-menu-query";
import { GuestMenuHeader } from "../_components/guest-menu-header";
import { CategoryFilter } from "../_components/category-filter";
import { CategorySection } from "../_components/category-section";
import { LoadingState } from "../_components/loading-state";
import { MenuItemDetailDialog } from "../_components/menu-item-detail-dialog";
import { useSearchParams } from "next/navigation";
import { useCategoriesQuery } from "../../categories/_contents/use-category-query";

export function GuestMenuPreviewContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<GuestMenuItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const tableId = searchParams.get("table") || undefined;
  // Memoize query parameters
  const queryParams: GuestMenuQueryParams = useMemo(
    () => ({
      categoryId: selectedCategoryId,
      page: 1,
      limit: 100, // Get all items for preview
      token,
      table: tableId,
    }),
    [selectedCategoryId, token, tableId],
  );
  console.log("Query Params:", queryParams);
  const { data, isLoading, isError } = useGuestMenuQuery(queryParams);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategorySelect = useCallback((categoryId?: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const handleItemClick = useCallback((item: GuestMenuItem) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  }, []);

  const handleCloseItemDialog = useCallback(() => {
    setIsItemDialogOpen(false);
    setSelectedItem(null);
  }, []);

  // Get all unique categories for filter (from original data without search filter)
  const { data: allCategoriesData } = useCategoriesQuery();

  const categories = useMemo(
    () => data?.data?.items || [],
    [data?.data?.items],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestMenuHeader
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Device Frame */}

        {/* Category Filter */}
        <CategoryFilter
          categories={allCategoriesData ?? []}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
        />

        {/* Content */}
        <div className="p-4">
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load menu data. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {isLoading && <LoadingState />}

          {!isLoading && !isError && categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "No menu items found matching your search."
                  : "No menu items available."}
              </p>
            </div>
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <div className="space-y-8">
              {categories.map((category: GuestCategory) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-6 text-center">
        {/* Menu Item Detail Dialog */}
        <MenuItemDetailDialog
          item={selectedItem}
          isOpen={isItemDialogOpen}
          onClose={handleCloseItemDialog}
        />
      </div>
    </div>
  );
}
