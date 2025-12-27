"use client";

import { memo, useCallback, useState, useMemo } from "react";
import { MenuItem } from "@/types/menu-item-type";
import {
  useUploadMenuItemPhotosMutation,
  useDeleteMenuItemPhotoMutation,
  useSetPrimaryMenuItemPhotoMutation,
} from "../_contents/use-menu-item-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  MoreVertical,
  Star,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface MenuItemPhotosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
}

export const MenuItemPhotosDialog = memo(function MenuItemPhotosDialog({
  isOpen,
  onClose,
  menuItem,
}: MenuItemPhotosDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const uploadMutation = useUploadMenuItemPhotosMutation();
  const deleteMutation = useDeleteMenuItemPhotoMutation();
  const setPrimaryMutation = useSetPrimaryMenuItemPhotoMutation();

  const photos = useMemo(() => menuItem?.menuItemPhotos || [], [menuItem?.menuItemPhotos]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setSelectedFiles(files);
    },
    [],
  );

  const handleUpload = useCallback(() => {
    if (!menuItem || selectedFiles.length === 0) return;

    // Convert File[] back to FileList-like object
    const fileList = Object.assign(selectedFiles, {
      length: selectedFiles.length,
      item: (index: number) => selectedFiles[index] || null,
      [Symbol.iterator]: function* () {
        for (let i = 0; i < selectedFiles.length; i++) {
          yield selectedFiles[i];
        }
      },
    }) as unknown as FileList;

    uploadMutation.mutate(
      {
        menuItemId: menuItem.id,
        files: fileList,
      },
      {
        onSuccess: () => {
          setSelectedFiles([]);
          toast.success("Photos uploaded successfully");
        },
        onError: (error: unknown) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to upload photos",
          );
        },
      },
    );
  }, [menuItem, selectedFiles, uploadMutation]);

  const handleDeletePhoto = useCallback(
    (photoId: string) => {
      if (!menuItem) return;

      deleteMutation.mutate(
        {
          menuItemId: menuItem.id,
          photoId,
        },
        {
          onSuccess: () => {
            toast.success("Photo deleted successfully");
          },
          onError: (error: unknown) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to delete photo",
            );
          },
        },
      );
    },
    [menuItem, deleteMutation],
  );

  const handleSetPrimary = useCallback(
    (photoId: string) => {
      if (!menuItem) return;

      setPrimaryMutation.mutate(
        {
          menuItemId: menuItem.id,
          photoId,
        },
        {
          onSuccess: () => {
            toast.success("Primary photo updated");
          },
          onError: (error: unknown) => {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to set primary photo",
            );
          },
        },
      );
    },
    [menuItem, setPrimaryMutation],
  );

  const clearSelectedFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  if (!menuItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Manage Photos - {menuItem.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Upload New Photos</h3>
              {selectedFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelectedFiles}
                >
                  Clear ({selectedFiles.length})
                </Button>
              )}
            </div>

            <label htmlFor="photo-upload" className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop files here or click to upload
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, WEBP up to 5MB each
                    </span>
                  </div>
                </div>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>

            {selectedFiles.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedFiles.map((file, index) => (
                    <Badge key={index} variant="secondary">
                      {file.name}
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload {selectedFiles.length} Photo
                  {selectedFiles.length > 1 ? "s" : ""}
                </Button>
              </div>
            )}
          </div>

          {/* Current Photos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Current Photos</h3>
              <Badge variant="outline">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">No photos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                      <Image
                        src={photo.url}
                        alt={`${menuItem.name} photo`}
                        fill
                        className="object-cover"
                      />
                      {photo.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!photo.isPrimary && (
                            <DropdownMenuItem
                              onClick={() => handleSetPrimary(photo.id)}
                              disabled={setPrimaryMutation.isPending}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Set as Primary
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
