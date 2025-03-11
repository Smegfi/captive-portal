import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDevices } from "@/server/mock";
export default async function Page() {
   const devices = mockDevices;
   return (
      <div className="p-4">
         <h3 className="text-2xl font-semibold tracking-tight">Zařízení</h3>

         <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">Název zařízení</TableHead>
                  <TableHead>MAC adresa</TableHead>
                  <TableHead>Název WiFi</TableHead>
                  <TableHead>Naposled připojeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {devices.map((device) => (
                  <TableRow key={device.id}>
                     <TableCell className="font-medium">{device.name}</TableCell>
                     <TableCell>{device.macAddress}</TableCell>
                     <TableCell>{device.connectedNetworkId}</TableCell>
                     <TableCell>{device.lastConnection}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
