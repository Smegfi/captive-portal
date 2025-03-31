"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm as LoginFormSchema, LoginFormType } from "@/server/schemas";
import { FormField, FormMessage, Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import AzureButton from "@/components/auth/azure-button";
import { loginUser } from "@/server/actions/auth";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
   const form = useForm<LoginFormType>({
      resolver: zodResolver(LoginFormSchema),
      defaultValues: {
         username: "",
         password: "",
      },
   });

   async function onSubmit(data: LoginFormType) {
      await loginUser({username: data.username, password: data.password});
   };

   return (
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-4">
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input {...field} type="email" placeholder="example@praha10.cz" />
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
                           <Input {...field} type="password"/>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="w-full" size="lg">
                  Přihlásit se
               </Button>
            </form>
         </Form>

         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Nebo
          </span>
        </div>

         <AzureButton />
      </>
   );
}
