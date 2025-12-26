import {
  MenuItemForm,
  MenuItemFilterForm,
  CreateMenuItemForm,
  UpdateMenuItemForm,
  MenuItemStatus,
} from "@/schema/menu-item-schema";

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  description?: string;
  prepTime?: number;
  status: MenuItemStatus;
  isChefRecommendation: boolean;
  popularity: number; // Based on order count
  photos: MenuItemPhoto[];
  primaryPhoto?: MenuItemPhoto;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemPhoto {
  id: string;
  menuItemId: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  isPrimary: boolean;
  createdAt: string;
}

// Re-export schema types and enum to maintain compatibility
export { MenuItemStatus } from "@/schema/menu-item-schema";
export type MenuItemFilter = MenuItemFilterForm;
export type CreateMenuItemRequest = CreateMenuItemForm;
export type UpdateMenuItemRequest = UpdateMenuItemForm;
export type MenuItemFormData = MenuItemForm;
