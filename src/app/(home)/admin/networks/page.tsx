import NewNetwork from "@/components/admin/networks/new-network";
import RemoveNetwork from "@/components/admin/networks/remove-network";
import UpdateNetwork from "@/components/admin/networks/update-network";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listNetworkAction } from "@/server/actions/network-actions";
import { Search, Wifi, WifiOff } from "lucide-react";

export default async function Page() {
   const networks = await listNetworkAction({ itemsPerPage: 10, page: 1, search: "" });

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Sítě</h1>
         <div>
            <div className="flex gap-4">
               <div className="flex-1 flex items-center">
                  <Input placeholder="Hledat síť" className="rounded-r-none" />
                  <Button className="rounded-l-none" variant="outline">
                     <Search />
                  </Button>
               </div>
               <NewNetwork />
            </div>
         </div>

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
         </div>
      </div>
   );
}
