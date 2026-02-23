"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { getEmailConfigurationAction, sendTestEmailAction, updateEmailConfigurationAction } from "@/server/actions/email-actions";
import { emailConfigurationSchema, emailConfigurationSchemaType } from "@/server/actions-scheme/configuration/email-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

export default function SettingsPage() {
   const { execute, isExecuting } = useAction(sendTestEmailAction);

   const form = useForm<emailConfigurationSchemaType>({
      resolver: zodResolver(emailConfigurationSchema),
      defaultValues: {
         host: "",
         port: 25,
         secure: false,
         auth: {
            user: "",
            pass: "",
         },
      },
   });

   async function loadEmailConfiguration() {
      const configuration = await getEmailConfigurationAction();
      form.reset(configuration.data);
   }

   useEffect(() => {
      loadEmailConfiguration();
   }, []);

   async function onSubmit(data: emailConfigurationSchemaType) {
      await updateEmailConfigurationAction(data);
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Nastavení</h1>
         <div>
            <div className="flex gap-4">Pracujeme na tom</div>

            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
               <FieldGroup>
                  <Controller
                     name="host"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor="form-rhf-demo-host">Host</FieldLabel>
                           <Input {...field} id="form-rhf-demo-host" aria-invalid={fieldState.invalid} placeholder="smtp.example.com" autoComplete="off" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="port"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor="form-rhf-demo-port">Port</FieldLabel>
                           <Input
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              type="number"
                              id="form-rhf-demo-port"
                              aria-invalid={fieldState.invalid}
                              placeholder="587"
                              autoComplete="off"
                           />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="secure"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                           <Checkbox id="form-rhf-demo-secure" checked={field.value} onCheckedChange={field.onChange} />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                           <FieldLabel htmlFor="form-rhf-demo-secure">Secure</FieldLabel>
                        </Field>
                     )}
                  />
                  <Controller
                     name="auth.user"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor="form-rhf-demo-auth-user">User</FieldLabel>
                           <Input
                              {...field}
                              id="form-rhf-demo-auth-user"
                              aria-invalid={fieldState.invalid}
                              placeholder="your-email@example.com"
                              autoComplete="off"
                           />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
                  <Controller
                     name="auth.pass"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor="form-rhf-demo-auth-pass">Password</FieldLabel>
                           <Input {...field} id="form-rhf-demo-auth-pass" placeholder="********" autoComplete="off" type="password" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
               </FieldGroup>
               <Button type="submit">Uložit</Button>
            </form>

            <div>
               <Button onClick={() => execute({ email: "feedopeedo@gmail.com" })} disabled={isExecuting}>
                  {isExecuting ? <Loader2 /> : <Send />}
                  {isExecuting ? "Odesílám..." : "Testovací email"}
               </Button>
            </div>
         </div>
      </div>
   );
}
