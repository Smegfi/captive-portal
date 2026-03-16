import { TosTable } from "@/components/pages/tos/table";
import { requireAdminRole } from "@/lib/authorization";
import UploadTos from "@/components/pages/tos/upload-tos";

export default async function Page() {
   await requireAdminRole();

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">TOS Dokumenty</h1>
         <div>
            <div className="flex gap-4 justify-end">
               <UploadTos />
            </div>
         </div>

         <TosTable />
      </div>
   );
}
