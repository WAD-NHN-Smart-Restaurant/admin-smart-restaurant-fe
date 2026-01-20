"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema } from "@/schema/staff-management-schema";
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
import { STAFF_ROLES, StaffRole } from "@/types/staff-management-type";
import { Loader2 } from "lucide-react";

interface StaffFormProps {
  onSubmit: (data: {
    role: StaffRole;
    email: string;
    name: string;
    password?: string;
  }) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function StaffForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: StaffFormProps) {
  const form = useForm<{
    email: string;
    name: string;
    password?: string;
    role: StaffRole;
  }>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "waiter",
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      role: data.role,
      email: data.email,
      name: data.name,
      password: data.password || undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Role Selection */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff Role *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STAFF_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign a role to determine permissions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@restaurant.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                This will be used for login credentials
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password (Optional) */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Leave empty for default password"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                If left empty, a default password will be assigned
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Staff Member"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
