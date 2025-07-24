"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, LoginSchemaType } from "@/server/actions-scheme/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { VscAzure } from "react-icons/vsc";
import { toast } from "sonner";

export function LoginForm() {
   const [isLoading, setIsLoading] = useState(false);

   const params = useSearchParams();
   const redirectTo = params.get("redirectTo");

   const form = useForm<LoginSchemaType>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   async function onSubmit(data: LoginSchemaType) {
      await authClient.signIn.email(
         {
            email: data.email,
            password: data.password,
         },
         {
            onRequest: () => {
               setIsLoading(true);
            },
            onSuccess: () => {
               setIsLoading(false);
               redirect(redirectTo || "/admin");
            },
            onError: (ctx) => {
               setIsLoading(false);
               toast.error(ctx.error.message);
            },
         }
      );
   }

   return (
      <>
         <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Přihlásit se</h1>
                  <p className="text-muted-foreground text-sm text-balance">Zadejte prosím svůj email a heslo</p>
               </div>
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
                           <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Přihlašuji
                     </>
                  ) : (
                     "Přihlásit se"
                  )}
               </Button>
            </form>
         </Form>

         <Button variant="outline" className="w-full mt-3">
            <VscAzure className="size-4 mr-2" />
            Přihlásit se s Azure
         </Button>

         <div className="flex flex-col gap-4 mt-4">
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
               <span className="bg-background text-muted-foreground relative z-10 px-2">Nemáte účet?</span>
            </div>

            <Button variant="outline" className="w-full" asChild>
               <Link href="/register">Registrovat se</Link>
            </Button>
         </div>
      </>
   );
}
