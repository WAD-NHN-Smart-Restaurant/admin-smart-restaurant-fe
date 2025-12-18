# Smart Restaurant - Folder Structure

This document outlines the folder structure and organization of the Smart Restaurant management system.

## Root Structure

```
fe/
├── api/                    # API client functions (type-safe)
├── app/                    # Next.js App Router (pages & API routes)
├── components/             # Reusable UI components
├── context/                # React Context providers
├── data/                   # Constants and path definitions
├── docs/                   # Project documentation
├── helpers/                # Utility helper functions
├── hooks/                  # Custom React hooks (safe hooks)
├── lib/                    # Core library functions
├── public/                 # Static assets
├── schema/                 # Zod validation schemas
└── types/                  # TypeScript type definitions
```

## Detailed Structure

### `/api` - API Client Layer

Type-safe API client functions that use the centralized API request wrapper.

```
api/
├── auth-api.ts         # Authentication API calls
└── table-api.ts        # Table management API calls
```

**Purpose:**

- `auth-api.ts`: Login, register, logout, refresh token, and user profile functions
- `table-api.ts`: CRUD operations for tables, QR code generation/download

**Key Features:**

- Generic type parameters for type safety (`api.get<TResponse>()`)
- Uses `lib/api-request.ts` for centralized request handling
- Automatic token attachment via interceptors
- Token refresh on 401 responses
- Centralized error handling

### `/app` - Next.js App Router

Contains all pages, API routes, and route-specific components using Next.js 14+ App Router with route groups.

```
app/
├── (auth)/             # Public authentication routes
│   ├── login/
│   │   └── page.tsx    # Login page
│   └── register/
│       └── page.tsx    # Register page
├── (owner)/            # Protected owner routes
│   └── tables/         # Table management
│       ├── _components/    # Table-specific presentational components
│       │   ├── table-card.tsx
│       │   ├── table-filters.tsx
│       │   ├── table-form.tsx
│       │   ├── table-grid.tsx
│       │   ├── table-header.tsx
│       │   ├── table-qr-dialog.tsx
│       │   ├── table-stats.tsx
│       │   └── delete-table-dialog.tsx
│       ├── _contents/      # Business logic & state management
│       │   ├── content.tsx
│       │   └── use-table-query.ts
│       └── page.tsx        # Entry point (6 lines)
├── api/                # Mock data Backend API routes
│   ├── auth/           # Authentication endpoints
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── logout/route.ts
│   │   ├── me/route.ts
│   │   └── refresh/route.ts
│   ├── admin/
│   │   └── tables/     # Table management endpoints
│   │       ├── route.ts                    # GET, POST
│   │       ├── [id]/route.ts               # GET, PUT, DELETE
│   │       ├── [id]/status/route.ts        # PATCH
│   │       └── [id]/qr/                    # QR code endpoints
│   └── data.ts         # Mock data storage
├── globals.css         # Global Tailwind styles
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page (redirects to tables)
└── providers.tsx       # React Query & Toast providers
```

**Architecture Principles:**

- **Route Groups**: `(auth)` and `(owner)` for logical grouping without affecting URL
- **Clean Separation**:
  - `page.tsx`: Entry point (minimal, ~6 lines)
  - `_contents/`: Business logic, state management, handlers
  - `_components/`: Presentational components (<300 lines each)
- **API Routes**: Full REST API with Next.js route handlers
- **Colocated**: Components and logic live near where they're used

### `/components` - Shared Components

Reusable components used across multiple pages and features.

```
components/
├── ui/                 # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   └── ... (other UI primitives)
├── auth-guard.tsx      # Route protection wrapper
└── sidebar.tsx         # Main navigation sidebar
```

**Types of Components:**

- **UI Components**: Shadcn UI design system (buttons, inputs, dialogs, etc.)
- **Layout Components**: Sidebar, headers, wrappers
- **Guard Components**: `auth-guard.tsx` for protecting routes
- **Shared Logic**: Components used across multiple features

### `/context` - React Context

Global state management using React Context API with React Query integration.

```
context/
└── auth-context.tsx    # Authentication context with safe hooks
```

**Features:**

- `AuthProvider`: Provides auth state to entire app
- `useAuth()`: Hook to access user, login, register, logout
- `useAuthCheck()`: Hook for authentication status
- Integrates with `useSafeQuery` and `useSafeMutation`

### `/data` - Constants and Configuration

Pure data, constants, and configuration values. No side effects or business logic.

```
data/
├── constant.ts         # App-wide constants
└── path.ts             # Route path definitions (AUTH_PATHS, PATHS, PROTECTED_PATHS)
```

**Rules:**

- Only pure constants and configuration
- Path definitions for type-safe routing
- No side effects
- No API calls or external dependencies

**Path Structure:**

- `AUTH_PATHS`: Login, register routes
- `PATHS`: Public and general routes
- `PROTECTED_PATHS`: Owner/admin routes

### `/schema` - Zod Schemas

Data validation schemas using Zod for runtime type checking and form validation.

```
schema/
├── auth-schema.ts      # Login, register schemas
└── table-schema.ts     # Table CRUD, filter schemas
```

**Purpose:**

- Form validation with React Hook Form
- API request/response validation
- Type inference: `z.infer<typeof schema>`
- Runtime type checking and parsing

### `/hooks` - Custom React Hooks

Reusable React hooks including safe wrappers for React Query and custom hooks for common functionality.

```
hooks/
├── use-safe-query.tsx          # useQuery wrapper with error handling
├── use-safe-mutation.tsx       # useMutation wrapper with toast notifications
├── use-safe-infinite-query.tsx # useInfiniteQuery wrapper
├── use-debounce.ts             # Debounce value changes
└── use-auth.ts                 # Authentication utilities
```

**Safe Hooks Pattern:**

- `useSafeQuery`: Automatic error toast, simplified API
- `useSafeMutation`: Success/error messages, loading states
- `useSafeInfiniteQuery`: Infinite scrolling with error handling
- All hooks integrate with React Toastify for user feedback

**Other Hooks:**

- `useDebounce`: Delay state updates (search inputs)
- `useAuth`: Shortcuts to auth context

### `/lib` - Core Libraries

Core utility libraries and API infrastructure.

```
lib/
├── api-request.ts      # Type-safe API client wrapper
└── utils.ts            # General utility functions (cn, etc.)
```

**Purpose:**

- `api-request.ts`: Axios instance with interceptors, token management, generic types
- `utils.ts`: Class name utilities (cn), helper functions
- `tokenManager`: Cookie-based token storage and refresh logic

### `/types` - TypeScript Definitions

Shared TypeScript type definitions for the entire application.

```
types/
├── api-type.ts         # Generic API response types
├── auth-type.ts        # User, login, register types
└── table-type.ts       # Table, TableStatus, TableFilter types
```

**Purpose:**

- Domain model types (User, Table, etc.)
- API response wrappers: `ApiResponse<T>`
- Form types inferred from Zod schemas
- Type exports used across the app

### `/helpers` - Helper Functions

Utility helper functions for formatting and data manipulation.

```
helpers/
├── format.ts           # Date, number, text formatting
└── utils.ts            # General utility helpers
```

**Purpose:**

- Pure formatting functions
- Data transformation utilities
- Helper functions without side effects

### `/public` - Static Assets

Static files served directly by Next.js.

```
public/
└── (images, fonts, icons, etc.)
```

## Key Principles

### 1. Clean Architecture (Separation of Concerns)

```
Entry Point (page.tsx)
    ↓
Content Layer (_contents/)      ← Business logic, state, handlers
    ↓
Component Layer (_components/)  ← Presentational, < 300 lines each
    ↓
Hook Layer (use-*-query.ts)    ← React Query calls only
    ↓
API Layer (api/)               ← Type-safe API functions
    ↓
Lib Layer (lib/api-request.ts) ← Axios with interceptors
```

**Rules:**

- `page.tsx`: Entry point only (6 lines ideal)
- `_contents/`: State management, handlers, composition
- `_components/`: Presentational components, props-based
- `use-*-query.ts`: Only React Query hooks, no state
- `api/`: Type-safe API calls with generics
- `lib/api-request.ts`: Centralized request handling

### 2. Safe Hooks Pattern

All data fetching uses safe hook wrappers:

```typescript
// Query
const { data, isLoading } = useSafeQuery(["tables"], fetchTables, {
  successMessage: "Tables loaded",
});

// Mutation
const mutation = useSafeMutation(createTable, {
  successMessage: "Table created!",
  onSuccess: () => queryClient.invalidateQueries(["tables"]),
});
```

**Benefits:**

- Automatic error toast notifications
- Success message feedback
- Consistent error handling
- Reduced boilerplate

### 3. Type Safety

- **Generic API calls**: `api.get<Response>()`, `api.post<Request, Response>()`
- **Zod schemas**: Runtime validation + type inference
- **No `any` types**: All types explicitly defined
- **Type exports**: From `/types` folder

### 4. File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `table-form.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-table-query.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format.ts`)
- **Types**: `kebab-case.ts` (e.g., `table-type.ts`)
- **Private folders**: `_components/`, `_contents/`

### 5. Import Path Rules

- **Path constants**: Always use `PATHS` from `/data/path.ts`
- **Absolute imports**: Use `@/` prefix for all imports outside current directory
- **Relative imports**: Only for files in same folder (rare)

**Example:**

```typescript
// ✅ Good
import { PROTECTED_PATHS } from "@/data/path";
import { useSafeQuery } from "@/hooks/use-safe-query";

// ❌ Bad
import { useSafeQuery } from "../../../hooks/use-safe-query";
const path = "/tables"; // Hard-coded path
```

### 6. Component Organization

- **Page-specific**: `app/[route]/_components/` (e.g., `table-card.tsx`)
- **Shared components**: `/components/` (e.g., `sidebar.tsx`)
- **UI primitives**: `/components/ui/` (e.g., `button.tsx`)
- **Size limit**: Keep components under 300 lines

**Validation Flow:**

```
Form Input
    ↓
Zod Schema (schema/)
    ↓
React Hook Form
    ↓
Type-safe API call
    ↓
Backend validation
```

## Best Practices

### API Calls

✅ **Do:**

```typescript
// In api/table-api.ts
export const getTables = (filters?: TableFilter) =>
  api.get<ApiResponse<Table[]>>("/api/admin/tables", { params: filters });

// In component
const { data } = useSafeQuery(["tables", filters], () => getTables(filters));
```

❌ **Don't:**

```typescript
// Never call API directly in component
const response = await axios.get("/api/admin/tables");
```

### Form Handling

✅ **Do:**

```typescript
// 1. Define schema in /schema
export const tableSchema = z.object({
  tableNumber: z.string().min(1),
  capacity: z.number().min(1),
});

// 2. Use in component with React Hook Form
const form = useForm<CreateTableForm>({
  resolver: zodResolver(tableSchema),
});

// 3. Submit with safe mutation
const mutation = useSafeMutation(createTable, {
  successMessage: "Table created!",
});
```

### Protected Routes

- **Route Groups**: Use `(auth)` for public, `(owner)` for protected
- **Auth Guard**: Wrap pages with `<AuthGuard>` component
- **Hooks**: Use `useAuth()`, `useAuthCheck()`, `useUser()`

### Component Structure

**Tables Page Example:**

```
app/(owner)/tables/
├── page.tsx                    # 6 lines - entry point
├── _contents/
│   ├── content.tsx            # State, handlers, composition
│   └── use-table-query.ts     # React Query hooks only
└── _components/
    ├── table-header.tsx       # < 100 lines
    ├── table-filters.tsx      # < 100 lines
    ├── table-grid.tsx         # < 100 lines
    └── table-card.tsx         # < 200 lines
```

### Error Handling

✅ **Centralized with Safe Hooks:**

```typescript
// Automatic error toast
const { data } = useSafeQuery(["tables"], getTables);

// Custom error message
const mutation = useSafeMutation(deleteTable, {
  errorMessage: "Failed to delete table",
  successMessage: "Table deleted successfully",
});
```

### Code Style

- **Imports**: Sort by external → internal → relative
- **Types**: Define at top of file or in `/types`
- **Components**: One component per file
- **Exports**: Named exports preferred over default
- **Comments**: Only when necessary, code should be self-documenting
