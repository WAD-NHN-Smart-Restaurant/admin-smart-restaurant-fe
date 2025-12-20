# Supabase Authentication Implementation Guide

## Overview

This document provides a comprehensive guide to the Supabase authentication implementation across the smart-restaurant application.

## Architecture Flow

```
Client Side (React) → Server Side (Next.js API Routes) → Backend (NestJS) → Supabase Auth
```

## Backend Implementation (NestJS)

### 1. Auth Repository (`src/auth/auth.repository.ts`)

Handles all Supabase authentication operations:

- `signUp()` - Register new users with email/password
- `signInWithPassword()` - Login with credentials (PKCE flow)
- `signOut()` - Logout user
- `getUser()` - Get user from access token
- `refreshSession()` - Refresh access token using refresh token
- `verifyOtp()` - Verify email confirmation tokens
- `resetPasswordForEmail()` - Send password reset email
- `updatePassword()` - Update user password
- `updateUserMetadata()` - Update user metadata (name, role, etc.)
- `resendEmailConfirmation()` - Resend email confirmation

### 2. Auth Service (`src/auth/auth.service.ts`)

Business logic layer:

- `verifySupabaseJWT()` - Verify JWT tokens using jose library
- `signUp()` - Handle user registration
- `signIn()` - Handle user login
- `signOut()` - Handle logout
- `refreshToken()` - Refresh access tokens
- `getCurrentUser()` - Get current authenticated user
- `confirmEmail()` - Confirm email with OTP
- `resetPassword()` - Send password reset email
- `updatePassword()` - Update user password
- `resendConfirmation()` - Resend confirmation email

### 3. Auth Controller (`src/auth/auth.controller.ts`)

HTTP endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/confirm` - Confirm email
- `POST /auth/reset-password` - Request password reset
- `POST /auth/update-password` - Update password
- `POST /auth/resend-confirmation` - Resend confirmation email
- `GET /auth/admin` - Admin-only endpoint (role-based)
- `GET /auth/staff` - Staff endpoint (role-based)

### 4. JWT Strategy (`src/auth/strategies/jwt.strategy.ts`)

- Validates JWT tokens using Supabase JWT secret
- Extracts user information from token payload
- Verifies user exists in Supabase
- Attaches user data to request

## Frontend Implementation (Next.js + React)

### 1. Type Definitions (`types/auth-type.ts`)

Type-safe definitions for:

- `LoginFormData`, `RegisterFormData`
- `ResetPasswordFormData`, `UpdatePasswordFormData`
- `User`, `AuthTokens`
- `LoginResponse`, `RegisterResponse`
- `CurrentUserResponse`, `ConfirmEmailResponse`

### 2. Zod Schemas (`schema/auth-schema.ts`)

Runtime validation schemas for:

- Form inputs (login, register, reset password, update password)
- API responses
- User data
- Token data

### 3. Client-Side API (`api/auth-api.ts`)

API functions that call Next.js API routes:

- `loginApi()` - Login user
- `registerApi()` - Register user
- `logoutApi()` - Logout user
- `getCurrentUser()` - Get current user data
- `confirmEmailApi()` - Confirm email
- `resetPasswordApi()` - Request password reset
- `updatePasswordApi()` - Update password
- `resendConfirmationApi()` - Resend confirmation

### 4. Custom Hooks (`app/(auth)/hooks/use-auth.ts`)

React Query hooks for authentication:

- `useLogin()` - Login mutation with success/error handling
- `useRegister()` - Register mutation with email confirmation flow
- `useLogout()` - Logout mutation
- `useCurrentUser()` - Query current user data
- `useConfirmEmail()` - Email confirmation mutation
- `useResetPassword()` - Password reset request mutation
- `useUpdatePassword()` - Password update mutation
- `useResendConfirmation()` - Resend confirmation mutation

### 5. Next.js API Routes (`app/api/auth/`)

#### `/api/auth/login/route.ts`

- Forwards login request to backend
- Stores tokens in HTTP-only cookies
- Returns user and token data

#### `/api/auth/register/route.ts`

- Forwards registration to backend
- Stores tokens if auto-login enabled
- Handles email confirmation flow

#### `/api/auth/logout/route.ts`

- Calls backend logout
- Clears HTTP-only cookies
- Always succeeds even if backend fails

#### `/api/auth/me/route.ts`

- Gets current user from backend
- Uses access token from cookies (via interceptor)

#### `/api/auth/refresh/route.ts`

- Refreshes access token using refresh token
- Updates cookies with new tokens
- Clears cookies on failure

#### `/api/auth/confirm/route.ts`

- Handles GET request from email link
- Handles POST request from client
- Stores tokens after confirmation

#### `/api/auth/reset-password/route.ts`

- Sends password reset email
- Uses Supabase email templates

#### `/api/auth/update-password/route.ts`

- Updates user password
- Requires authentication

#### `/api/auth/resend-confirmation/route.ts`

- Resends email confirmation
- Useful for expired links

## Security Features

### 1. JWT Verification

- Backend verifies all JWT tokens using `jose` library
- Validates token signature, expiration, and issuer
- Implemented in `AuthService.verifySupabaseJWT()`

### 2. HTTP-Only Cookies

- Access and refresh tokens stored in HTTP-only cookies
- Protected from XSS attacks
- Automatic sending with requests

### 3. Token Refresh

- Automatic token refresh on expiration
- Graceful handling of refresh failures
- Clears tokens and redirects to login

### 4. Role-Based Access Control (RBAC)

- `@Roles()` decorator for endpoints
- `RolesGuard` validates user roles
- Supports multiple roles per endpoint

### 5. Request/Response Interceptors

- Server-side: Automatically adds auth tokens from cookies
- Client-side: Handles 401 errors with redirect
- Error handling and logging

## Environment Variables

### Backend (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_HOSTNAME=http://localhost:3000
```

## Usage Examples

### 1. Login Flow

```typescript
// In a React component
import { useLogin } from '@/app/(auth)/hooks/use-auth';

const LoginForm = () => {
  const login = useLogin();

  const handleSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### 2. Protected Route

```typescript
// Backend controller
@Get('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getAdminData(@CurrentUser() user: AuthenticatedUser) {
  return { message: 'Admin only', user };
}
```

### 3. Get Current User

```typescript
// In a React component
import { useCurrentUser } from '@/app/(auth)/hooks/use-auth';

const Profile = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.name}!</div>;
};
```

## Testing

### Backend Tests

```bash
cd smart-restaurant-be
pnpm test
```

### Frontend Tests

```bash
cd smart-restaurant-fe
pnpm test
```

## Common Issues & Solutions

### 1. JWT Secret Mismatch

**Problem**: Token verification fails
**Solution**: Ensure `SUPABASE_JWT_SECRET` matches in both frontend and backend

### 2. CORS Errors

**Problem**: API calls blocked by CORS
**Solution**: Configure CORS in NestJS main.ts:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### 3. Cookie Not Set

**Problem**: Cookies not being stored
**Solution**: Ensure `withCredentials: true` in axios and `sameSite` properly configured

### 4. Token Expired

**Problem**: 401 errors after some time
**Solution**: Implement automatic token refresh in interceptor

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase PKCE Flow](https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce)
- [JWT Signing Keys](https://supabase.com/blog/jwt-signing-keys)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

## Next Steps

1. **Email Templates**: Customize Supabase email templates
2. **OAuth Providers**: Add Google, GitHub authentication
3. **MFA**: Implement multi-factor authentication
4. **Session Management**: Add device tracking
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Audit Logging**: Log authentication events
7. **Password Policies**: Enforce strong passwords
8. **Account Recovery**: Add account recovery flow
