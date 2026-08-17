import CreateNetwork from "@/app/(home)/admin/networks/create-network";
import RemoveNetwork from "@/app/(home)/admin/networks/remove-network";
import UpdateNetwork from "@/app/(home)/admin/networks/update-network";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminRole } from "@/lib/authorization";
import { listNetwork } from "@/server/repositories/network/list";
import { Wifi, WifiOff } from "lucide-react";

export default async function Page() {
   await requireAdminRole();

   const networks = await listNetwork();

   if (networks.serverError) {
      return <div>Error: {networks.serverError.message}</div>;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Sítě</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {networks.data?.map((network) => (
               <Card key={network.id}>
                  <CardHeader>
                     <CardTitle>{network.name}</CardTitle>
                     <CardDescription>{network.ssid}</CardDescription>
                     <CardAction>{network.isActive ? <Wifi className="text-green-500 animate-pulse" /> : <WifiOff className="text-red-500" />}</CardAction>
                  </CardHeader>
                  <CardFooter className="flex gap-2 items-center justify-end">
                     <UpdateNetwork id={network.id} />
                     <RemoveNetwork id={network.id} />
                  </CardFooter>
               </Card>
            ))}

            <CreateNetwork />
         </div>
      </div>
   );
}
