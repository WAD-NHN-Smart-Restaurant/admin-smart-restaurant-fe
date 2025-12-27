"use client";

import { memo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { MenuItem } from "@/types/menu-item-type";
import { MenuItemCard } from "./menu-item-card";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { Pagination as PaginationType } from "@/types/api-type";

interface MenuItemGridProps {
  items: MenuItem[];
  isLoading: boolean;
  pagination?: PaginationType;
  onPageChange: (page: number) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onViewItem: (item: MenuItem) => void;
  onManagePhotos: (item: MenuItem) => void;
  onManageModifiers: (item: MenuItem) => void;
}

export const MenuItemGrid = memo(function MenuItemGrid({
  items,
  isLoading,
  pagination,
  onPageChange,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onManagePhotos,
  onManageModifiers,
}: MenuItemGridProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No menu items found"
        description="Try adjusting your filters or create a new menu item"
        icon="🍽️"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
            onView={() => onViewItem(item)}
            onManagePhotos={() => onManagePhotos(item)}
            onManageModifiers={() => onManageModifiers(item)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});
