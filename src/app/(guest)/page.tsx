import { AuthHeader } from "@/components/auth/auth-header";
import { GuestForm } from "@/components/guest-portal/guest-form";
import Image from "next/image";

export default async function Page() {
   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex-col gap-4 p-6 md:p-10 hidden lg:flex">
            <AuthHeader />
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-lg">
                  <GuestForm />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <Image src="/guest-bg.webp" alt="Image" className="absolute inset-0 h-full w-full object-cover brightness-75 grayscale" fill />
         </div>

         <div className="bg-muted relative block lg:hidden">
            <Image src="/guest-bg.webp" alt="Image" className="absolute inset-0 h-full w-full object-cover brightness-40" fill />
         </div>
         <div className="flex-col gap-4 p-6 md:p-10 flex lg:hidden absolute inset-0">
            <AuthHeader />
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-lg">
                  <GuestForm />
               </div>
            </div>
         </div>
      </div>
   );
}
