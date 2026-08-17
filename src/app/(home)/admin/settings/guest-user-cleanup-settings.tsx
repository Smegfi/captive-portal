"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateGuestUserCleanupConfig } from "@/server/repositories/guest-user/cleanup-config";
import { updateGuestUserCleanupConfigSchema, UpdateGuestUserCleanupConfigSchemaType } from "@/server/repositories/guest-user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface GuestUserCleanupSettingsProps {
   retentionMonths: number;
}

export default function GuestUserCleanupSettings({ retentionMonths }: GuestUserCleanupSettingsProps) {
   const { execute, isExecuting } = useAction(updateGuestUserCleanupConfig, {
      onSuccess: () => {
         toast.success("Nastavení automatického mazání bylo uloženo.");
      },
      onError: (error) => {
         toast.error(error.error?.serverError?.message ?? "Nepodařilo se uložit nastavení automatického mazání.");
      },
   });

   const form = useForm<UpdateGuestUserCleanupConfigSchemaType>({
      resolver: zodResolver(updateGuestUserCleanupConfigSchema),
      defaultValues: {
         retentionMonths,
      },
   });

   function onSubmit(values: UpdateGuestUserCleanupConfigSchemaType) {
      execute(values);
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Automatické mazání guest uživatelů</CardTitle>
            <CardDescription>Počet měsíců neaktivity (updatedAt), po kterých bude guest uživatel automaticky odstraněn.</CardDescription>
         </CardHeader>
         <CardContent>
            <form id="guest-user-cleanup-settings-form" onSubmit={form.handleSubmit(onSubmit)}>
               <Controller
                  name="retentionMonths"
                  control={form.control}
                  render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Retence (měsíce)</FieldLabel>
                        <Input
                           {...field}
                           id={field.name}
                           type="number"
                           min={1}
                           max={60}
                           onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                     </Field>
                  )}
               />
            </form>
         </CardContent>
         <CardFooter className="justify-end">
            <Button type="submit" form="guest-user-cleanup-settings-form" disabled={isExecuting}>
               {isExecuting ? <Loader2 className="animate-spin" /> : <Save />}
               Uložit
            </Button>
         </CardFooter>
      </Card>
   );
}
