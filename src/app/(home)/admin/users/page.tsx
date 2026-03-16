import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "@/lib/constants";
import { requirePortalRole } from "@/lib/authorization";
import { listGuestUserAction } from "@/server/actions/guest-actions";
import { FileDown } from "lucide-react";
import PagePagination from "@/app/(home)/admin/users/pagination";
import Link from "next/link";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requirePortalRole();

   const { items, page, search } = await searchParams;
   const itemsPerPage = parseInt(items || DEFAULT_ITEMS_PER_PAGE.toString());
   const queryPage = parseInt(page || DEFAULT_PAGE.toString());
   const querySearch = search || "";
   const exportParams = new URLSearchParams();

   if (querySearch) {
      exportParams.set("search", querySearch);
   }

   const exportUrl = exportParams.toString() ? `/api/admin/users/export?${exportParams.toString()}` : "/api/admin/users/export";

   const { data: guestUsers, serverError } = await listGuestUserAction({ itemsPerPage, page: queryPage, search: querySearch });

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

               <Button asChild>
                  <Link href={exportUrl} target="_blank" rel="noopener noreferrer">
                     <FileDown />
                     <span>Exportovat</span>
                  </Link>
               </Button>
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
