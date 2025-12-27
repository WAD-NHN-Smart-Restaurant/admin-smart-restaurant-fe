import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Settings } from "lucide-react";
import { ModifierGroup, ModifierGroupStatus } from "@/types/modifier-type";

interface DeleteModifierGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  modifierGroup: ModifierGroup | null;
}

export const DeleteModifierGroupDialog = memo(
  function DeleteModifierGroupDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    modifierGroup,
  }: DeleteModifierGroupDialogProps) {
    if (!modifierGroup) return null;

    const hasOptions = modifierGroup.modifierOptions.length > 0;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Modifier Group
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Settings className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <h3 className="font-medium">{modifierGroup.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      modifierGroup.status === ModifierGroupStatus.ACTIVE
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {modifierGroup.status.toLowerCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {modifierGroup.modifierOptions.length} options
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                Are you sure you want to delete this modifier group? This action
                cannot be undone.
              </p>

              {hasOptions && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800">
                    <strong>Warning:</strong> This group contains{" "}
                    {modifierGroup.modifierOptions.length} option(s) that will
                    also be deleted:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-yellow-700 text-xs">
                    {modifierGroup.modifierOptions.slice(0, 3).map((option) => (
                      <li key={option.id}>{option.name}</li>
                    ))}
                    {modifierGroup.modifierOptions.length > 3 && (
                      <li>
                        ... and {modifierGroup.modifierOptions.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
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
                Delete Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
