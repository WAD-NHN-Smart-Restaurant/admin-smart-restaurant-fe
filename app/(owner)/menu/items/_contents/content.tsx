"use client";

import { useState, useCallback, useMemo } from "react";
import { MenuItem, MenuItemStatus } from "@/types/menu-item-type";
import { MenuItemFilterForm } from "@/schema/menu-item-schema";
import {
  useMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "./use-menu-item-query";
import { useCategoriesQuery } from "../../categories/_contents/use-category-query";
import { MenuItemHeader } from "../_components/menu-item-header";
import { MenuItemFilters } from "../_components/menu-item-filters";
import { MenuItemGrid } from "../_components/menu-item-grid";
import { MenuItemFormDialog } from "../_components/menu-item-form-dialog";
import { DeleteMenuItemDialog } from "../_components/delete-menu-item-dialog";
import { MenuItemPhotosDialog } from "../_components/menu-item-photos-dialog";

export function Content() {
  // Filter state
  const [filters, setFilters] = useState<MenuItemFilterForm>({
    search: "",
    categoryId: undefined,
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 3,
  });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );

  // Queries and mutations
  const menuItemsQuery = useMenuItemsQuery(filters);
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateMenuItemMutation();
  const updateMutation = useUpdateMenuItemMutation();
  const deleteMutation = useDeleteMenuItemMutation();

  // Memoized data
  const categories = useMemo(
    () => categoriesQuery.data || [],
    [categoriesQuery.data],
  );
  const menuItems = useMemo(
    () => menuItemsQuery.data?.data?.items || [],
    [menuItemsQuery.data],
  );
  const pagination = useMemo(
    () => menuItemsQuery.data?.data?.pagination,
    [menuItemsQuery.data],
  );

  const totalItems = useMemo(() => pagination?.total || 0, [pagination]);
  const activeItems = useMemo(
    () => menuItems.filter((item) => item.status === "ACTIVE").length,
    [menuItems],
  );

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<MenuItemFilterForm>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateMenuItem = useCallback(() => {
    setSelectedMenuItem(null);
    setIsCreateDialogOpen(true);
  }, []);

  const handleEditMenuItem = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteMenuItem = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleManagePhotos = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsPhotosDialogOpen(true);
  }, []);

  const handleViewMenuItem = useCallback(
    (item: MenuItem) => {
      // For now, just trigger edit - could be a separate view dialog
      handleEditMenuItem(item);
    },
    [handleEditMenuItem],
  );

  const handleFormSubmit = useCallback(
    (data: {
      name: string;
      categoryId: string;
      price: number;
      description?: string;
      prepTime?: number;
      status: string;
      isChefRecommendation: boolean;
    }) => {
      const formattedData = {
        ...data,
        status: data.status as MenuItemStatus,
      };

      if (selectedMenuItem) {
        // Edit mode
        updateMutation.mutate(
          { id: selectedMenuItem.id, data: formattedData },
          {
            onSuccess: () => {
              setIsEditDialogOpen(false);
              setSelectedMenuItem(null);
            },
          },
        );
      } else {
        // Create mode
        createMutation.mutate(formattedData, {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
          },
        });
      }
    },
    [selectedMenuItem, updateMutation, createMutation],
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedMenuItem) {
      deleteMutation.mutate(selectedMenuItem.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedMenuItem(null);
        },
      });
    }
  }, [selectedMenuItem, deleteMutation]);

  // Loading and error states
  const isLoading = menuItemsQuery.isLoading;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <MenuItemHeader
        totalItems={totalItems}
        activeItems={activeItems}
        onCreateClick={handleCreateMenuItem}
      />

      {/* Filters */}
      <MenuItemFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        isLoading={isLoading}
        categories={categories}
      />

      {/* Content Grid */}
      <MenuItemGrid
        items={menuItems}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEditItem={handleEditMenuItem}
        onDeleteItem={handleDeleteMenuItem}
        onViewItem={handleViewMenuItem}
        onManagePhotos={handleManagePhotos}
      />

      {/* Create Dialog */}
      <MenuItemFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
        mode="create"
        categories={categories}
      />

      {/* Edit Dialog */}
      <MenuItemFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedMenuItem(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isPending}
        mode="edit"
        initialData={selectedMenuItem}
        categories={categories}
      />

      {/* Delete Dialog */}
      <DeleteMenuItemDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedMenuItem(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        menuItem={selectedMenuItem}
      />

      {/* Photos Dialog */}
      <MenuItemPhotosDialog
        isOpen={isPhotosDialogOpen}
        onClose={() => {
          setIsPhotosDialogOpen(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
      />
    </div>
  );
}
