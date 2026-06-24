import UploadTos from "@/app/(home)/admin/tos/upload-tos";
import SetActiveTosButton from "@/app/(home)/admin/tos/set-active-button";
import TosRowActions from "@/app/(home)/admin/tos/tos-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminRole } from "@/lib/authorization";
import { listTos } from "@/server/repositories/tos/list";
import { getNextTosVersionNumber } from "@/server/repositories/tos/activate-helper";
import { FileText } from "lucide-react";
import { formatToMegabytes, formatTosVersion, isTosImmutable } from "@/lib/utils";
import { Download } from "lucide-react";
import PagePagination from "@/components/admin/shared/page-pagination";

function formatTosValidity(activeFrom: Date | null, activeTo: Date | null): string {
   if (!activeFrom) {
      return "—";
   }

   const from = new Date(activeFrom).toLocaleDateString("cs-CZ");
   const to = activeTo ? new Date(activeTo).toLocaleDateString("cs-CZ") : "nyní";
   return `${from} – ${to}`;
}

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

   const { data: tos } = await listTos({ itemsPerPage: parseInt(items), page: parseInt(page), search });
   const nextVersionNumber = await getNextTosVersionNumber();
   const nextVersionLabel = formatTosVersion(new Date(), nextVersionNumber) ?? `${nextVersionNumber}`;

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
                  <TableHead className="w-[140px]">Verze</TableHead>
                  <TableHead className="w-[220px]">Platnost</TableHead>
                  <TableHead>Soubor</TableHead>
                  <TableHead className="w-[120px]">Velikost</TableHead>
                  <TableHead className="w-[160px]">Nahráno</TableHead>
                  <TableHead className="w-[220px]">Akce</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {tos?.data?.map((tos) => (
                  <TableRow key={tos.id}>
                     <TableCell>{tos.id}</TableCell>
                     <TableCell className="font-medium">{tos.name}</TableCell>
                     <TableCell>{tos.isActive ? <Badge>Aktivní</Badge> : <Badge variant="secondary">Neaktivní</Badge>}</TableCell>
                     <TableCell>{formatTosVersion(tos.activeFrom, tos.versionNumber) ?? "—"}</TableCell>
                     <TableCell className="text-sm text-muted-foreground">{formatTosValidity(tos.activeFrom, tos.activeTo)}</TableCell>
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
                              <a href={`/api/files/${tos.fileUUID}`} download>
                                 <Download className="h-4 w-4" />
                              </a>
                           </Button>
                           <SetActiveTosButton tosId={tos.id} isActive={tos.isActive} isImmutable={isTosImmutable(tos)} nextVersionLabel={nextVersionLabel} />
                           <TosRowActions tosId={tos.id} name={tos.name} isImmutable={isTosImmutable(tos)} htmlContent={tos.htmlContent} />
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
