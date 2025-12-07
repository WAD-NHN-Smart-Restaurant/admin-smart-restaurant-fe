import api, { tokenManager } from "./api";
import {
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  User,
  loginResponseSchema,
  userSchema,
} from "../schema/auth-schema";
import { API_PATHS } from "../data/path";

// Login API function
export const loginApi = async (
  credentials: LoginFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_PATHS.AUTH.LOGIN, credentials);
    const result = loginResponseSchema.parse(response.data);

    if (result.success) {
      // Store tokens
      tokenManager.setAccessToken(result.data.tokens.accessToken);
      tokenManager.setRefreshToken(result.data.tokens.refreshToken);
    }

    return result;
  } catch (error: unknown) {
    console.error("Login error:", error);
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.",
    );
  }
};

// Register API function
export const registerApi = async (
  userData: RegisterFormData,
): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_PATHS.AUTH.REGISTER, userData);
    const result = loginResponseSchema.parse(response.data);

    if (result.success) {
      // Store tokens after successful registration
      tokenManager.setAccessToken(result.data.tokens.accessToken);
      tokenManager.setRefreshToken(result.data.tokens.refreshToken);
    }

    return result;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.",
    );
  }
};

// Logout API function
export const logoutApi = async (): Promise<void> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (refreshToken) {
      // Call logout endpoint to invalidate tokens on server
      await api.post(API_PATHS.AUTH.LOGOUT, { refreshToken });
    }
  } catch (error) {
    // Even if server logout fails, we still clear local tokens
    console.error("Server logout error:", error);
  } finally {
    // Always clear tokens locally
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
    console.error("Get current user error:", error);
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch user data.",
    );
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

// Refresh token manually (mainly for testing)
export const refreshTokenManually = async (): Promise<boolean> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    const response = await api.post(API_PATHS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });

    if (response.data.success) {
      tokenManager.setAccessToken(response.data.data.accessToken);
      tokenManager.setRefreshToken(response.data.data.refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Manual token refresh error:", error);
    tokenManager.clearTokens();
    return false;
  }
};
