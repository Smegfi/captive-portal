import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { listGuestUserAction } from "@/server/actions/guest-actions";
import Filter from "@/components/admin/users/filter";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   const { items, page, search } = await searchParams;
   const itemsPerPage = parseInt(items || "10");
   const queryPage = parseInt(page || "1");
   const querySearch = search || "";

   const guestUsers = await listGuestUserAction({ itemsPerPage, page: queryPage, search: querySearch });

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
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
