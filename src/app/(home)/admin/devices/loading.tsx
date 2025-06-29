import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Zařízení</h1>
         <div>
            <div className="flex gap-4">
               <Skeleton className="w-full h-10 rounded-lg" />

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
                  <TableHead>Název</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Vytvořen</TableHead>
                  <TableHead>Upraven</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                     <TableCell>
                        <Skeleton className="w-full h-8" />
                     </TableCell>
                     <TableCell>
                        <Skeleton className="w-full h-8" />
                     </TableCell>
                     <TableCell>
                        <Skeleton className="w-full h-8" />
                     </TableCell>
                     <TableCell>
                        <Skeleton className="w-full h-8" />
                     </TableCell>
                     <TableCell>
                        <Skeleton className="w-full h-8" />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
