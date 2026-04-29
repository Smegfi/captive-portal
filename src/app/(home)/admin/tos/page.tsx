import UploadTos from "@/app/(home)/admin/tos/upload-tos";
import SetActiveTosButton from "@/app/(home)/admin/tos/set-active-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminRole } from "@/lib/authorization";
import { listTos } from "@/server/repositories/tos/list";
import { FileText } from "lucide-react";
import { formatToMegabytes } from "@/lib/utils";
import { Download } from "lucide-react";
import PagePagination from "@/components/admin/shared/page-pagination";

interface PageProps {
   searchParams: Promise<{
      items?: string;
      page?: string;
      search?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();
   const { items = "25", page = "1", search = "" } = await searchParams;

   const { data: tos, serverError } = await listTos({ itemsPerPage: parseInt(items), page: parseInt(page), search });

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">TOS Dokumenty</h1>
         <div>
            <div className="flex gap-4 justify-end">
               <UploadTos />
            </div>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Název</TableHead>
                  <TableHead className="w-[140px]">Stav</TableHead>
                  <TableHead>Soubor</TableHead>
                  <TableHead className="w-[150px]">Velikost</TableHead>
                  <TableHead className="w-[200px]">Nahráno</TableHead>
                  <TableHead className="w-[200px]">Akce</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {tos?.data?.map((tos) => (
                  <TableRow key={tos.id}>
                     <TableCell>{tos.id}</TableCell>
                     <TableCell className="font-medium">{tos.name}</TableCell>
                     <TableCell>{tos.isActive ? <Badge>Aktivní</Badge> : <Badge variant="secondary">Neaktivní</Badge>}</TableCell>
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
                           <Button variant="outline" size="icon" asChild>
                              <a href={`${tos.fileUrl}`} download>
                                 <Download className="h-4 w-4" />
                              </a>
                           </Button>
                           <SetActiveTosButton tosId={tos.id} isActive={tos.isActive} />
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <PagePagination totalPages={tos?.totalPages || 0} />
      </div>
   );
}
