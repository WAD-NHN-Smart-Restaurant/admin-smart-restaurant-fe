import { useSafeQuery } from "@/hooks/use-safe-query";
import { useSafeMutation } from "@/hooks/use-safe-mutation";
import { useQueryClient } from "@tanstack/react-query";
import {
  getModifierGroups,
  getModifierGroupById,
  createModifierGroup,
  updateModifierGroup,
  deleteModifierGroup,
  createModifierOption,
  updateModifierOption,
  deleteModifierOption,
  attachModifierGroupsToItem,
  getItemModifierGroups,
} from "@/api/modifier-api";
import {
  ModifierGroupFilterForm,
  UpdateModifierGroupForm,
  CreateModifierOptionForm,
  UpdateModifierOptionForm,
  AttachModifierGroupsForm,
} from "@/schema/modifier-schema";

// Query keys
const MODIFIER_KEYS = {
  all: ["modifiers"] as const,
  groups: () => [...MODIFIER_KEYS.all, "groups"] as const,
  group: (filters: ModifierGroupFilterForm) =>
    [...MODIFIER_KEYS.groups(), filters] as const,
  groupDetails: () => [...MODIFIER_KEYS.all, "group-detail"] as const,
  groupDetail: (id: string) => [...MODIFIER_KEYS.groupDetails(), id] as const,
  itemGroups: (itemId: string) =>
    [...MODIFIER_KEYS.all, "item-groups", itemId] as const,
};

/**
 * Hook to fetch modifier groups with filtering
 */
export const useModifierGroupsQuery = (filters?: ModifierGroupFilterForm) => {
  return useSafeQuery(
    MODIFIER_KEYS.group(filters || {}),
    async () => {
      const response = await getModifierGroups(filters);
      return response;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};

/**
 * Hook to fetch single modifier group by ID
 */
export const useModifierGroupQuery = (id: string, enabled: boolean = true) => {
  return useSafeQuery(
    MODIFIER_KEYS.groupDetail(id),
    async () => {
      const response = await getModifierGroupById(id);
      return response;
    },
    {
      enabled: !!id && enabled,
      staleTime: 5 * 60 * 1000,
    },
  );
};

/**
 * Hook to create new modifier group
 */
export const useCreateModifierGroupMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(createModifierGroup, {
    successMessage: "Modifier group created successfully!",
    onSuccess: () => {
      // Invalidate and refetch modifier groups list
      queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
    },
  });
};

/**
 * Hook to update modifier group
 */
export const useUpdateModifierGroupMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ id, data }: { id: string; data: UpdateModifierGroupForm }) =>
      updateModifierGroup(id, data),
    {
      successMessage: "Modifier group updated successfully!",
      onSuccess: (_, { id }) => {
        // Invalidate specific group and list
        queryClient.invalidateQueries({
          queryKey: MODIFIER_KEYS.groupDetail(id),
        });
        queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
      },
    },
  );
};

/**
 * Hook to delete modifier group
 */
export const useDeleteModifierGroupMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(deleteModifierGroup, {
    successMessage: "Modifier group deleted successfully!",
    onSuccess: () => {
      // Invalidate modifier groups list
      queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
    },
  });
};

/**
 * Hook to create modifier option
 */
export const useCreateModifierOptionMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ groupId, data }: { groupId: string; data: CreateModifierOptionForm }) =>
      createModifierOption(groupId, data),
    {
      successMessage: "Modifier option created successfully!",
      onSuccess: (_, { groupId }) => {
        // Invalidate group detail and groups list
        queryClient.invalidateQueries({
          queryKey: MODIFIER_KEYS.groupDetail(groupId),
        });
        queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
      },
    },
  );
};

/**
 * Hook to update modifier option
 */
export const useUpdateModifierOptionMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ id, data }: { id: string; data: UpdateModifierOptionForm }) =>
      updateModifierOption(id, data),
    {
      successMessage: "Modifier option updated successfully!",
      onSuccess: () => {
        // Invalidate all groups (since we don't know which group this option belongs to)
        queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
        queryClient.invalidateQueries({
          queryKey: MODIFIER_KEYS.groupDetails(),
        });
      },
    },
  );
};

/**
 * Hook to delete modifier option
 */
export const useDeleteModifierOptionMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(deleteModifierOption, {
    successMessage: "Modifier option deleted successfully!",
    onSuccess: () => {
      // Invalidate all groups
      queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groups() });
      queryClient.invalidateQueries({ queryKey: MODIFIER_KEYS.groupDetails() });
    },
  });
};

/**
 * Hook to get modifier groups attached to a menu item
 */
export const useItemModifierGroupsQuery = (
  itemId: string,
  enabled: boolean = true,
) => {
  return useSafeQuery(
    MODIFIER_KEYS.itemGroups(itemId),
    async () => {
      const response = await getItemModifierGroups(itemId);
      return response;
    },
    {
      enabled: !!itemId && enabled,
      staleTime: 5 * 60 * 1000,
    },
  );
};

/**
 * Hook to attach modifier groups to menu item
 */
export const useAttachModifierGroupsMutation = () => {
  const queryClient = useQueryClient();

  return useSafeMutation(
    ({ itemId, data }: { itemId: string; data: AttachModifierGroupsForm }) =>
      attachModifierGroupsToItem(itemId, data),
    {
      successMessage: "Modifier groups attached successfully!",
      onSuccess: (_, { itemId }) => {
        // Invalidate item modifier groups
        queryClient.invalidateQueries({
          queryKey: MODIFIER_KEYS.itemGroups(itemId),
        });
      },
    },
  );
};
