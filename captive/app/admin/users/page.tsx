import { getUsers } from "@/server/actions/users";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
   const users = await getUsers();
   return (
      <div className="p-4">
         <h3 className="text-2xl font-semibold tracking-tight">Uživatelé</h3>

         <Table>
            <TableCaption>Seznam uživatelů</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Marketing</TableHead>
                  <TableHead>Vytvořeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {users.map((user) => (
                  <TableRow key={user.id}>
                     <TableCell className="font-medium">{user.id}</TableCell>
                     <TableCell>{user.email}</TableCell>
                     <TableCell>{user.marketingApproved ? "Ano" : "Ne"}</TableCell>
                     <TableCell>{user.createdAt}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
