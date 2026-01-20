"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useUploadAvatar,
  useDeleteAvatar,
  useProfile,
} from "@/app/(owner)/profile/_hooks/use-profile";
import { Loader2, Upload, Trash2, ImageIcon } from "lucide-react";

interface UpdateAvatarFormProps {
  userId: string;
}

export default function UpdateAvatarForm({ userId }: UpdateAvatarFormProps) {
  const { data: profile } = useProfile(userId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadAvatar = useUploadAvatar(userId);
  const deleteAvatar = useDeleteAvatar(userId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatar.mutateAsync(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      // Error handled by useSafeMutation
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar.mutateAsync();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      // Error handled by useSafeMutation
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Avatar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current avatar or preview */}
        {(previewUrl || profile?.avatarUrl) && (
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={previewUrl || profile?.avatarUrl || ""}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {profile?.avatarUrl && !previewUrl && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleDelete}
                  disabled={deleteAvatar.isPending}
                >
                  {deleteAvatar.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* File input */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="avatar-upload"
            disabled={uploadAvatar.isPending || deleteAvatar.isPending}
          />
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploadAvatar.isPending || deleteAvatar.isPending}
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Max size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        {/* Upload button (shown when file is selected) */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploadAvatar.isPending}
              className="flex-1"
            >
              {uploadAvatar.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearSelection}
              disabled={uploadAvatar.isPending}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
