import api from "@/libs/api-request";
import { ApiPaginatedResponse, ApiResponse } from "@/types/api-type";
import {
  StaffMember,
  CreateStaffRequest,
  UpdateStaffRequest,
  StaffFilter,
  StaffListResponse,
  StaffRole,
} from "@/types/staff-management-type";
import { create } from "lodash";

const STAFF_API = {
  BASE: "/api/staff",
  ADMINS: "/api/staff/admins",
  WAITERS: "/api/staff/waiters",
  KITCHEN: "/api/staff/kitchen",
  BY_ID: (id: string) => `/api/staff/${id}`,
};

// Get all staff members with optional filters
export const getStaffList = async (
  filters?: StaffFilter,
): Promise<StaffListResponse> => {
  const params = new URLSearchParams();

  if (filters?.role) params.append("role", filters.role);
  if (filters?.isActive !== undefined) {
    params.append("isActive", filters.isActive.toString());
  }
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const queryString = params.toString();
  const url = queryString ? `${STAFF_API.BASE}?${queryString}` : STAFF_API.BASE;

  const response = await api.get<{
    success: boolean;
    message: string;
    data: {
      data: StaffMember[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }>(url);

  return {
    items: response.data.data.data || [],
    pagination: response.data.data.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };
};

// Get single staff member by ID
export const getStaffById = async (id: string): Promise<StaffMember> => {
  const response = await api.get<ApiResponse<StaffMember>>(STAFF_API.BY_ID(id));

  return response.data.data;
};

// Create admin account
export const createAdmin = async (
  data: CreateStaffRequest,
): Promise<StaffMember> => {
  const response = await api.post<CreateStaffRequest, ApiResponse<StaffMember>>(
    STAFF_API.ADMINS,
    data,
  );
  console.log(response);
  return response.data.data;
};

// Create waiter account
export const createWaiter = async (
  data: CreateStaffRequest,
): Promise<StaffMember> => {
  const response = await api.post<CreateStaffRequest, ApiResponse<StaffMember>>(
    STAFF_API.WAITERS,
    data,
  );

  return response.data.data;
};

// Create kitchen staff account
export const createKitchenStaff = async (
  data: CreateStaffRequest,
): Promise<StaffMember> => {
  const response = await api.post<CreateStaffRequest, ApiResponse<StaffMember>>(
    STAFF_API.KITCHEN,
    data,
  );

  return response.data.data;
};

// Helper function to create staff by role
export const createStaff = async (
  role: StaffRole,
  data: CreateStaffRequest,
): Promise<StaffMember> => {
  console.log("Creating staff with role:", role, "and data:", data);
  switch (role) {
    case "admin":
      return createAdmin(data);
    case "waiter":
      return createWaiter(data);
    case "kitchen_staff":
      return createKitchenStaff(data);
    default:
      throw new Error(`Invalid staff role: ${role}`);
  }
};

// Update staff member
export const updateStaff = async (
  id: string,
  data: UpdateStaffRequest,
): Promise<StaffMember> => {
  const response = await api.patch<
    UpdateStaffRequest,
    ApiResponse<StaffMember>
  >(STAFF_API.BY_ID(id), data);

  return response.data.data;
};

// Deactivate staff member (soft delete)
export const deactivateStaff = async (id: string): Promise<StaffMember> => {
  return updateStaff(id, { isActive: false });
};

// Activate staff member
export const activateStaff = async (id: string): Promise<StaffMember> => {
  return updateStaff(id, { isActive: true });
};

// Toggle staff active status
export const toggleStaffStatus = async (
  id: string,
  currentStatus: boolean,
): Promise<StaffMember> => {
  return updateStaff(id, { isActive: !currentStatus });
};
