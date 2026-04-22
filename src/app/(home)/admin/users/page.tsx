import PagePagination from "@/components/admin/shared/page-pagination";
import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePortalRole } from "@/lib/authorization";
import { listGuestUser } from "@/server/repositories/guest-user/list";
import UserFilterDialog from "@/app/(home)/admin/users/filter";
import UsersExportButton from "@/app/(home)/admin/users/export";

interface PageProps {
   searchParams: Promise<{
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      email?: string;
      marketing?: string;
      createdFrom?: string;
      createdTo?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requirePortalRole();

   const resolvedSearchParams = await searchParams;
   const { page = "1", pageSize = "25", items, search = "", email = "", marketing = "all", createdFrom, createdTo } =
      resolvedSearchParams;
   const effectivePageSize = pageSize || items || "25";
   const parsedCreatedFrom = createdFrom ? new Date(createdFrom) : undefined;
   const parsedCreatedTo = createdTo ? new Date(createdTo) : undefined;

   const { data: guestUsers, serverError } = await listGuestUser({
      itemsPerPage: parseInt(effectivePageSize),
      page: parseInt(page),
      search: search,
      email,
      marketing,
      createdFrom: parsedCreatedFrom && !Number.isNaN(parsedCreatedFrom.getTime()) ? parsedCreatedFrom : undefined,
      createdTo: parsedCreatedTo && !Number.isNaN(parsedCreatedTo.getTime()) ? parsedCreatedTo : undefined,
   });

   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = guestUsers?.totalPages || 0;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Uživatelé</h1>
         <div>
            <div className="flex gap-4">
               <Filter />
               <UserFilterDialog />
               <UsersExportButton searchParams={resolvedSearchParams} />
            </div>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[150px]">Marketing</TableHead>
                  <TableHead className="w-[200px]">Vytvořen</TableHead>
                  <TableHead className="w-[200px]">Upraven</TableHead>
                  <TableHead className="w-[100px]">Zařízení</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {guestUsers?.data?.map((guestUser) => (
                  <TableRow key={guestUser.id}>
                     <TableCell>{guestUser.id}</TableCell>
                     <TableCell>{guestUser.email}</TableCell>
                     <TableCell>
                        <Checkbox defaultChecked={guestUser.marketingApproved} disabled />
                     </TableCell>
                     <TableCell>{guestUser.createdAt.toLocaleString("cs-CZ")}</TableCell>
                     <TableCell>{guestUser.updatedAt.toLocaleString("cs-CZ")}</TableCell>
                     <TableCell>
                        <Badge>{guestUser.devices.length}</Badge>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <PagePagination totalPages={totalPages} />
      </div>
   );
}
