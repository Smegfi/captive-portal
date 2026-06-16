import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

interface PageProps {
   searchParams: Promise<{
      redirectTo?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   const { redirectTo } = await searchParams;

   if (session !== null) {
      const safeRedirect = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/admin";
      redirect(safeRedirect);
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
