# Authentication System - Folder Structure

This document outlines the folder structure and organization of the authentication system.

## Root Structure

```
fe/
├── api/                    # API calls use lib/api-request.ts
├── app/                    # Next.js app router pages
├── components/             # Reusable components
├── context/                # React contexts
├── data/                   # Constants and configuration
├── docs/                   # Documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── schema/                 # Zod validation schemas
├── types/                  # TypeScript type definitions
└── helper/                  # Utility functions
```

## Detailed Structure

### `/api` - API Layer

All API calls and configurations are centralized here.

```
api/
├── api.ts              # Axios instance with interceptors
└── auth.ts             # Authentication API functions
```

**Purpose:**

- `api.ts`: Configured axios instance with request/response interceptors for token management
- `auth.ts`: Login, register, logout, and user-related API functions

**Key Features:**

- Automatic token attachment to requests
- Token refresh on 401 responses
- Centralized error handling

### `/app` - Next.js App Router

Contains all pages and route-specific components.

```
app/
├── dashboard/
│   ├── components/     # Dashboard-specific components
│   │   └── dashboard-components.tsx
│   └── page.tsx        # Dashboard page
├── login/
│   ├── components/     # Login-specific components
│   │   └── login-form.tsx
│   └── page.tsx        # Login page
├── register/
│   ├── components/     # Register-specific components
│   │   └── register-form.tsx
│   └── page.tsx        # Register page
├── globals.css         # Global styles
├── layout.tsx          # Root layout
├── page.tsx            # Home page
└── providers.tsx       # App-level providers
```

**Architecture:**

- Each route has its own folder
- Route-specific components live in `components/` subfolder of that route
- Shared components go in root `/components` folder

### `/components` - Shared Components

Reusable components used across multiple pages.

```
components/
├── ui/                 # shadcn UI components
│   └── button.tsx
└── auth-guard.tsx      # Route protection components
```

**Types of Components:**

- **UI Components**: Reusable design system components (buttons, inputs, etc.)
- **Layout Components**: Headers, footers, sidebars
- **Guard Components**: Authentication and authorization wrappers

### `/context` - React Context

State management using React Context API.

```
context/
└── auth-context.tsx    # Authentication context and hooks
```

### `/data` - Constants and Configuration

Pure data, constants, and configuration values.

```
data/
├── constant.ts         # Pure constants and utility functions
└── path.ts             # Route paths and path utilities
```

**Rules:**

- Only pure functions and constants
- No side effects
- No API calls or external dependencies

### `/schema` - Zod Schemas

Data validation schemas using Zod.

```
schema/
└── auth-schema.ts      # Authentication-related schemas
```

**Purpose:**

- Form validation schemas
- API response validation
- Type inference from schemas
- Runtime type checking

### `/hooks` - Custom React Hooks

Reusable React hooks for common functionality.

```
hooks/
└── (custom hooks can be added here)
```

**Examples:**

- `useLocalStorage`: Persist state in localStorage
- `useDebounce`: Debounce value changes
- `useWindowSize`: Track window dimensions

### `/lib` - Utility Libraries

Helper functions and utilities.

```
lib/
└── utils.ts            # General utility functions
```

**Purpose:**

- Class name utilities (cn)
- Common helper functions
- Third-party library wrappers

### `/types` - TypeScript Definitions

Shared TypeScript type definitions.

```
types/
└── (type definition files)
```

**Purpose:**

- Global type definitions
- API response types
- Shared interfaces

## Key Principles

### 1. Separation of Concerns

- **API Layer**: All backend communication in `/api`
- **UI Layer**: Components in `/components` and route-specific folders
- **State Management**: Centralized in `/context`
- **Validation**: All schemas in `/schema`

### 2. File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `login-form.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `auth-utils.ts`)
- **Types**: `kebab-case.ts` or `index.ts`

### 3. Import Path Rules

- **Always use path constants**: Import from `/data/path.ts`, never hard-code URLs
- **Absolute imports**: Use `@/` prefix for root imports
- **Relative imports**: Only for files in the same directory

### 4. Component Organization

- **Page-specific components**: Live in `[page]/components/`
- **Shared components**: Live in root `/components/`
- **UI components**: Live in `/components/ui/`

### 5. Data Flow

```
User Action → Component → Hook/Context → API Function → Axios → Server
                ↓                                            ↓
            Validation (Schema)                      Interceptors
```

## Best Practices

### API Calls

- Never make API calls directly in components
- Always use functions from `/api` folder
- Handle errors at the API function level

### State Management

- Use React Query for server state
- Use Context for global client state
- Use local state (useState) for component-specific state

### Form Handling

- Use React Hook Form for all forms
- Define Zod schemas in `/schema`
- Use `zodResolver` for validation

### Protected Routes

- Wrap protected pages with `<ProtectedRoute>`
- Wrap auth pages with `<PublicRoute>`
- Use `useAuth()` hook to check authentication status
