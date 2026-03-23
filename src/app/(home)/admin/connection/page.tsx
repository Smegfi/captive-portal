import Filtration from "@/app/(home)/admin/connection/filtration";
import PagePagination from "@/components/admin/shared/page-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminRole } from "@/lib/authorization";
import { getLatestConnectionsAction } from "@/server/actions/connection-actions";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();

   const { page = "1", items = "25", search = "" } = await searchParams;

   const { data: connections, serverError } = await getLatestConnectionsAction({
      itemsPerPage: parseInt(items),
      page: parseInt(page),
      search: search,
   });

   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = connections?.totalPages || 0;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold flex items-center gap-4">Připojení</h1>
         <Filtration />

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Zařízení</TableHead>
                  <TableHead>Síť</TableHead>
                  <TableHead>Vytvořeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {connections?.data?.map((connection) => (
                  <TableRow key={connection.connection.id}>
                     <TableCell>{connection.connection.id}</TableCell>
                     <TableCell>{connection.device?.macAddress}</TableCell>
                     <TableCell>{connection.network?.name}</TableCell>
                     <TableCell>{connection.guest_user?.updatedAt.toLocaleString("cs-CZ")}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <PagePagination totalPages={totalPages} />
      </div>
   );
}
