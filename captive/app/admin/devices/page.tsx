import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDevices } from "@/server/actions/devices";

export default async function Page() {
   const devices = await getDevices();
   return (
      <div className="p-4">
         <h3 className="text-2xl font-semibold tracking-tight">Zařízení</h3>

         <Table>
            <TableCaption>Seznam zařízení</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>MAC adresa</TableHead>
                  <TableHead>Vytvořeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {devices.map((device) => (
                  <TableRow key={device.id}>
                     <TableCell className="font-medium">{device.id}</TableCell>
                     <TableCell>{device.mac}</TableCell>
                     <TableCell>{device.createdAt}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
