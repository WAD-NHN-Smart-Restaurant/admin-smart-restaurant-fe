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
import { Loader2, Tag, Plus } from "lucide-react";
import { modifierOptionSchema } from "@/schema/modifier-schema";
import { ModifierOption, ModifierOptionStatus } from "@/types/modifier-type";

interface ModifierOptionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    priceAdjustment: number;
    status: string;
  }) => void;
  isLoading: boolean;
  mode: "create" | "edit";
  initialData?: ModifierOption | null;
  groupName?: string;
}

export const ModifierOptionFormDialog = memo(function ModifierOptionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  initialData,
  groupName,
}: ModifierOptionFormDialogProps) {
  const form = useForm({
    resolver: zodResolver(modifierOptionSchema),
    defaultValues: {
      name: "",
      priceAdjustment: 0,
      status: ModifierOptionStatus.ACTIVE,
    },
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (isOpen && initialData && mode === "edit") {
      form.reset({
        name: initialData.name,
        priceAdjustment: initialData.priceAdjustment,
        status: initialData.status,
      });
    } else if (isOpen && mode === "create") {
      form.reset({
        name: "",
        priceAdjustment: 0,
        status: ModifierOptionStatus.ACTIVE,
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

  const formatPriceDisplay = (value: number) => {
    if (value === 0) return "Free";
    return value > 0
      ? `+$${value.toFixed(2)}`
      : `-$${Math.abs(value).toFixed(2)}`;
  };

  const priceAdjustment = form.watch("priceAdjustment");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Add Option to &ldquo;{groupName}&rdquo;
              </>
            ) : (
              <>
                <Tag className="h-5 w-5" />
                Edit Option in &ldquo;{groupName}&rdquo;
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
                    <FormLabel>Option Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Small, Medium, Large"
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
                  name="priceAdjustment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Adjustment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="-999"
                          max="999"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        {formatPriceDisplay(priceAdjustment || 0)}
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
                          <SelectItem value={ModifierOptionStatus.ACTIVE}>
                            Active
                          </SelectItem>
                          <SelectItem value={ModifierOptionStatus.INACTIVE}>
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
                {mode === "create" ? "Add Option" : "Update Option"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
