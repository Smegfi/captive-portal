import UsersExportButton from "@/app/(home)/admin/users/export";
import UserFilterDialog from "@/app/(home)/admin/users/filter";
import PagePagination from "@/components/admin/shared/page-pagination";
import SortableHeader from "@/components/admin/shared/sortable-header";
import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isAdminRole, requirePortalRole } from "@/lib/authorization";
import { listGuestUser } from "@/server/repositories/guest-user/list";
import { guestUserSortColumns, sortOrders } from "@/server/repositories/guest-user/schema";
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
      sortBy?: string;
      sortOrder?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   const session = await requirePortalRole();
   const isAdmin = isAdminRole(session.user.role);

   const resolvedSearchParams = await searchParams;
   const { page = "1", pageSize = "25", items, search = "", email = "", marketing = "all", createdFrom, createdTo, sortBy, sortOrder } =
      resolvedSearchParams;
   const effectivePageSize = pageSize || items || "25";
   const parsedCreatedFrom = createdFrom ? new Date(createdFrom) : undefined;
   const parsedCreatedTo = createdTo ? new Date(createdTo) : undefined;
   const parsedSortBy = guestUserSortColumns.find((column) => column === sortBy);
   const parsedSortOrder = sortOrders.find((order) => order === sortOrder);

   const { data: guestUsers, serverError } = await listGuestUser({
      itemsPerPage: parseInt(effectivePageSize),
      page: parseInt(page),
      search: search,
      email,
      marketing,
      createdFrom: parsedCreatedFrom && !Number.isNaN(parsedCreatedFrom.getTime()) ? parsedCreatedFrom : undefined,
      createdTo: parsedCreatedTo && !Number.isNaN(parsedCreatedTo.getTime()) ? parsedCreatedTo : undefined,
      sortBy: parsedSortBy,
      sortOrder: parsedSortOrder,
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
                  <SortableHeader column="id" label="ID" className="w-[1%] text-center" />
                  <SortableHeader column="email" label="Email" />
                  <SortableHeader column="marketing" label="Marketing" className="w-[1%] text-center" />
                  <SortableHeader column="createdAt" label="Vytvořen" className="w-[200px]" />
                  <SortableHeader column="updatedAt" label="Upraven" className="w-[200px]" />
                  <TableHead className="w-[200px]">Akceptovaný TOS</TableHead>
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
                     <TableCell className="text-xs">{guestUser.acceptedTos ? `#${guestUser.acceptedTos.id} - ${guestUser.acceptedTos.name}` : "-"}</TableCell>
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
