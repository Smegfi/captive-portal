"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { smtpConfigurationSchema, smtpConfigurationSchemaType } from "@/server/actions-scheme/configuration/smtp-schema";
import { updateSmtpConfigurationAction } from "@/server/actions/config-actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface SmtpSettingsProps {
   smtpConfiguration: smtpConfigurationSchemaType;
}

export default function SmtpSettings({ smtpConfiguration }: SmtpSettingsProps) {
   const { execute, isExecuting } = useAction(updateSmtpConfigurationAction, {
      onSuccess: () => {
         toast.success("SMTP konfigurace byla úspěšně aktualizována");
      },
      onError: (error) => {
         toast.error(error.error?.serverError?.message ?? "Chyba při aktualizaci SMTP konfigurace");
      },
   });

   const form = useForm<smtpConfigurationSchemaType>({
      resolver: zodResolver(smtpConfigurationSchema),
      defaultValues: {
         host: smtpConfiguration.host,
         port: smtpConfiguration.port,
         secure: smtpConfiguration.secure,
         from: smtpConfiguration.from,
         auth: {
            user: smtpConfiguration.auth?.user || "",
            pass: smtpConfiguration.auth?.pass || "",
         },
      },
   });

   async function onSubmit(data: smtpConfigurationSchemaType) {
      await execute({
         host: data.host,
         port: data.port,
         secure: data.secure,
         from: data.from,
         auth: {
            user: data.auth?.user || "",
            pass: data.auth?.pass || "",
         },
      });
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>SMTP konfigurace</CardTitle>
            <CardDescription>Nastavení SMTP serveru pro odesílání emailů.</CardDescription>
         </CardHeader>
         <CardContent>
            <form id="smtp-settings-form" onSubmit={form.handleSubmit(onSubmit)}>
               <FieldGroup className="gap-6">
                  <Controller
                     name="host"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Server</FieldLabel>
                           <Input {...field} id={field.name} placeholder="smtp.example.com" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="from"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Adresa odesílatele</FieldLabel>
                           <Input {...field} id={field.name} placeholder="your-email@example.com" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="port"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Port</FieldLabel>
                           <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" id={field.name} placeholder="587" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="secure"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                           <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                           <FieldLabel htmlFor={field.name}>SSL/TLS zabezpečení</FieldLabel>
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="auth.user"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Uživatelské jméno</FieldLabel>
                           <Input {...field} id={field.name} placeholder="your-email@example.com" type="email" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="auth.pass"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Heslo</FieldLabel>
                           <Input {...field} id={field.name} placeholder="********" type="password" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
               </FieldGroup>
            </form>
         </CardContent>
         <CardFooter className="justify-end">
            <Button type="submit" form="smtp-settings-form">
               {isExecuting ? <Loader2 className="animate-spin" /> : <Save />}
               Uložit
            </Button>
         </CardFooter>
      </Card>
   );
}
