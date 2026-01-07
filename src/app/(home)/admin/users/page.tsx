import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "@/lib/constants";
import { listGuestUserAction } from "@/server/actions/guest-actions";
import { FileDown } from "lucide-react";

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

   const { data: guestUsers, serverError } = await listGuestUserAction({ itemsPerPage, page: queryPage, search: querySearch });

   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = guestUsers?.totalPages || 0;
   const nextPage = queryPage + 1 > totalPages ? totalPages : queryPage + 1;
   const previousPage = queryPage - 1 < 1 ? 1 : queryPage - 1;

   function getPageUrl(page: number) {
      return `/admin/users?${querySearch ? `search=${querySearch}&` : ""}page=${page}`;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Uživatelé</h1>
         <div>
            <div className="flex gap-4">
               <Filter />

               <Button>
                  <FileDown />
                  <span>Exportovat</span>
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
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious href={getPageUrl(previousPage)} />
               </PaginationItem>
               {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                     <PaginationLink href={getPageUrl(index + 1)}>{index + 1}</PaginationLink>
                  </PaginationItem>
               ))}
               <PaginationItem>
                  <PaginationNext href={getPageUrl(nextPage)} />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
