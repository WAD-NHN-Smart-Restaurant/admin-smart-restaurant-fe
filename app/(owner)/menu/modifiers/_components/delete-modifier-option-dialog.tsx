import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Tag } from "lucide-react";
import { ModifierOption, ModifierOptionStatus } from "@/types/modifier-type";

interface DeleteModifierOptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  modifierOption: ModifierOption | null;
  groupName?: string;
}

export const DeleteModifierOptionDialog = memo(
  function DeleteModifierOptionDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    modifierOption,
    groupName,
  }: DeleteModifierOptionDialogProps) {
    if (!modifierOption) return null;

    const formatPrice = (price: number) => {
      if (price === 0) return "Free";
      return price > 0
        ? `+$${price.toFixed(2)}`
        : `-$${Math.abs(price).toFixed(2)}`;
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Option
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Tag className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h3 className="font-medium">{modifierOption.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      modifierOption.status === ModifierOptionStatus.ACTIVE
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {modifierOption.status.toLowerCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(modifierOption.priceAdjustment)}
                  </span>
                </div>
                {groupName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    in &ldquo;{groupName}&rdquo; group
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Are you sure you want to delete this modifier option? This
                action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Option
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
