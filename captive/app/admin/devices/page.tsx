import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
   const devices = [
      {
         id: 1,
         userId: 12,
         deviceName: "Samsung Galaxy A21",
         macAddress: "AA:BB:CC:DD:EE:FF",
         connectedNetwork: {
            id: "1",
            name: "Praha 10 - Free Wifi",
         },
         lastConnection: new Date().toString(),
      },
      {
         id: 2,
         userId: 12,
         deviceName: "Samsung Galaxy A51",
         macAddress: "AA:BB:CC:DD:EE:AA",
         connectedNetwork: {
            id: "1",
            name: "Praha 10 - Free Wifi",
         },
         lastConnection: new Date().toString(),
      },
   ];
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
                     <TableCell className="font-medium">{device.deviceName}</TableCell>
                     <TableCell>{device.macAddress}</TableCell>
                     <TableCell>{device.connectedNetwork.name}</TableCell>
                     <TableCell>{device.lastConnection}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
