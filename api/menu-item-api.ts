import api from "@/libs/api-request";
import {
  MenuItem,
  MenuItemFilter,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  MenuItemPhoto,
} from "@/types/menu-item-type";
import { ApiResponse, ApiPaginatedResponse } from "@/types/api-type";

// Get menu items with filtering and pagination
export const getMenuItems = async (
  filters?: MenuItemFilter,
): Promise<ApiPaginatedResponse<MenuItem>> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const response = await api.get<ApiPaginatedResponse<MenuItem>>(
    `/api/admin/menu/items?${params.toString()}`,
  );
  return response.data;
};

// Get single menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem> => {
  const response = await api.get<ApiResponse<MenuItem>>(
    `/api/admin/menu/items/${id}`,
  );
  return response.data.data;
};

// Create new menu item
export const createMenuItem = async (
  data: CreateMenuItemRequest,
): Promise<MenuItem> => {
  const response = await api.post<CreateMenuItemRequest, ApiResponse<MenuItem>>(
    "/api/admin/menu/items",
    data,
  );
  return response.data.data;
};

// Update menu item
export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemRequest,
): Promise<MenuItem> => {
  const response = await api.put<UpdateMenuItemRequest, ApiResponse<MenuItem>>(
    `/api/admin/menu/items/${id}`,
    data,
  );
  return response.data.data;
};

// Delete menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/menu/items/${id}`);
};

// Upload photos for menu item
export const uploadMenuItemPhotos = async (
  menuItemId: string,
  files: FileList,
): Promise<MenuItemPhoto[]> => {
  const formData = new FormData();

  // Add all files to form data
  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }

  const response = await api.post<FormData, ApiResponse<MenuItemPhoto[]>>(
    `/api/admin/menu/items/${menuItemId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

// Delete menu item photo
export const deleteMenuItemPhoto = async (
  menuItemId: string,
  photoId: string,
): Promise<void> => {
  await api.delete(`/api/admin/menu/items/${menuItemId}/photos/${photoId}`);
};

// Set primary photo
export const setPrimaryMenuItemPhoto = async (
  menuItemId: string,
  photoId: string,
): Promise<void> => {
  await api.patch(
    `/api/admin/menu/items/${menuItemId}/photos/${photoId}/primary`,
  );
};
