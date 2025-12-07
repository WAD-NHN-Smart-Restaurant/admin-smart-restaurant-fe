"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUser,
  checkAuthStatus,
} from "../api/auth";
import { tokenManager } from "../api/api";
import { User, LoginFormData, RegisterFormData } from "../schema/auth-schema";
import { AUTH_PATHS, PROTECTED_PATHS } from "@/data/path";

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isLogoutLoading: boolean;
  loginError: Error | null;
  registerError: Error | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Query keys
const AUTH_QUERY_KEYS = {
  user: ["auth", "user"] as const,
  status: ["auth", "status"] as const,
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: isAuthenticated = false, isLoading: isAuthLoading } = useQuery({
    queryKey: AUTH_QUERY_KEYS.status,
    queryFn: checkAuthStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Get current user
  const { data: user = null, isLoading: isUserLoading } = useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async () => {
      // Invalidate and refetch auth queries
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.status });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });

      // Redirect to dashboard
      router.push(PROTECTED_PATHS.DASHBOARD);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      // Error handling can be done in the component
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: async () => {
      // Invalidate and refetch auth queries
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.status });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });

      // Redirect to dashboard
      router.push(PROTECTED_PATHS.DASHBOARD);
    },
    onError: (error: Error) => {
      console.error("Registration failed:", error.message);
      // Error handling can be done in the component
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      // Clear all cached data
      queryClient.clear();

      // Redirect to login
      router.push(AUTH_PATHS.LOGIN);
    },
    onError: (error: Error) => {
      console.error("Logout error:", error.message);
      // Even if logout fails on server, clear local data and redirect
      queryClient.clear();
      router.push(AUTH_PATHS.LOGIN);
    },
  });

  // Initialize auth state on mount
  useEffect(() => {
    // Check if tokens exist in storage
    if (tokenManager.hasValidTokens()) {
      // Tokens exist, query will automatically run due to enabled: isAuthenticated
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.status });
    }
  }, [queryClient]);

  // Auth functions
  const login = async (credentials: LoginFormData) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterFormData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isAuthLoading || isUserLoading,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook for authentication checks
export const useAuthCheck = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isUnauthenticated: !isAuthenticated && !isLoading,
  };
};

// Hook for user data
export const useUser = () => {
  const { user, isLoading } = useAuth();

  return {
    user,
    isLoading,
    hasUser: !!user,
  };
};
