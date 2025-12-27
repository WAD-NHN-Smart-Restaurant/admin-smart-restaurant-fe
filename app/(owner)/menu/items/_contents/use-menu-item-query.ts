import { useSafeQuery } from "@/hooks/use-safe-query";
import { useSafeMutation } from "@/hooks/use-safe-mutation";
import { useQueryClient } from "@tanstack/react-query";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuItemPhotos,
  deleteMenuItemPhoto,
  setPrimaryMenuItemPhoto,
} from "@/api/menu-item-api";
import { MenuItemFilterForm } from "@/schema/menu-item-schema";
import { UpdateMenuItemRequest } from "@/types/menu-item-type";

// Query keys
const MENU_ITEM_KEYS = {
  all: ["menuItems"] as const,
  lists: () => [...MENU_ITEM_KEYS.all, "list"] as const,
  list: (filters: MenuItemFilterForm) =>
    [...MENU_ITEM_KEYS.lists(), filters] as const,
  details: () => [...MENU_ITEM_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MENU_ITEM_KEYS.details(), id] as const,
};

/**
 * Hook to fetch menu items with filtering and pagination
 */
export const useMenuItemsQuery = (filters?: MenuItemFilterForm) => {
  const defaultFilters: MenuItemFilterForm = {
    search: "",
    categoryId: undefined,
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 4,
  };

  const queryFilters = filters || defaultFilters;

  return useSafeQuery(
    MENU_ITEM_KEYS.list(queryFilters),
    async () => {
      const response = await getMenuItems(filters);
      return response;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};

/**
 * Hook to fetch single menu item by ID
 */
export const useMenuItemQuery = (id: string, enabled: boolean = true) => {
  return useSafeQuery(
    MENU_ITEM_KEYS.detail(id),
    async ({ signal: _ }) => {
      const response = await getMenuItemById(id);
      return response;
    },
    {
      enabled: !!id && enabled,
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useCreateMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(createMenuItem, {
    successMessage: "Menu item created successfully!",
    onSuccess: () => {
      // Invalidate and refetch menu items list
      queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
    },
  });
};

/**
 * Hook to update menu item
 */
export const useUpdateMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ id, data }: { id: string; data: UpdateMenuItemRequest }) =>
      updateMenuItem(id, data),
    {
      successMessage: "Menu item updated successfully!",
      onSuccess: (_, { id }) => {
        // Invalidate specific item and list
        queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.detail(id) });
        queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
      },
    },
  );
};

/**
 * Hook to delete menu item
 */
export const useDeleteMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(deleteMenuItem, {
    successMessage: "Menu item deleted successfully!",
    onSuccess: () => {
      // Invalidate menu items list
      queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
    },
  });
};

/**
 * Hook to upload menu item photos
 */
export const useUploadMenuItemPhotosMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ menuItemId, files }: { menuItemId: string; files: FileList }) =>
      uploadMenuItemPhotos(menuItemId, files),
    {
      successMessage: "Photos uploaded successfully!",
      onSuccess: (_, { menuItemId }) => {
        // Invalidate specific item to refresh photos
        queryClient.invalidateQueries({
          queryKey: MENU_ITEM_KEYS.detail(menuItemId),
        });
        queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
      },
    },
  );
};

/**
 * Hook to delete menu item photo
 */
export const useDeleteMenuItemPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ menuItemId, photoId }: { menuItemId: string; photoId: string }) =>
      deleteMenuItemPhoto(menuItemId, photoId),
    {
      successMessage: "Photo deleted successfully!",
      onSuccess: (_, { menuItemId }) => {
        // Invalidate specific item to refresh photos
        queryClient.invalidateQueries({
          queryKey: MENU_ITEM_KEYS.detail(menuItemId),
        });
        queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
      },
    },
  );
};

/**
 * Hook to set primary menu item photo
 */
export const useSetPrimaryMenuItemPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ menuItemId, photoId }: { menuItemId: string; photoId: string }) =>
      setPrimaryMenuItemPhoto(menuItemId, photoId),
    {
      successMessage: "Primary photo set successfully!",
      onSuccess: (_, { menuItemId }) => {
        // Invalidate specific item to refresh photos
        queryClient.invalidateQueries({
          queryKey: MENU_ITEM_KEYS.detail(menuItemId),
        });
        queryClient.invalidateQueries({ queryKey: MENU_ITEM_KEYS.lists() });
      },
    },
  );
};
