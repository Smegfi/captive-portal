"use client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { setActiveTos } from "@/server/repositories/tos/set-active";
import { Loader2, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface SetActiveTosButtonProps {
   tosId: number;
   isActive: boolean;
   isImmutable: boolean;
   nextVersionLabel: string;
}

export default function SetActiveTosButton({ tosId, isActive, isImmutable, nextVersionLabel }: SetActiveTosButtonProps) {
   const { execute, isExecuting } = useAction(setActiveTos, {
      onSuccess: () => toast.success("Dokument byl aktivován"),
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? error.error?.serverError?.message ?? "Dokument se nepodařilo aktivovat"),
   });

   // Aktivní dokument, nebo již dříve aktivovaný (a tedy neměnný) archivní dokument
   // nelze (znovu) aktivovat.
   if (isActive || isImmutable) {
      return (
         <Button variant="outline" size="icon" disabled title={isActive ? "Aktivní dokument" : "Archivovaný dokument nelze znovu aktivovat"}>
            <LockKeyhole className="h-4 w-4" />
         </Button>
      );
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={isExecuting} title="Nastavit jako aktivní">
               {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyholeOpen className="h-4 w-4" />}
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Aktivovat dokument?</AlertDialogTitle>
               <AlertDialogDescription>
                  Dokument se zobrazí hostům, přiřadí se mu verze <strong>{nextVersionLabel}</strong> a stane se trvale neměnným. Dosavadní aktivní dokument bude archivován. Tuto akci nelze vrátit
                  zpět.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Zrušit</AlertDialogCancel>
               <AlertDialogAction onClick={() => execute({ id: tosId })}>Aktivovat</AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
