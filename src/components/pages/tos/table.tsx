"use server";

import { Button } from "@/components/ui/button";
import PagePagination from "@/components/admin/shared/page-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listTosAction } from "@/server/actions/tos-actions";
import { Download, FileText } from "lucide-react";

interface TosTableProps {
   itemsPerPage: number;
   page: number;
   search: string;
}

export async function TosTable({ itemsPerPage, page, search }: TosTableProps) {
   const result = await listTosAction({ itemsPerPage, page, search });

   if (result.serverError) {
      return <div>Error: {result.serverError.message}</div>;
   }

   const totalPages = result.data?.totalPages || 0;

   function formatToMegabytes(bytes: number) {
      return (bytes / 1024 / 1024).toFixed(2);
   }

   return (
      <div className="space-y-4">
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
               {result.data?.data?.map((tos) => (
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
                           <Button variant="outline" size="sm" asChild>
                              <a href={`${tos.fileUrl}`} download>
                                 <Download className="h-4 w-4" />
                              </a>
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <PagePagination totalPages={totalPages} />
      </div>
   );
}
