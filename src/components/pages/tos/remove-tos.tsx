"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RemoveTosDocumentProps {
   id: number;
   name: string;
}

export default function RemoveTosDocument({ id, name }: RemoveTosDocumentProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Mock action - in real implementation, this would be a server action
   const mockAction = async (values: { id: number }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleting TOS document:", values);
      return { success: true };
   };

   const { execute, isExecuting } = useAction(mockAction as any, {
      onExecute: () => {
         setError(null);
      },
      onSuccess: () => {
         setIsOpen(false);
      },
      onError: (error) => {
         setError(error.error?.message ?? "Chyba při mazání dokumentu");
      },
   });

   const form = useForm({
      defaultValues: {
         id,
      },
   });

   function onSubmit() {
      execute({ id });
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
               <Trash2 className="h-4 w-4" />
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Opravdu chcete smazat tento dokument?</DialogTitle>
               <DialogDescription>Dokument "{name}" bude trvale smazán. Tato akce je nevratná.</DialogDescription>
            </DialogHeader>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline">Zrušit</Button>
               </DialogClose>
               <Button variant="destructive" onClick={onSubmit} disabled={isExecuting}>
                  {isExecuting ? (
                     <>
                        <Loader2 className="animate-spin" /> Mažu...
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
