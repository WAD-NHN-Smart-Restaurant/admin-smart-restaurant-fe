"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "@/hooks/use-safe-query";
import { useSafeMutation } from "@/hooks/use-safe-mutation";
import {
  getStaffList,
  getStaffById,
  createStaff,
  updateStaff,
  toggleStaffStatus,
} from "@/apis/staff-management-api";
import { StaffFilter, StaffRole } from "@/types/staff-management-type";
import {
  CreateStaffForm,
  UpdateStaffForm,
} from "@/schema/staff-management-schema";

export function useStaffQuery(filters: StaffFilter) {
  const queryClient = useQueryClient();

  // Fetch staff list query
  const staffQuery = useSafeQuery(
    ["staff", filters],
    () => getStaffList(filters),
    {
      errorMessage: "Failed to load staff members",
    },
  );

  // Create staff mutation
  const createMutation = useSafeMutation(
    ({ role, data }: { role: StaffRole; data: CreateStaffForm }) => {
      const { role: _, ...createData } = data;
      return createStaff(role, createData);
    },
    {
      successMessage: "Staff member created successfully",
      errorMessage: "Failed to create staff member",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      },
    },
  );

  // Update staff mutation
  const updateMutation = useSafeMutation(
    ({ id, data }: { id: string; data: UpdateStaffForm }) =>
      updateStaff(id, data),
    {
      successMessage: "Staff member updated successfully",
      errorMessage: "Failed to update staff member",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      },
    },
  );

  // Toggle staff status mutation
  const toggleStatusMutation = useSafeMutation(
    ({ id, currentStatus }: { id: string; currentStatus: boolean }) =>
      toggleStaffStatus(id, currentStatus),
    {
      successMessage: "Staff status updated successfully",
      errorMessage: "Failed to update staff status",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      },
    },
  );

  return {
    staffQuery,
    createMutation,
    updateMutation,
    toggleStatusMutation,
  };
}
