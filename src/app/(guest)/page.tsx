import { AuthHeader } from "@/components/auth/auth-header";
import { GuestFormDynamic } from "@/app/(guest)/guest-form";
import { getActiveTosForGuest } from "@/server/repositories/tos/list";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Page() {
   const activeTos = await getActiveTosForGuest();

   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <AuthHeader />
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-lg">
                  <GuestFormDynamic tosHtmlContent={activeTos?.htmlContent} tosFileUrl={activeTos ? `/api/files/${activeTos.fileUUID}` : null} />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <Image src="/guest-bg.webp" alt="Image" className="absolute inset-0 h-full w-full object-cover" fill />
         </div>
      </div>
   );
}
