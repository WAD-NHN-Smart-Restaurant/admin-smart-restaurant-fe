import { z } from "zod";
import {
  loginSchema,
  registerSchema,
  authTokenSchema,
  userSchema,
  loginResponseSchema,
  refreshTokenResponseSchema,
  apiErrorSchema,
} from "@/schema/auth-schema";

// Type exports inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AuthTokens = z.infer<typeof authTokenSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
