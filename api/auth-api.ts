import api, { tokenManager } from "@/lib/api-request";
import {
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  User,
  loginResponseSchema,
  userSchema,
} from "@/schema/auth-schema";
import { API_PATHS } from "@/data/path";

// Login API function
export const loginApi = async (
  credentials: LoginFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_PATHS.AUTH.LOGIN, credentials);
    const result = loginResponseSchema.parse(response.data);

    return result;
  } catch (error: unknown) {
    throw error;
  }
};

// Register API function
export const registerApi = async (
  userData: RegisterFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_PATHS.AUTH.REGISTER, userData);
    const result = loginResponseSchema.parse(response.data);

    return result;
  } catch (error: unknown) {
    throw error;
  }
};

// Logout API function
export const logoutApi = async (): Promise<void> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (refreshToken) {
      // Call logout endpoint to invalidate tokens on server
      // The backend will clear the cookies via Set-Cookie
      await api.post(API_PATHS.AUTH.LOGOUT, { refreshToken });
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
    const response = await api.get(API_PATHS.AUTH.ME);
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
