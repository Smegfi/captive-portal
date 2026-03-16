import { TosTable } from "@/components/pages/tos/table";
import { requireAdminRole } from "@/lib/authorization";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE, parsePositiveInt } from "@/lib/constants";
import UploadTos from "@/components/pages/tos/upload-tos";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();
   const { items, page, search } = await searchParams;

   const itemsPerPage = parsePositiveInt(items, DEFAULT_ITEMS_PER_PAGE);
   const queryPage = parsePositiveInt(page, DEFAULT_PAGE);
   const querySearch = search || "";

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">TOS Dokumenty</h1>
         <div>
            <div className="flex gap-4 justify-end">
               <UploadTos />
            </div>
         </div>

         <TosTable itemsPerPage={itemsPerPage} page={queryPage} search={querySearch} />
      </div>
   );
}
