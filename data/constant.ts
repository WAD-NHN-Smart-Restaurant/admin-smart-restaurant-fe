// Token constants
export const TOKEN_EXPIRY_BUFFER = 60; // seconds before expiry to refresh
export const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days in seconds

// API configuration
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// Pure utility functions
export const isClient = () => typeof window !== "undefined";
export const isServer = () => typeof window === "undefined";
