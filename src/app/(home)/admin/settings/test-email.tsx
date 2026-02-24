"use client";

import { useAction } from "next-safe-action/hooks";
import { sendTestEmailAction } from "@/server/actions/email-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendTestEmailSchema, sendTestEmailSchemaType } from "@/server/actions-scheme/email/email-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FieldError, Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";

export default function TestEmail() {
   const { execute, isExecuting } = useAction(sendTestEmailAction);

   const form = useForm<sendTestEmailSchemaType>({
      resolver: zodResolver(sendTestEmailSchema),
      defaultValues: {
         email: "",
      },
   });

   function onSubmit(data: sendTestEmailSchemaType) {
      execute({ email: data.email });
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Testovací email</CardTitle>
            <CardDescription>Odesílání testovacího emailu.</CardDescription>
         </CardHeader>
         <CardContent>
            <form id="test-email-form" onSubmit={form.handleSubmit(onSubmit)}>
               <FieldGroup className="gap-6">
                  <Controller
                     name="email"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>Adresa příjemce</FieldLabel>
                           <Input {...field} id={field.name} placeholder="email@example.com" />
                           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                     )}
                  />
               </FieldGroup>
            </form>
         </CardContent>
         <CardFooter className="justify-end">
            <Button type="submit" form="test-email-form">
               {isExecuting ? <Loader2 className="animate-spin" /> : <Send />}
               Odeslat
            </Button>
         </CardFooter>
      </Card>
   );
}
