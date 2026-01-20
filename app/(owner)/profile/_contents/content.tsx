"use client";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import UpdateNameForm from "../_components/update-name-form";
import UpdateAvatarForm from "../_components/update-avatar-form";
import UpdatePasswordForm from "../_components/update-password-form";
import UpdatePhoneForm from "../_components/update-phone-form";

export default function ProfileContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Profile Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Forms */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <UpdateAvatarForm userId={user.id} />
          <UpdateNameForm userId={user.id} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UpdatePhoneForm />
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
