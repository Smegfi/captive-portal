"use server";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listTosAction } from "@/server/actions/tos-actions";
import { Download, FileText } from "lucide-react";

export async function TosTable() {
   const result = await listTosAction({ itemsPerPage: 10, page: 1, search: "" });

   function formatToMegabytes(bytes: number) {
      return (bytes / 1024 / 1024).toFixed(2);
   }

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead className="w-[100px]">ID</TableHead>
               <TableHead>Název</TableHead>
               <TableHead>Soubor</TableHead>
               <TableHead className="w-[150px]">Velikost</TableHead>
               <TableHead className="w-[200px]">Nahráno</TableHead>
               <TableHead className="w-[200px]">Akce</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {result.data?.map((tos) => (
               <TableRow key={tos.id}>
                  <TableCell>{tos.id}</TableCell>
                  <TableCell className="font-medium">{tos.name}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{tos.fileName}</span>
                     </div>
                  </TableCell>
                  <TableCell>{formatToMegabytes(tos.fileSize)} MB</TableCell>
                  <TableCell>{tos.uploadedAt.toLocaleDateString("cs-CZ")}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                           <Download className="h-4 w-4" />
                        </Button>
                     </div>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
