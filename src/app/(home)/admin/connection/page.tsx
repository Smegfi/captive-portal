import CurrentStatus from "@/components/admin/connection/current-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLatestConnectionsAction } from "@/server/actions/connection-actions";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "@/lib/constants";
import { requireAdminRole } from "@/lib/authorization";
import PagePagination from "@/app/(home)/admin/connection/pagination";
import Filtration from "@/app/(home)/admin/connection/filtration";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();

   const { items, page, search: searchQuery } = await searchParams;
   const itemsPerPage = parseInt(items || DEFAULT_ITEMS_PER_PAGE.toString());
   const pageNumber = parseInt(page || DEFAULT_PAGE.toString());
   const search = searchQuery || "";

   const { data: connections, serverError } = await getLatestConnectionsAction({ itemsPerPage, page: pageNumber, search: search });
   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = connections?.totalPages || 0;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold flex items-center gap-4">Připojení</h1>
         <CurrentStatus />

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
