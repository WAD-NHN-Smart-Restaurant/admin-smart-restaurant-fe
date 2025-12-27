import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, Settings, Plus } from "lucide-react";
import { modifierGroupSchema } from "@/schema/modifier-schema";
import {
  ModifierGroup,
  ModifierSelectionType,
  ModifierGroupStatus,
} from "@/types/modifier-type";

interface ModifierGroupFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    selectionType: string;
    isRequired: boolean;
    minSelections: number;
    maxSelections: number;
    displayOrder: number;
    status: string;
  }) => void;
  isLoading: boolean;
  mode: "create" | "edit";
  initialData?: ModifierGroup | null;
}

export const ModifierGroupFormDialog = memo(function ModifierGroupFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  initialData,
}: ModifierGroupFormDialogProps) {
  const form = useForm({
    resolver: zodResolver(modifierGroupSchema),
    defaultValues: {
      name: "",
      selectionType: ModifierSelectionType.SINGLE,
      isRequired: false,
      minSelections: 0,
      maxSelections: 1,
      displayOrder: 1,
      status: ModifierGroupStatus.ACTIVE,
    },
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (isOpen && initialData && mode === "edit") {
      form.reset({
        name: initialData.name,
        selectionType: initialData.selectionType,
        isRequired: initialData.isRequired,
        minSelections: initialData.minSelections,
        maxSelections: initialData.maxSelections,
        displayOrder: initialData.displayOrder,
        status: initialData.status,
      });
    } else if (isOpen && mode === "create") {
      form.reset({
        name: "",
        selectionType: ModifierSelectionType.SINGLE,
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        displayOrder: 1,
        status: ModifierGroupStatus.ACTIVE,
      });
    }
  }, [isOpen, initialData, mode, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const selectionType = form.watch("selectionType");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Create Modifier Group
              </>
            ) : (
              <>
                <Settings className="h-5 w-5" />
                Edit Modifier Group
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Size, Toppings, Drink Options"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="selectionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selection Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ModifierSelectionType.SINGLE}>
                            Single Selection
                          </SelectItem>
                          <SelectItem value={ModifierSelectionType.MULTIPLE}>
                            Multiple Selection
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === ModifierSelectionType.SINGLE
                          ? "Customers can select only one option"
                          : "Customers can select multiple options"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ModifierGroupStatus.ACTIVE}>
                            Active
                          </SelectItem>
                          <SelectItem value={ModifierGroupStatus.INACTIVE}>
                            Inactive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Selection Rules */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Selection Rules</h3>

              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Required Selection</FormLabel>
                      <FormDescription>
                        Customers must select at least one option
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minSelections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Selections</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={99}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          disabled={
                            isLoading ||
                            selectionType === ModifierSelectionType.SINGLE
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSelections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Selections</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={99}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                          disabled={
                            isLoading ||
                            selectionType === ModifierSelectionType.SINGLE
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Display Order */}
            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={9999}
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls the order this group appears in menus (lower
                      numbers appear first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Group" : "Update Group"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
