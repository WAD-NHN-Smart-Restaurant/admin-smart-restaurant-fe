export type StaffRole = "admin" | "waiter" | "kitchen_staff";

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  phoneNumber: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  restaurantId: string;
}

export interface CreateStaffRequest {
  email: string;
  name: string;
  password?: string;
}

export interface UpdateStaffRequest {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface StaffFilter {
  role?: StaffRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface StaffListResponse {
  items: StaffMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const STAFF_ROLES: { value: StaffRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "waiter", label: "Waiter" },
  { value: "kitchen_staff", label: "Kitchen Staff" },
];

export const STAFF_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
} as const;
