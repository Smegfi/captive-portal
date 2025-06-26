import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NewNetwork from "@/components/admin/networks/new-network";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NetworksLoading() {
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
            <Card>
               <CardHeader>
                  <CardTitle>
                     <Skeleton className="h-5 w-2/3" />
                  </CardTitle>
                  <CardDescription>
                     <Skeleton className="h-4 w-1/2" />
                  </CardDescription>
                  <CardAction>
                     <Wifi />
                  </CardAction>
               </CardHeader>
               <CardFooter className="flex gap-2 items-center justify-end">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
               </CardFooter>
            </Card>
         </div>
      </div>
   );
}
