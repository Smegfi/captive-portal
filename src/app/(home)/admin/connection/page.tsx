import CurrentStatus from "@/components/admin/connection/current-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLatestConnectionsAction } from "@/server/actions/connection-actions";

export default async function Page() {
   const connections = await getLatestConnectionsAction();

   if (connections.serverError) {
      return <div>Error: {connections.serverError.message}</div>;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold flex items-center gap-4">Připojení</h1>
         <CurrentStatus />

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Zařízení</TableHead>
                  <TableHead>Síť</TableHead>
                  <TableHead>IP Adresa</TableHead>
                  <TableHead>Vytvořeno</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {connections.data?.map((connection) => (
                  <TableRow key={connection.id}>
                     <TableCell>{connection.id}</TableCell>
                     <TableCell>{connection.device?.macAddress}</TableCell>
                     <TableCell>{connection.network?.name}</TableCell>
                     <TableCell>{connection.clientIp}</TableCell>
                     <TableCell>{connection.device?.guestUser?.updatedAt.toLocaleString("cs-CZ")}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
