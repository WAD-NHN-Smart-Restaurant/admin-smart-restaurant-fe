"use client";

import { memo, useCallback } from "react";
import { MenuItem } from "@/types/menu-item-type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";

interface DeleteMenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  menuItem: MenuItem | null;
}

export const DeleteMenuItemDialog = memo(function DeleteMenuItemDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  menuItem,
}: DeleteMenuItemDialogProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  if (!menuItem) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                This action cannot be undone. The menu item will be permanently
                removed.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Menu Item Details */}
        <div className="my-4 rounded-lg border bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{menuItem.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Price: {formatPrice(menuItem.price)}
              </p>
              {menuItem.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {menuItem.description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge
                variant={
                  menuItem.status === "ACTIVE"
                    ? "default"
                    : menuItem.status === "INACTIVE"
                      ? "secondary"
                      : "destructive"
                }
              >
                {menuItem.status}
              </Badge>
              {menuItem.isChefRecommendation && (
                <Badge
                  variant="outline"
                  className="text-yellow-700 border-yellow-300"
                >
                  Chef&apos;s Choice
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Deleting this menu item will also remove
            all associated photos and order history.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
