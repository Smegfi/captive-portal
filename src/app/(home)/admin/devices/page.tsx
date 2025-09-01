import { BrowserIcons } from "@/components/admin/devices/browser-icons";
import Filter from "@/components/admin/devices/filter";
import { OsIcon } from "@/components/admin/devices/os-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listDeviceAction } from "@/server/actions/device-actions";
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
   const itemsPerPage = parseInt(items || "10");
   const queryPage = parseInt(page || "1");
   const querySearch = search || "";

   const devices = await listDeviceAction({ itemsPerPage, page: queryPage, search: querySearch });

   if (devices.serverError) {
      return <div>Error: {devices.serverError.message}</div>;
   }

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
                  <TableHead>Zařízení</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="w-[250px]">Naposled přihlášeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {devices.data?.map((device) => (
                  <TableRow key={device.id}>
                     <TableCell>{device.id}</TableCell>
                     <TableCell>{device.macAddress}</TableCell>
                     <TableCell>{device.guestUser?.email}</TableCell>
                     <TableCell>
                        <div className="flex gap-2">
                           <OsIcon os={device.device!.os!.name ?? ""} />
                           <BrowserIcons browser={device.device!.browser!.name ?? ""} />
                        </div>
                     </TableCell>
                     <TableCell>
                        <Dialog>
                           <DialogTrigger>Zobrazit detaily</DialogTrigger>
                           <DialogContent>
                              <DialogHeader>
                                 <DialogTitle>Detaily zařízení</DialogTitle>
                              </DialogHeader>
                              <pre className="text-xs overflow-x-auto">{JSON.stringify(device.device, null, 2)}</pre>
                           </DialogContent>
                        </Dialog>
                     </TableCell>
                     <TableCell>{device.firstSeenAt?.toLocaleString("cs-CZ")}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
