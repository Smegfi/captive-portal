import UsersExportButton from "@/app/(home)/admin/users/export";
import UserFilterDialog from "@/app/(home)/admin/users/filter";
import PagePagination from "@/components/admin/shared/page-pagination";
import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isAdminRole, requirePortalRole } from "@/lib/authorization";
import { listGuestUser } from "@/server/repositories/guest-user/list";
import { format } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import RemoveUser from "./remove";

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
   const session = await requirePortalRole();
   const isAdmin = isAdminRole(session.user.role);

   const resolvedSearchParams = await searchParams;
   const { page = "1", pageSize = "25", items, search = "", email = "", marketing = "all", createdFrom, createdTo } = resolvedSearchParams;
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
                  <TableHead className="w-[1%] text-center">ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[1%] text-center">Marketing</TableHead>
                  <TableHead className="w-[200px]">Vytvořen</TableHead>
                  <TableHead className="w-[200px]">Upraven</TableHead>
                  <TableHead className="w-[100px] text-center">Zařízení</TableHead>
                  {isAdmin ? <TableHead className="w-[1%]"></TableHead> : null}
               </TableRow>
            </TableHeader>
            <TableBody>
               {guestUsers?.data?.map((guestUser) => (
                  <TableRow key={guestUser.id}>
                     <TableCell>{guestUser.id}</TableCell>
                     <TableCell>{guestUser.email}</TableCell>
                     <TableCell className="text-center">
                        <Checkbox defaultChecked={guestUser.marketingApproved} disabled />
                     </TableCell>
                     <TableCell className="text-xs">{format(guestUser.createdAt, "dd.MM.yyyy HH:mm")}</TableCell>
                     <TableCell className="text-xs">{format(guestUser.updatedAt, "dd.MM.yyyy HH:mm")}</TableCell>
                     <TableCell className="text-center">
                        <Badge>{guestUser.devices.length}</Badge>
                     </TableCell>
                     {isAdmin ? (
                        <TableCell className="text-center">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon">
                                    <EllipsisVertical />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuGroup>
                                    <RemoveUser id={guestUser.id} />
                                 </DropdownMenuGroup>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                     ) : null}
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <PagePagination totalPages={totalPages} />
      </div>
   );
}
