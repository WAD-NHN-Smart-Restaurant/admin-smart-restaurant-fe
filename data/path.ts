// Authentication routes
export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
};

// Protected routes
export const PROTECTED_PATHS = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

// API endpoints
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
  },
};

// Public routes
export const PUBLIC_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
};

// All paths combined for easy access
export const PATHS = {
  ...AUTH_PATHS,
  ...PROTECTED_PATHS,
  ...PUBLIC_PATHS,
};

// Helper functions
export const isAuthPath = (path: string): boolean => {
  return Object.values(AUTH_PATHS).includes(
    path as (typeof AUTH_PATHS)[keyof typeof AUTH_PATHS],
  );
};

export const isProtectedPath = (path: string): boolean => {
  return Object.values(PROTECTED_PATHS).includes(
    path as (typeof PROTECTED_PATHS)[keyof typeof PROTECTED_PATHS],
  );
};

export const isPublicPath = (path: string): boolean => {
  return Object.values(PUBLIC_PATHS).includes(
    path as (typeof PUBLIC_PATHS)[keyof typeof PUBLIC_PATHS],
  );
};
