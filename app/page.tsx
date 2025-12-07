import Image from "next/image";
import Link from "next/link";
import { AUTH_PATHS, PROTECTED_PATHS } from "@/data/path";

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-background font-sans flex">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 py-32">
        <div className="flex flex-col items-center gap-8 text-center w-full">
          <Image
            className="dark:invert mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={37}
            priority
          />

          <h1 className="max-w-2xl text-5xl leading-tight font-bold tracking-tight text-foreground">
            Fast Restaurant Authentication System
          </h1>

          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            A complete authentication system built with Next.js, React Query,
            Axios, and React Hook Form. Features include JWT token management,
            protected routes, and automatic token refresh.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <Link
              href={AUTH_PATHS.LOGIN}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href={AUTH_PATHS.REGISTER}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors border border-border"
            >
              Create Account
            </Link>

            <Link
              href={PROTECTED_PATHS.DASHBOARD}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-accent rounded-md hover:bg-accent/80 transition-colors border border-border"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-12 w-full">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  🔐 Secure Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  JWT-based authentication with access and refresh tokens
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  🔄 Auto Token Refresh
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatic token refresh when access token expires
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  🛡️ Protected Routes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Route guards to protect authenticated pages
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  📝 Form Validation
                </h3>
                <p className="text-sm text-muted-foreground">
                  React Hook Form with Zod schema validation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
