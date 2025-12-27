"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tableSchema } from "@/schema/table-schema";
import { createTable, updateTable } from "@/api/table-api";
import {
  Table,
  TableLocation,
  CreateTableForm,
  UpdateTableForm,
} from "@/types/table-type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROTECTED_PATHS } from "@/data/path";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface TableFormProps {
  table?: Table;
  onSuccess?: () => void;
}

export function TableForm({ table, onSuccess }: TableFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!table;

  const form = useForm<CreateTableForm>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: table?.tableNumber || "",
      capacity: table?.capacity || 4,
      location: (table?.location as TableLocation) || TableLocation.INDOOR,
      description: table?.description || "",
      status: table?.status || "available",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Table created successfully");
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(PROTECTED_PATHS.TABLES.INDEX);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create table");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTableForm) => updateTable(table!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table", table!.id] });
      toast.success("Table updated successfully");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(PROTECTED_PATHS.TABLES.INDEX);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update table");
    },
  });

  const onSubmit = (data: CreateTableForm) => {
    if (isEdit) {
      const { status: _, ...updateData } = data;
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Table Number */}
        <FormField
          control={form.control}
          name="tableNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Number *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., T-001, A1, VIP-1"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Unique identifier for this table
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity (Seats) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="4"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(isNaN(value) ? "" : value);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Number of people this table can accommodate (1-20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location/Zone *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Select a location"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TableLocation).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Where this table is located in the restaurant
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this table..."
                  rows={3}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Any special notes or features (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        {table ? null : (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>{" "}
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Inactive tables cannot receive new orders
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(PROTECTED_PATHS.TABLES.INDEX);
              }
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Table" : "Create Table"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
