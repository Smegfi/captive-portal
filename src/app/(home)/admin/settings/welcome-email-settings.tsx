"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateWelcomeEmailConfiguration } from "@/server/repositories/configuration/update";
import { welcomeEmailConfigurationSchema, WelcomeEmailConfigurationSchemaType } from "@/server/repositories/configuration/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface WelcomeEmailSettingsProps {
   welcomeEmailConfiguration: WelcomeEmailConfigurationSchemaType;
}

export default function WelcomeEmailSettings({ welcomeEmailConfiguration }: WelcomeEmailSettingsProps) {
   const { execute, isExecuting } = useAction(updateWelcomeEmailConfiguration, {
      onSuccess: () => {
         toast.success("Konfigurace uvítacího emailu byla uložena.");
      },
      onError: (error) => {
         toast.error(error.error?.serverError?.message ?? "Nepodařilo se uložit konfiguraci uvítacího emailu.");
      },
   });

   const form = useForm<WelcomeEmailConfigurationSchemaType>({
      resolver: zodResolver(welcomeEmailConfigurationSchema),
      defaultValues: {
         subject: welcomeEmailConfiguration.subject,
         bodyTemplate: welcomeEmailConfiguration.bodyTemplate,
      },
   });

   function onSubmit(data: WelcomeEmailConfigurationSchemaType) {
      execute(data);
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Uvítací email</CardTitle>
            <CardDescription>
               Nastavení předmětu a obsahu uvítacího emailu pro nové guest uživatele s marketingovým souhlasem. Podporované placeholdery:
               `[ODKAZ_NA_PODMINKY_A_OCHRANU_OSOBNICH_UDAJU]` a `[KONTAKTNI_EMAIL]`.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form id="welcome-email-settings-form" onSubmit={form.handleSubmit(onSubmit)}>
               <FieldGroup className="gap-6">
                  <Controller
                     name="subject"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Předmět</FieldLabel>
                           <Input {...field} id={field.name} />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />

                  <Controller
                     name="bodyTemplate"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Text emailu</FieldLabel>
                           <textarea
                              {...field}
                              id={field.name}
                              rows={16}
                              className={cn(
                                 "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                              )}
                           />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
               </FieldGroup>
            </form>
         </CardContent>
         <CardFooter className="justify-end">
            <Button type="submit" form="welcome-email-settings-form" disabled={isExecuting}>
               {isExecuting ? <Loader2 className="animate-spin" /> : <Save />}
               Uložit
            </Button>
         </CardFooter>
      </Card>
   );
}
