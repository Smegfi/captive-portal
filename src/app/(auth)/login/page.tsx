import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session !== null) {
      redirect("/admin");
   }

   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <AuthHeader />
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <LoginForm />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <Image src="/login-background.webp" alt="Image" className="absolute inset-0 h-full w-full object-cover" fill />
         </div>
      </div>
   );
}
