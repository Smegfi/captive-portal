import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function ApplicationLoading() {
   return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80">
         <div className="animate-pulse">
            <Image src="/heraldicky-znak.png" alt="Načítání stránky" width={220} height={220} priority className="h-auto w-[220px]" />
         </div>
         <Loader2 className="size-8! animate-spin" />
      </div>
   );
}
