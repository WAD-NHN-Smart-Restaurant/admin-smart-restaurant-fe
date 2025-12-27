"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MenuItem } from "@/types/menu-item-type";
import {
  AttachModifierGroupsForm,
  attachModifierGroupsSchema,
} from "@/schema/menu-item-schema";
import { useModifierGroupsQuery } from "../../modifiers/_contents/use-modifier-query";
import { useAttachModifierGroupsMutation } from "../_contents/use-menu-item-query";

interface MenuItemModifiersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onMenuItemUpdate?: (updatedItem: MenuItem) => void;
}

export function MenuItemModifiersDialog({
  isOpen,
  onClose,
  menuItem,
}: MenuItemModifiersDialogProps) {
  // Get modifier groups
  const modifierGroupsQuery = useModifierGroupsQuery({
    sortBy: "displayOrder",
    sortOrder: "asc",
  });

  // Attach mutation
  const attachMutation = useAttachModifierGroupsMutation();

  const form = useForm<AttachModifierGroupsForm>({
    resolver: zodResolver(attachModifierGroupsSchema),
    defaultValues: {
      groupIds: [],
    },
  });

  // Compute selected group IDs from menu item (derived state)
  const selectedGroupIds = useMemo(() => {
    return menuItem?.menuItemModifierGroups?.map((group) => group.id) || [];
  }, [menuItem]);

  // Update form when selectedGroupIds changes
  useEffect(() => {
    form.setValue("groupIds", selectedGroupIds);
  }, [form, selectedGroupIds]);

  const onSubmit = (data: AttachModifierGroupsForm) => {
    if (!menuItem) return;

    attachMutation.mutate(
      {
        menuItemId: menuItem.id,
        data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleGroupToggle = (groupId: string, checked: boolean) => {
    const currentGroupIds = form.getValues("groupIds");
    const newGroupIds = checked
      ? [...currentGroupIds, groupId]
      : currentGroupIds.filter((id) => id !== groupId);

    form.setValue("groupIds", newGroupIds);
  };

  const availableGroups = modifierGroupsQuery.data || [];
  const isLoading = attachMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Modifier Groups</DialogTitle>
          <DialogDescription>
            Attach modifier groups to <strong>{menuItem?.name}</strong> to allow
            customers to customize this item.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="groupIds"
              render={() => (
                <FormItem>
                  {modifierGroupsQuery.isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading modifier groups...</span>
                    </div>
                  ) : availableGroups.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No modifier groups available.</p>
                      <p className="text-sm">
                        Create modifier groups first to attach them to menu
                        items.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableGroups.map((group) => {
                        const currentGroupIds = form.watch("groupIds") || [];
                        const isChecked = currentGroupIds.includes(group.id);
                        return (
                          <FormField
                            key={group.id}
                            control={form.control}
                            name="groupIds"
                            render={() => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) =>
                                      handleGroupToggle(
                                        group.id,
                                        checked as boolean,
                                      )
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none flex-1">
                                  <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">
                                      {group.name}
                                    </FormLabel>
                                    <Badge
                                      variant={
                                        group.isRequired
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {group.isRequired
                                        ? "Required"
                                        : "Optional"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {group.selectionType}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {group.minSelections || 0}-
                                    {group.maxSelections || "unlimited"}{" "}
                                    selections
                                  </div>
                                  {group.modifierOptions.length > 0 && (
                                    <div className="text-xs text-gray-500 mt-2">
                                      Options:{" "}
                                      {group.modifierOptions
                                        .slice(0, 3)
                                        .map((option) => option.name)
                                        .join(", ")}
                                      {group.modifierOptions.length > 3 &&
                                        ` +${group.modifierOptions.length - 3} more`}
                                    </div>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Modifier Groups
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
