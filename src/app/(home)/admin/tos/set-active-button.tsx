"use client";

import { Button } from "@/components/ui/button";
import { setActiveTos } from "@/server/repositories/tos/set-active";
import { Loader2, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

interface SetActiveTosButtonProps {
   tosId: number;
   isActive: boolean;
}

export default function SetActiveTosButton({ tosId, isActive }: SetActiveTosButtonProps) {
   const { execute, isExecuting } = useAction(setActiveTos);

   function handleSetActive() {
      execute({ id: tosId });
   }

   return (
      <Button variant="outline" size="icon" onClick={handleSetActive} disabled={isExecuting || isActive} title={isActive ? "Aktivní dokument" : "Nastavit jako aktivní"}>
         {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? <LockKeyhole className="h-4 w-4" /> : <LockKeyholeOpen className="h-4 w-4" />}
      </Button>
   );
}
