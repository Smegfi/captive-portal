import { BrowserIcons } from "@/components/admin/devices/browser-icons";
import Filter from "@/components/admin/devices/filter";
import { OsIcon } from "@/components/admin/devices/os-icon";
import PagePagination from "@/components/admin/shared/page-pagination";
import SortableHeader from "@/components/admin/shared/sortable-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminRole } from "@/lib/authorization";
import { listDevice } from "@/server/repositories/device/list";
import { deviceSortColumns, sortOrders } from "@/server/repositories/device/schema";
import FilerDialog from "@/app/(home)/admin/devices/filter";
import DevicesExportButton from "@/app/(home)/admin/devices/export";

interface PageProps {
   searchParams: Promise<{
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      mac?: string;
      user?: string;
      device?: string;
      connectedFrom?: string;
      connectedTo?: string;
      sortBy?: string;
      sortOrder?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {
   await requireAdminRole();

   const resolvedSearchParams = await searchParams;
   const { page = "1", pageSize = "25", items, search = "", mac = "", user = "", device = "all", connectedFrom, connectedTo, sortBy, sortOrder } =
      resolvedSearchParams;
   const effectivePageSize = pageSize || items || "25";
   const parsedConnectedFrom = connectedFrom ? new Date(connectedFrom) : undefined;
   const parsedConnectedTo = connectedTo ? new Date(connectedTo) : undefined;
   const parsedSortBy = deviceSortColumns.find((column) => column === sortBy);
   const parsedSortOrder = sortOrders.find((order) => order === sortOrder);

   const { data: devices, serverError } = await listDevice({
      itemsPerPage: parseInt(effectivePageSize),
      page: parseInt(page),
      search: search,
      mac,
      user,
      device,
      connectedFrom: parsedConnectedFrom && !Number.isNaN(parsedConnectedFrom.getTime()) ? parsedConnectedFrom : undefined,
      connectedTo: parsedConnectedTo && !Number.isNaN(parsedConnectedTo.getTime()) ? parsedConnectedTo : undefined,
      sortBy: parsedSortBy,
      sortOrder: parsedSortOrder,
   });

   if (serverError) {
      return <div>Error: {serverError.message}</div>;
   }

   const totalPages = devices?.totalPages || 0;

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Zařízení</h1>
         <div>
            <div className="flex gap-4">
               <Filter />

               <FilerDialog />

               <DevicesExportButton searchParams={resolvedSearchParams} />
            </div>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <SortableHeader column="id" label="ID" className="w-[100px]" />
                  <SortableHeader column="mac" label="MAC" />
                  <SortableHeader column="user" label="Uživatel" />
                  <TableHead>Zařízení</TableHead>
                  <TableHead>Detail</TableHead>
                  <SortableHeader column="firstSeenAt" label="Naposled přihlášeno" className="w-[250px]" />
               </TableRow>
            </TableHeader>
            <TableBody>
               {devices?.data?.map((device) => (
                  <TableRow key={device.id}>
                     <TableCell>{device.id}</TableCell>
                     <TableCell>{device.macAddress}</TableCell>
                     <TableCell>{device.guestUser?.email}</TableCell>
                     <TableCell>
                        <div className="flex gap-2">
                           <OsIcon os={device.device.os.name || ""} />
                           <BrowserIcons browser={device.device.browser.name || ""} />
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
         <PagePagination totalPages={totalPages} />
      </div>
   );
}
