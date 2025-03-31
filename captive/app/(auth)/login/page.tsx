import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
               <Link href="/" className="flex items-center gap-2 font-medium">
                  <Image
                     src="/logo-white.webp"
                     width={200}
                     height={70}
                     alt="Praha 10 - logo"
                     className="mx-auto hidden dark:block"
                  />
                  <Image
                     src="/logo-black.webp"
                     width={200}
                     height={70}
                     alt="Praha 10 - logo"
                     className="mx-auto block dark:hidden"
                  />
               </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <LoginForm />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <img
               src="/login-background.webp"
               alt="Praha 10 - alternativní logo"
               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] grayscale"
            />
         </div>
      </div>
   );
}
