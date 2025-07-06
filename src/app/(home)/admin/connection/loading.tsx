import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Připojení</h1>
         <div>
            <div className="flex gap-4">
               <Skeleton className="w-full h-10 rounded-lg" />

               <Button>
                  <FileDown />
                  <span>Exportovat</span>
               </Button>
            </div>
         </div>

         {/* TODO: Add table */}
      </div>
   );
}
