import api, { tokenManager } from "@/libs/api-request";
import {
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  RegisterResponse,
  User,
  EmailConfirmationData,
  ConfirmEmailResponse,
  ResetPasswordFormData,
  ResetPasswordResponse,
  UpdatePasswordFormData,
  UpdatePasswordResponse,
  CurrentUserResponse,
} from "@/types/auth-type";
import {
  loginResponseSchema,
  registerResponseSchema,
  currentUserResponseSchema,
  confirmEmailResponseSchema,
  resetPasswordResponseSchema,
  updatePasswordResponseSchema,
} from "@/schema/auth-schema";

const AUTH_API = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  REFRESH_TOKEN: "/api/auth/refresh",
  EMAIL_CONFIRM: "/api/auth/confirm",
  ME: "/api/auth/me",
  RESET_PASSWORD: "/api/auth/reset-password",
  UPDATE_PASSWORD: "/api/auth/update-password",
  RESEND_CONFIRMATION: "/api/auth/resend-confirmation",
};

/**
 * Login with email and password
 */
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

/**
 * Register a new user
 */
export const registerApi = async (
  userData: RegisterFormData,
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterFormData, RegisterResponse>(
      AUTH_API.REGISTER,
      userData,
    );
    const result = registerResponseSchema.parse(response.data);
    return result;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutApi = async (): Promise<void> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (refreshToken) {
      // Call logout endpoint to invalidate tokens on server
      await api.post<{ refreshToken: string }, void>(AUTH_API.LOGOUT, {
        refreshToken,
      });
    }
  } catch (error) {
    console.error("Server logout error:", error);
  } finally {
    // Clear tokens locally
    tokenManager.clearTokens();
  }
};

/**
 * Get current user data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<CurrentUserResponse>(AUTH_API.ME);
    const result = currentUserResponseSchema.parse(response.data);
    return result.data;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
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

/**
 * Confirm email with OTP token
 */
export const confirmEmailApi = async (
  data: EmailConfirmationData,
): Promise<ConfirmEmailResponse> => {
  try {
    const response = await api.post<
      EmailConfirmationData,
      ConfirmEmailResponse
    >(AUTH_API.EMAIL_CONFIRM, data);
    const result = confirmEmailResponseSchema.parse(response.data);
    return result;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPasswordApi = async (
  data: ResetPasswordFormData,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<
      ResetPasswordFormData,
      ResetPasswordResponse
    >(AUTH_API.RESET_PASSWORD, data);
    const result = resetPasswordResponseSchema.parse(response.data);
    return result;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Update password
 */
export const updatePasswordApi = async (
  data: UpdatePasswordFormData,
): Promise<UpdatePasswordResponse> => {
  try {
    const response = await api.post<
      { newPassword: string },
      UpdatePasswordResponse
    >(AUTH_API.UPDATE_PASSWORD, { newPassword: data.newPassword });
    const result = updatePasswordResponseSchema.parse(response.data);
    return result;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Resend email confirmation
 */
export const resendConfirmationApi = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<
      { email: string },
      { success: boolean; message: string }
    >(AUTH_API.RESEND_CONFIRMATION, { email });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
