import UploadTos from "@/app/(home)/admin/tos/upload-tos";
import { TosTable } from "@/app/(home)/admin/tos/tos-table";
import { requireAdminRole } from "@/lib/authorization";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();
   const { items = "25", page = "1", search = "" } = await searchParams;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">TOS Dokumenty</h1>
         <div>
            <div className="flex gap-4 justify-end">
               <UploadTos />
            </div>
         </div>

         <TosTable itemsPerPage={parseInt(items)} page={parseInt(page)} search={search} />
      </div>
   );
}
