import { TosTable } from "@/components/pages/tos/table";
import UploadTos from "@/components/pages/tos/upload-tos";
export default function Page() {
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
