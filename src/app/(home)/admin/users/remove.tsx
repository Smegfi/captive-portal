"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { removeGuestUser } from "@/server/repositories/guest-user/remove";
import { Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

interface RemoveUserProps {
   id: number;
}

export default function RemoveUser({ id }: RemoveUserProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const { execute, isExecuting } = useAction(removeGuestUser, {
      onExecute: () => {
         setError(null);
      },
      onSuccess: () => {
         setIsOpen(false);
      },
      onError: (actionError) => {
         setError(actionError.error.serverError?.message ?? "Nastala chyba při mazání uživatele");
      },
   });

   function handleDelete() {
      execute({ id });
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <DropdownMenuItem
               variant="destructive"
               onSelect={(event) => {
                  event.preventDefault();
                  setIsOpen(true);
               }}
            >
               <Trash2 />
               <span>Smazat</span>
            </DropdownMenuItem>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Opravdu chcete smazat tohoto uživatele?</DialogTitle>
               <DialogDescription>Tato akce je nevratná. Uživatel bude trvale smazán a data budou odstraněna z našich serverů.</DialogDescription>
            </DialogHeader>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline" disabled={isExecuting}>
                     Zrušit
                  </Button>
               </DialogClose>
               <Button variant="destructive" onClick={handleDelete} disabled={isExecuting}>
                  {isExecuting ? (
                     <>
                        <Loader2 className="animate-spin" />
                        Mažu...
                     </>
                  ) : (
                     "Smazat"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
