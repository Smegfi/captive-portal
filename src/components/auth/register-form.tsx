"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterSchema, RegisterSchemaType } from "@/server/actions-scheme/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function RegisterForm() {
   const [isLoading, setIsLoading] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);

   const form = useForm<RegisterSchemaType>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   });

   async function onSubmit(data: RegisterSchemaType) {
      await authClient.signUp.email(
         {
            email: data.email,
            password: data.password,
            name: data.name,
            role: "user",
         },
         {
            onRequest: () => {
               setIsLoading(true);
            },
            onSuccess: () => {
               setIsLoading(false);
               setIsSuccess(true);
            },
            onError: (ctx) => {
               setIsLoading(false);
               toast.error(ctx.error.message);
            },
         }
      );
   }

   useEffect(() => {
      if (isSuccess) {
         setTimeout(() => {
            redirect("/admin");
         }, 500);
      }
   }, [isSuccess]);

   return (
      <Form {...form}>
         <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-2 text-center">
               <h1 className="text-2xl font-bold">Registrace</h1>
               <p className="text-muted-foreground text-sm text-balance">Zadejte prosím svůj email a heslo</p>
            </div>
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Celé jméno</FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Heslo</FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {isSuccess ? (
               <Button type="button" className="w-full border-green-600 bg-green-600 text-white" disabled={isLoading}>
                  <Check className="h-4 w-4" /> Úspěšně zaregistrován
               </Button>
            ) : (
               <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Registruji
                     </>
                  ) : (
                     "Registrovat se"
                  )}
               </Button>
            )}
         </form>
         <div className="flex flex-col gap-4 mt-4">
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
               <span className="bg-background text-muted-foreground relative z-10 px-2">Máte jit účet?</span>
            </div>
            <Button variant="outline" className="w-full" onClick={() => redirect("/login")}>
               Přihlásit se
            </Button>
         </div>
      </Form>
   );
}
