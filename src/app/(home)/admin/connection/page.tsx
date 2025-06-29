import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Filter from "@/components/admin/connection/filter";

export default function Page() {
   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Připojení</h1>
         <div>
            <div className="flex gap-4">
               <Filter />

               <Button>
                  <FileDown />
                  <span>Exportovat</span>
               </Button>
            </div>
         </div>
         todo...
      </div>
   );
}
