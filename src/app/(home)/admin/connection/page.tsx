import CurrentStatus from "@/components/admin/connection/current-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLatestConnectionsAction } from "@/server/actions/connection-actions";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "@/lib/constants";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   const { items, page, search } = await searchParams;
   const itemsPerPage = parseInt(items || DEFAULT_ITEMS_PER_PAGE.toString());
   const queryPage = parseInt(page || DEFAULT_PAGE.toString());
   const querySearch = search || "";

   const { data: connections, serverError } = await getLatestConnectionsAction({ itemsPerPage, page: queryPage, search: querySearch });
   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = connections?.totalPages || 0;
   const nextPage = queryPage + 1 > totalPages ? totalPages : queryPage + 1;
   const previousPage = queryPage - 1 < 1 ? 1 : queryPage - 1;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold flex items-center gap-4">Připojení</h1>
         <CurrentStatus />

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
                  <TableRow key={connection.id}>
                     <TableCell>{connection.id}</TableCell>
                     <TableCell>{connection.device?.macAddress}</TableCell>
                     <TableCell>{connection.network?.name}</TableCell>
                     <TableCell>{connection.device?.guestUser?.updatedAt.toLocaleString("cs-CZ")}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious href={`/admin/connection?page=${previousPage}`} />
               </PaginationItem>
               {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                     <PaginationLink href={`/admin/connection?page=${index + 1}`}>{index + 1}</PaginationLink>
                  </PaginationItem>
               ))}
               <PaginationItem>
                  <PaginationNext href={`/admin/connection?page=${nextPage}`} />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
