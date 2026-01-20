"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useUpdatePhoneNumber } from "@/app/(owner)/profile/_hooks/use-profile";

const updatePhoneSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must be in E.164 format (e.g., +1234567890)",
    ),
});

type UpdatePhoneFormData = z.infer<typeof updatePhoneSchema>;

export default function UpdatePhoneForm() {
  const { user } = useAuth();
  const updatePhone = useUpdatePhoneNumber(user?.id || "");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePhoneFormData>({
    resolver: zodResolver(updatePhoneSchema),
    defaultValues: {
      phone: user?.profile?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: UpdatePhoneFormData) => {
    setError(null);

    try {
      await updatePhone.mutateAsync(data.phone);
      form.reset({ phone: data.phone });
    } catch (err: any) {
      setError(err?.message || "Failed to update phone number");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Update Phone Number
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter phone number in E.164 format (e.g., +1234567890)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={updatePhone.isPending}
              className="w-full"
            >
              {updatePhone.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Phone Number
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
