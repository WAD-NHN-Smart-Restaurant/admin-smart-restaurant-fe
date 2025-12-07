import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { refreshTokenResponseSchema } from "@/schema/auth-schema";
import { API_PATHS, AUTH_PATHS } from "@/data/path";

// Extend InternalAxiosRequestConfig to include _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Token management utilities
export const tokenManager = {
  setAccessToken: (token: string) => {
    // Tokens should be set by backend via Set-Cookie header
    // This is only for fallback/local testing purposes
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: 1 / 24, // 1 hour
    });
  },

  getAccessToken: (): string | null => {
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  setRefreshToken: (token: string) => {
    // Tokens should be set by backend via Set-Cookie header
    // This is only for fallback/local testing purposes
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: 7, // 7 days
    });
  },

  getRefreshToken: (): string | null => {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  hasValidTokens: (): boolean => {
    return !!(tokenManager.getAccessToken() || tokenManager.getRefreshToken());
  },
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Request interceptor - Add access token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Don't attempt token refresh for auth endpoints (login, register, etc.)
    const isAuthEndpoint =
      originalRequest.url?.includes(AUTH_PATHS.LOGIN) ||
      originalRequest.url?.includes(AUTH_PATHS.REGISTER);

    // Check if error is 401 and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint // Don't refresh on auth endpoint failures
    ) {
      originalRequest._retry = true;

      // If we're already refreshing, wait for that request to complete
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api.request(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start refresh process
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api.request(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          handleAuthFailure();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "An error occurred. Please try again.",
    );
  },
);

// Refresh access token function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}${API_PATHS.AUTH.REFRESH_TOKEN}`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Important: send cookies with the request
      },
    );

    const result = refreshTokenResponseSchema.parse(response.data);

    if (result.success) {
      // Tokens are automatically set via HTTP-only cookies by the backend
      // Just return the access token for the retry request
      const newAccessToken = result.data.accessToken;
      return newAccessToken;
    }

    throw new Error("Token refresh failed");
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

// Handle authentication failure
const handleAuthFailure = () => {
  if (Object.values(AUTH_PATHS).includes(window.location.pathname)) {
    return;
  }
  tokenManager.clearTokens();

  // Only redirect if we're in the browser
  if (typeof window !== "undefined") {
    // Clear any auth-related data from other storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = AUTH_PATHS.LOGIN;
  }
};

// Export configured axios instance
export default api;
