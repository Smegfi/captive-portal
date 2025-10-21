import { AuthHeader } from "@/components/auth/auth-header";
import { GuestFormDynamic } from "@/components/guest-portal/guest-form";
import Image from "next/image";

export default function Page() {
   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <AuthHeader />
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-lg">
                  <GuestFormDynamic />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <Image src="/guest-bg.webp" alt="Image" className="absolute inset-0 h-full w-full object-cover" fill />
         </div>
      </div>
   );
}
