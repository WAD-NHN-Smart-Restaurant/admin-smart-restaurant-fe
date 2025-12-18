import api, { tokenManager } from "@/lib/api-request";
import {
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  User,
} from "@/types/auth-type";
import { loginResponseSchema, userSchema } from "@/schema/auth-schema";
import { ApiResponse } from "@/types/api-type";

const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  ME: "/auth/me",
};

export const loginApi = async (
  credentials: LoginFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginFormData, LoginResponse>(
      AUTH_API.LOGIN,
      credentials,
    );
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const registerApi = async (
  userData: RegisterFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<RegisterFormData, LoginResponse>(
      AUTH_API.REGISTER,
      userData,
    );
    const result = loginResponseSchema.parse(response.data);

    return result;
  } catch (error: unknown) {
    throw error;
  }
};

export const logoutApi = async (): Promise<void> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (refreshToken) {
      // Call logout endpoint to invalidate tokens on server
      // The backend will clear the cookies via Set-Cookie
      await api.post<{ refreshToken: string }, void>(AUTH_API.LOGOUT, {
        refreshToken,
      });
    }
  } catch (error) {
    console.error("Server logout error:", error);
  } finally {
    // Clear tokens locally (fallback for any non-httpOnly cookies)
    tokenManager.clearTokens();
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<ApiResponse<User>>(AUTH_API.ME);
    const result = userSchema.parse(response.data.data);
    return result;
  } catch (error: unknown) {
    throw error;
  }
};

// Check if user is authenticated
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    if (!tokenManager.hasValidTokens()) {
      return false;
    }

    // Try to fetch current user to validate token
    await getCurrentUser();
    return true;
  } catch {
    // If user fetch fails, clear tokens and return false
    tokenManager.clearTokens();
    return false;
  }
};
