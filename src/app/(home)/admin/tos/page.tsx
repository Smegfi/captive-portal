import { TosTable } from "@/components/pages/tos/table";
import UploadTos from "@/components/pages/tos/upload-tos";
import { requireAdminRole } from "@/lib/authorization";
import { listTosAction } from "@/server/actions/tos-actions";

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

   const result = await listTosAction({ itemsPerPage: parseInt(items), page: parseInt(page), search: search });

   if (result.serverError) {
      return <div>Error: {result.serverError.message}</div>;
   }

   const totalPages = result.data?.totalPages || 0;

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
