"use client";

import { ProtectedRoute } from "@/components/auth-guard";
import {
  DashboardHeader,
  UserInfoCard,
  StatsCard,
} from "./components/dashboard-components";
import { Activity, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <Link href="/posts">Go to Dashboard</Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Your Dashboard
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your account and activities.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Orders"
              value="24"
              description="+2 from last week"
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatsCard
              title="Active Users"
              value="1,234"
              description="+180 from last month"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Revenue"
              value="$12,345"
              description="+15% from last month"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatsCard
              title="Activity"
              value="89%"
              description="System uptime"
              icon={<Activity className="h-5 w-5" />}
            />
          </div>

          {/* User Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1">
              <UserInfoCard />
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "Logged in", time: "2 minutes ago" },
                    { action: "Updated profile", time: "1 hour ago" },
                    { action: "Changed password", time: "2 days ago" },
                    { action: "Created new order", time: "3 days ago" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-border last:border-b-0"
                    >
                      <p className="text-sm text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
