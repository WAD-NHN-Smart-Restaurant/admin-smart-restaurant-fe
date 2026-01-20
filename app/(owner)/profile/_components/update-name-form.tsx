"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProfile } from "@/app/(owner)/profile/_hooks/use-profile";
import { useAuth } from "@/context/auth-context";
import { Loader2, Pencil, X, Check } from "lucide-react";

interface UpdateNameFormProps {
  userId: string;
}

export default function UpdateNameForm({ userId }: UpdateNameFormProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const updateProfile = useUpdateProfile(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      return;
    }

    try {
      await updateProfile.mutateAsync({ fullName: fullName });
      setIsEditing(false);
      setFullName("");
    } catch (error: any) {
      // Error is handled by useSafeMutation
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Full Name</h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.profile?.fullName || "Not set"}
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Full Name</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={updateProfile.isPending}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={updateProfile.isPending || !fullName.trim()}
              className="flex-1"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFullName("");
              }}
              disabled={updateProfile.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
