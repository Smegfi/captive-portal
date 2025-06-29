import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Filter from "@/components/admin/devices/filter";
import { listDeviceAction } from "@/server/actions/device-actions";

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

   const devices = await listDeviceAction({ itemsPerPage, page: queryPage, search: querySearch });

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Zařízení</h1>
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
                  <TableHead>MAC</TableHead>
                  <TableHead>Uživatel</TableHead>
                  <TableHead className="w-[250px]">Naposled přihlášeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {devices.data?.map((device) => (
                  <TableRow key={device.id}>
                     <TableCell>{device.id}</TableCell>
                     <TableCell>{device.macAddress}</TableCell>
                     <TableCell>{device.guestUser?.email}</TableCell>
                     <TableCell>{device.firstSeenAt?.toLocaleString("cs-CZ")}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
