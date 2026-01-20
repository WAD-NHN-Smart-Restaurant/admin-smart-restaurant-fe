import { z } from "zod";

export const createStaffSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "waiter", "kitchen_staff"]),
});

export type CreateStaffForm = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type UpdateStaffForm = z.infer<typeof updateStaffSchema>;

export const staffFilterSchema = z.object({
  role: z.enum(["admin", "waiter", "kitchen_staff"]).optional(),
  is_active: z.boolean().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type StaffFilterForm = z.infer<typeof staffFilterSchema>;
