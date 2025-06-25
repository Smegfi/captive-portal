"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VscAzure } from "react-icons/vsc";
import { authClient } from "@/lib/auth-client";
import { redirect, useSearchParams } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
   const params = useSearchParams();
   const redirectTo = params.get("redirectTo");

   async function handleLogin() {
      await authClient.signIn.email({
         email: "tomas.jedno@praha10.cz",
         password: "123456Ab",
      });
      redirect(redirectTo || "/admin/dashboard");
   }

   return (
      <>
         <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
               <h1 className="text-2xl font-bold">Přihlášení</h1>
               <p className="text-muted-foreground text-sm text-balance">Zadejte prosím svůj email a heslo</p>
            </div>
            <div className="grid gap-6">
               <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
               </div>
               <div className="grid gap-3">
                  <div className="flex items-center">
                     <Label htmlFor="password">Heslo</Label>
                     <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground">
                        Zapomněli jste heslo?
                     </a>
                  </div>
                  <Input id="password" type="password" required />
               </div>
               <Button type="button" className="w-full" onClick={handleLogin}>
                  Přihlásit se
               </Button>
            </div>
         </form>

         <div className="flex flex-col gap-4 mt-4">
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
               <span className="bg-background text-muted-foreground relative z-10 px-2">Nebo se přihlásit s</span>
            </div>

            <Button variant="outline" className="w-full">
               <VscAzure className="size-4 mr-2" />
               Přihlásit se s Azure
            </Button>

            <Button variant="outline" className="w-full" type="button" onClick={() => redirect("/register")}>
               Registrovat
            </Button>
         </div>
      </>
   );
}
