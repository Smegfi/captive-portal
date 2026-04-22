import Filtration from "@/app/(home)/admin/connection/filtration";
import ConnectionFilterDialog from "@/app/(home)/admin/connection/filter";
import ConnectionExportButton from "@/app/(home)/admin/connection/export";
import PagePagination from "@/components/admin/shared/page-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminRole } from "@/lib/authorization";
import { listConnection } from "@/server/repositories/connection/list";

interface PageProps {
   searchParams: Promise<{
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      mac?: string;
      network?: string;
      user?: string;
      updatedFrom?: string;
      updatedTo?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();

   const resolvedSearchParams = await searchParams;
   const { page = "1", pageSize = "25", items, search = "", mac = "", network = "", user = "", updatedFrom, updatedTo } =
      resolvedSearchParams;
   const effectivePageSize = pageSize || items || "25";
   const parsedUpdatedFrom = updatedFrom ? new Date(updatedFrom) : undefined;
   const parsedUpdatedTo = updatedTo ? new Date(updatedTo) : undefined;

   const { data: connections, serverError } = await listConnection({
      itemsPerPage: parseInt(effectivePageSize),
      page: parseInt(page),
      search: search,
      mac,
      network,
      user,
      updatedFrom: parsedUpdatedFrom && !Number.isNaN(parsedUpdatedFrom.getTime()) ? parsedUpdatedFrom : undefined,
      updatedTo: parsedUpdatedTo && !Number.isNaN(parsedUpdatedTo.getTime()) ? parsedUpdatedTo : undefined,
   });

   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = connections?.totalPages || 0;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold flex items-center gap-4">Připojení</h1>
         <div className="flex gap-4">
            <Filtration />
            <ConnectionFilterDialog />
            <ConnectionExportButton searchParams={resolvedSearchParams} />
         </div>

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
