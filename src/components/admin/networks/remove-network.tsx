"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { removeNetworkSchema } from "@/server/actions-scheme/network/schema";
import { removeNetworkAction } from "@/server/actions/network-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface RemoveNetworkProps {
   id: number;
}

export default function RemoveNetwork({ id }: RemoveNetworkProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const { execute, isExecuting } = useAction(removeNetworkAction, {
      onExecute: () => {
         setError(null);
      },
      onSuccess: () => {
         form.reset();
         setIsOpen(false);
      },
      onError: (error) => {
         setError(error.error.validationErrors?._errors?.join(", ") ?? null);
      },
   });

   type FormValues = z.infer<typeof removeNetworkSchema>;

   const form = useForm<FormValues>({
      resolver: zodResolver(removeNetworkSchema),
      defaultValues: {
         id,
      },
   });

   function onSubmit(values: FormValues) {
      execute(values);
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button variant="destructive">Smazat</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Opravdu chcete smazat tuto síť?</DialogTitle>
               <DialogDescription>Tato akce je nevratná. Síť bude trvale smazána a data budou odstraněna z našich serverů.</DialogDescription>
            </DialogHeader>

            {error && <p className="text-red-500">{error}</p>}
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline">Zrušit</Button>
               </DialogClose>
               <Button variant="destructive" onClick={form.handleSubmit(onSubmit)} form="remove-network-form" disabled={isExecuting}>
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
