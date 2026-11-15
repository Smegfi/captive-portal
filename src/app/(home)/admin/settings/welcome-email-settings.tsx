"use client";

import { SendButton } from "@/components/send-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateWelcomeEmailConfiguration } from "@/server/repositories/configuration/update";
import { welcomeEmailConfigurationSchema, WelcomeEmailConfigurationSchemaType } from "@/server/repositories/configuration/schema";
import { sendWelcomeEmail } from "@/server/repositories/email/send-welcome";
import { sendWelcomeEmailSchema, sendWelcomeEmailSchemaType } from "@/server/repositories/email/schema";
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

   const { executeAsync: executeSendWelcomeEmail } = useAction(sendWelcomeEmail);

   const form = useForm<WelcomeEmailConfigurationSchemaType>({
      resolver: zodResolver(welcomeEmailConfigurationSchema),
      defaultValues: {
         subject: welcomeEmailConfiguration.subject,
         bodyTemplate: welcomeEmailConfiguration.bodyTemplate,
      },
   });

   const sendForm = useForm<sendWelcomeEmailSchemaType>({
      resolver: zodResolver(sendWelcomeEmailSchema),
      defaultValues: {
         email: "",
      },
   });

   function onSubmit(data: WelcomeEmailConfigurationSchemaType) {
      execute(data);
   }

   function onSendWelcomeEmail() {
      return new Promise<void>((resolve, reject) => {
         void sendForm.handleSubmit(
            async (data) => {
               try {
                  const result = await executeSendWelcomeEmail({ email: data.email });
                  if (!result?.data?.ok) {
                     reject(new Error("Nepodařilo se odeslat uvítací email."));
                     return;
                  }
                  resolve();
               } catch (error) {
                  reject(error);
               }
            },
            () => {
               reject(new Error("Email musí být ve správném formátu"));
            }
         )();
      });
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
         <CardFooter className="flex-wrap gap-3">
            <form id="send-welcome-email-form" onSubmit={(event) => event.preventDefault()} className="flex items-start gap-2">
               <Controller
                  name="email"
                  control={sendForm.control}
                  render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid} className="w-56 sm:w-72">
                        <Input
                           {...field}
                           id="welcome-email-recipient"
                           type="email"
                           placeholder="email@example.com"
                           aria-label="Adresa příjemce"
                           aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                     </Field>
                  )}
               />
               <SendButton form="send-welcome-email-form" onSend={onSendWelcomeEmail} />
            </form>
            <Button type="submit" form="welcome-email-settings-form" disabled={isExecuting} className="ml-auto">
               {isExecuting ? <Loader2 className="animate-spin" /> : <Save />}
               Uložit
            </Button>
         </CardFooter>
      </Card>
   );
}
