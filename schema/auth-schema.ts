import { z } from "zod";

// Login form schema
export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

// Register form schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters long"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// API response schemas
export const authTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatar: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userSchema,
    tokens: authTokenSchema,
  }),
});

export const refreshTokenResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: authTokenSchema,
});

export const apiErrorSchema = z.object({
  success: z.boolean().default(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
});
