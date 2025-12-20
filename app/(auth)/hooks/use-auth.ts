"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUser,
  confirmEmailApi,
  resetPasswordApi,
  updatePasswordApi,
  resendConfirmationApi,
} from "@/api/auth-api";
import { tokenManager } from "@/libs/api-request";

const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "currentUser"] as const,
};

/**
 * Hook for login mutation
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Store tokens
      if (data.data.accessToken) {
        tokenManager.setAccessToken(data.data.accessToken);
      }

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });

      toast.success(data.message || "Login successful!");

      // Redirect based on user role
      const role = data.data.user.role;
      if (role === "admin" || role === "staff") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Registration successful! Please check your email to confirm your account.",
      );

      // If session is returned (auto-login), store tokens
      if (data.data.accessToken) {
        tokenManager.setAccessToken(data.data.accessToken);

        // Redirect to dashboard or home
        const role = data.data.user.role;
        if (role === "admin" || role === "staff") {
          router.push("/owner/dashboard");
        } else {
          router.push("/");
        }
      } else {
        // Redirect to login page if email confirmation is required
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();

      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      // Even if server logout fails, clear local tokens
      tokenManager.clearTokens();
      queryClient.clear();

      toast.error("Logout failed, but local session cleared");
      router.push("/auth/login");
    },
  });
}

/**
 * Hook to get current user data
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: getCurrentUser,
    enabled: tokenManager.hasValidTokens(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for email confirmation
 */
export function useConfirmEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmEmailApi,
    onSuccess: (data) => {
      toast.success(data.message || "Email confirmed successfully!");

      // If session is returned, store tokens
      if (data.data.accessToken) {
        tokenManager.setAccessToken(data.data.accessToken);

        // Invalidate user query
        queryClient.invalidateQueries({
          queryKey: AUTH_QUERY_KEYS.currentUser,
        });

        // Redirect based on user role
        const role = data.data.user.role;
        if (role === "admin" || role === "staff") {
          router.push("/owner/dashboard");
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth/login");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Email confirmation failed.";
      toast.error(errorMessage);
      router.push("/auth/login");
    },
  });
}

/**
 * Hook for password reset request
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) => {
      toast.success(
        data.message || "Password reset email sent. Please check your inbox.",
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send password reset email.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for updating password
 */
export function useUpdatePassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update password.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for resending confirmation email
 */
export function useResendConfirmation() {
  return useMutation({
    mutationFn: resendConfirmationApi,
    onSuccess: (data) => {
      toast.success(
        data.message || "Confirmation email sent. Please check your inbox.",
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend confirmation email.";
      toast.error(errorMessage);
    },
  });
}
