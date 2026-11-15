"use client";

import { SendButton } from "@/components/send-button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { FieldError, Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sendTestEmail } from "@/server/repositories/email/send-test";
import { sendTestEmailSchema, sendTestEmailSchemaType } from "@/server/repositories/email/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";

export default function TestEmail() {
   const { executeAsync } = useAction(sendTestEmail);

   const form = useForm<sendTestEmailSchemaType>({
      resolver: zodResolver(sendTestEmailSchema),
      defaultValues: {
         email: "",
      },
   });

   function onSend() {
      return new Promise<void>((resolve, reject) => {
         void form.handleSubmit(
            async (data) => {
               try {
                  const result = await executeAsync({ email: data.email });
                  if (!result?.data?.ok) {
                     reject(new Error("Nepodařilo se odeslat testovací email."));
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
            <CardTitle>Testovací email</CardTitle>
            <CardDescription>Odesílání testovacího emailu.</CardDescription>
         </CardHeader>
         <CardContent>
            <form id="test-email-form" onSubmit={(event) => event.preventDefault()}>
               <FieldGroup className="gap-6">
                  <Controller
                     name="email"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Adresa příjemce</FieldLabel>
                           <Input {...field} id={field.name} placeholder="email@example.com" aria-invalid={fieldState.invalid} />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
               </FieldGroup>
            </form>
         </CardContent>
         <CardFooter className="justify-end">
            <SendButton form="test-email-form" onSend={onSend} />
         </CardFooter>
      </Card>
   );
}
