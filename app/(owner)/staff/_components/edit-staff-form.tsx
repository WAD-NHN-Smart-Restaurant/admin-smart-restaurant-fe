"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStaffSchema } from "@/schema/staff-management-schema";
import { StaffMember } from "@/types/staff-management-type";
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
import { Loader2 } from "lucide-react";

interface EditStaffFormProps {
  staff: StaffMember;
  onSubmit: (data: {
    name?: string;
    phone_number?: string;
    avatar_url?: string;
  }) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function EditStaffForm({
  staff,
  onSubmit,
  isSubmitting,
  onCancel,
}: EditStaffFormProps) {
  const form = useForm<{
    name?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  }>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      name: staff.name || "",
      phoneNumber: staff.phoneNumber || "",
      avatarUrl: staff.avatarUrl || "",
    },
  });

  const handleSubmit = (data: any) => {
    const updates: any = {};
    if (data.name !== undefined && data.name !== staff.name)
      updates.name = data.name;
    if (
      data.phoneNumber !== undefined &&
      data.phoneNumber !== staff.phoneNumber
    )
      updates.phoneNumber = data.phoneNumber || undefined;
    if (data.avatarUrl !== undefined && data.avatarUrl !== staff.avatarUrl)
      updates.avatarUrl = data.avatarUrl || undefined;

    onSubmit(updates);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Email: {staff.email}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Role: {staff.role}
          </div>
        </div>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                International format recommended (e.g., +1234567890)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar URL */}
        {/* <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                URL to the staff member's profile picture
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
                Updating...
              </>
            ) : (
              "Update Staff Member"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
