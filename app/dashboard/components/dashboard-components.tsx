"use client";

import React from "react";
import { LogOut, User as UserIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useUser } from "@/context/auth-context";

export const DashboardHeader: React.FC = () => {
  const { logout, isLogoutLoading } = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
            )}

            <Button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLogoutLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const UserInfoCard: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-base text-foreground">{user.name}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base text-foreground">{user.email}</p>
          </div>
        </div>

        {user.role && (
          <div className="flex items-start space-x-3">
            <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-base text-foreground capitalize">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
