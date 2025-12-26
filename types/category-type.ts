import {
  CategoryForm,
  CategoryFilterForm,
  CreateCategoryForm,
  UpdateCategoryForm,
} from "@/schema/category-schema";

export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  status: CategoryStatus;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Re-export schema types to maintain compatibility
export type CategoryFilter = CategoryFilterForm;
export type CreateCategoryRequest = CreateCategoryForm;
export type UpdateCategoryRequest = UpdateCategoryForm;
export type CategoryFormData = CategoryForm;
