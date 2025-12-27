"use client";

import { useCallback, useState } from "react";
import { CategoryStatus } from "@/types/category-type";
import { CategoryFilterForm } from "@/schema/category-schema";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} from "./use-category-query";
import { CategoryHeader } from "../_components/category-header";
import { CategoryFilters } from "../_components/category-filters";
import { CategoryGrid } from "../_components/category-grid";
import { CategoryFormDialog } from "../_components/category-form-dialog";
import { DeleteCategoryDialog } from "../_components/delete-category-dialog";
import { Category } from "@/types/category-type";

export function Content() {
  // Filter state
  const [filters, setFilters] = useState<CategoryFilterForm>({
    search: "",
    status: undefined,
    sortBy: "displayOrder",
    sortOrder: "asc",
  });
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Queries and mutations
  const categoriesQuery = useCategoriesQuery(filters);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const updateStatusMutation = useUpdateCategoryStatusMutation();
  const deleteMutation = useDeleteCategoryMutation();

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<CategoryFilterForm>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = (category: Category) => {
    const newStatus =
      category.status === CategoryStatus.ACTIVE
        ? CategoryStatus.INACTIVE
        : CategoryStatus.ACTIVE;

    updateStatusMutation.mutate({
      id: category.id,
      status: newStatus,
    });
  };

  const handleFormSubmit = (data: {
    name: string;
    description?: string;
    displayOrder: number;
    status: CategoryStatus;
  }) => {
    if (selectedCategory) {
      // Edit mode
      updateMutation.mutate(
        {
          id: selectedCategory.id,
          data: data, // Remove the id from data since it's passed separately
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setSelectedCategory(null);
          },
        },
      );
    } else {
      // Create mode
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        },
      });
    }
  };

  // Loading and error states
  const isLoading = categoriesQuery.isLoading;
  const categories = categoriesQuery.data || [];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <CategoryHeader
        totalCategories={categories.length}
        activeCategories={
          categories.filter((c) => c.status === CategoryStatus.ACTIVE).length
        }
        onCreateClick={handleCreateCategory}
      />

      {/* Filters */}
      <CategoryFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* Content Grid */}
      <CategoryGrid
        categories={categories}
        isLoading={isLoading}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onToggleStatus={handleToggleStatus}
        isStatusUpdating={updateStatusMutation.isPending}
      />

      {/* Create Dialog */}
      <CategoryFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
        mode="create"
      />

      {/* Edit Dialog */}
      <CategoryFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isPending}
        mode="edit"
        initialData={selectedCategory}
      />

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        category={selectedCategory}
      />
    </div>
  );
}
