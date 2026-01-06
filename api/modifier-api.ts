import api from "@/libs/api-request";
import { ApiResponse } from "@/types/api-type";
import { ModifierGroup, ModifierOption } from "@/types/modifier-type";
import {
  CreateModifierGroupForm,
  UpdateModifierGroupForm,
  CreateModifierOptionForm,
  UpdateModifierOptionForm,
  ModifierGroupFilterForm,
  AttachModifierGroupsForm,
} from "@/schema/modifier-schema";

/**
 * Modifier Group API routes
 */
const MODIFIER_GROUPS_API = {
  BASE: "/api/admin/menu/modifier-groups",
  BY_ID: (id: string) => `/api/admin/menu/modifier-groups/${id}`,
  OPTIONS: (groupId: string) =>
    `/api/admin/menu/modifier-groups/${groupId}/options`,
  ATTACH_TO_ITEM: (itemId: string) =>
    `/api/admin/menu/items/${itemId}/modifier-groups`,
};

const MODIFIER_OPTIONS_API = {
  BASE: "/api/admin/menu/modifier-options",
  BY_ID: (id: string) => `/api/admin/menu/modifier-options/${id}`,
};

/**
 * Get all modifier groups with optional filtering
 */
export const getModifierGroups = async (
  filters?: ModifierGroupFilterForm,
): Promise<ModifierGroup[]> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.selectionType)
    params.append("selectionType", filters.selectionType);
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  const queryString = params.toString();
  const url = queryString
    ? `${MODIFIER_GROUPS_API.BASE}?${queryString}`
    : MODIFIER_GROUPS_API.BASE;

  const response = await api.get<ApiResponse<ModifierGroup[]>>(url);
  return response.data.data || [];
};

/**
 * Get single modifier group by ID
 */
export const getModifierGroupById = async (
  id: string,
): Promise<ApiResponse<ModifierGroup>> => {
  const response = await api.get<ApiResponse<ModifierGroup>>(
    MODIFIER_GROUPS_API.BY_ID(id),
  );
  return response.data;
};

/**
 * Create new modifier group
 */
export const createModifierGroup = async (
  data: CreateModifierGroupForm,
): Promise<ApiResponse<ModifierGroup>> => {
  const response = await api.post<
    CreateModifierGroupForm,
    ApiResponse<ModifierGroup>
  >(MODIFIER_GROUPS_API.BASE, data);
  return response.data;
};

/**
 * Update modifier group
 */
export const updateModifierGroup = async (
  id: string,
  data: UpdateModifierGroupForm,
): Promise<ApiResponse<ModifierGroup>> => {
  const response = await api.put<
    UpdateModifierGroupForm,
    ApiResponse<ModifierGroup>
  >(MODIFIER_GROUPS_API.BY_ID(id), data);
  return response.data;
};

/**
 * Delete modifier group
 */
export const deleteModifierGroup = async (
  id: string,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    MODIFIER_GROUPS_API.BY_ID(id),
  );
  return response.data;
};

/**
 * Create modifier option for a group
 */
export const createModifierOption = async (
  data: CreateModifierOptionForm,
): Promise<ApiResponse<ModifierOption>> => {
  const response = await api.post<
    CreateModifierOptionForm,
    ApiResponse<ModifierOption>
  >(MODIFIER_OPTIONS_API.BASE, data);
  return response.data;
};

/**
 * Update modifier option
 */
export const updateModifierOption = async (
  id: string,
  data: UpdateModifierOptionForm,
): Promise<ApiResponse<ModifierOption>> => {
  const response = await api.put<
    UpdateModifierOptionForm,
    ApiResponse<ModifierOption>
  >(MODIFIER_OPTIONS_API.BY_ID(id), data);
  return response.data;
};

/**
 * Delete modifier option
 */
export const deleteModifierOption = async (
  id: string,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    MODIFIER_OPTIONS_API.BY_ID(id),
  );
  return response.data;
};

/**
 * Attach modifier groups to menu item
 */
export const attachModifierGroupsToItem = async (
  itemId: string,
  data: AttachModifierGroupsForm,
): Promise<ApiResponse<void>> => {
  const response = await api.post<AttachModifierGroupsForm, ApiResponse<void>>(
    MODIFIER_GROUPS_API.ATTACH_TO_ITEM(itemId),
    data,
  );
  return response.data;
};

/**
 * Get modifier groups attached to a menu item
 */
export const getItemModifierGroups = async (
  itemId: string,
): Promise<ModifierGroup[]> => {
  const response = await api.get<ApiResponse<ModifierGroup[]>>(
    MODIFIER_GROUPS_API.ATTACH_TO_ITEM(itemId),
  );
  return response.data.data || [];
};
