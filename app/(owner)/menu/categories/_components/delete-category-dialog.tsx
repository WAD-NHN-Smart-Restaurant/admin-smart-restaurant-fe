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
import { Badge } from "@/components/ui/badge";
import { Category, CategoryStatus } from "@/types/category-type";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  category: Category | null;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  category,
}: DeleteCategoryDialogProps) {
  if (!category) return null;

  const canDelete = category.itemCount === 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-left">
                Delete Category?
              </AlertDialogTitle>
            </div>
          </div>

          <AlertDialogDescription className="text-left space-y-3">
            <div>
              Are you sure you want to delete the category{" "}
              <span className="font-semibold">&quot;{category.name}&quot;</span>
              ?
            </div>

            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <span>{category.name}</span>
                <Badge
                  variant={
                    category.status === CategoryStatus.ACTIVE
                      ? "default"
                      : "secondary"
                  }
                >
                  {category.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Items:</span>
                <span>{category.itemCount} menu items</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Display Order:</span>
                <span>#{category.displayOrder}</span>
              </div>
            </div>

            {!canDelete && (
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    Cannot delete this category
                  </span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">
                  This category has {category.itemCount} active menu items.
                  Please remove or move these items to another category first.
                </p>
              </div>
            )}

            {canDelete && (
              <p className="text-destructive">
                This action cannot be undone. The category will be permanently
                removed from your system.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading || !canDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
