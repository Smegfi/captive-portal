import Filter from "@/components/admin/users/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
   const itemsPerPage = parseInt(items || "20");
   const queryPage = parseInt(page || "1");
   const querySearch = search || "";

   const guestUsers = await listGuestUserAction({ itemsPerPage, page: queryPage, search: querySearch });

   if (guestUsers.serverError) {
      return <div>Error: {guestUsers.serverError.message}</div>;
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
               {guestUsers.data?.map((guestUser) => (
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
      </div>
   );
}
