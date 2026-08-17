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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TosEditor from "@/app/(home)/admin/tos/tos-editor";
import { cloneTos } from "@/server/repositories/tos/clone";
import { deleteTos } from "@/server/repositories/tos/delete";
import { renameTos } from "@/server/repositories/tos/rename";
import { Copy, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

interface TosRowActionsProps {
   tosId: number;
   name: string;
   isImmutable: boolean;
   htmlContent: string | null;
}

export default function TosRowActions({ tosId, name, isImmutable, htmlContent }: TosRowActionsProps) {
   const [isRenameOpen, setIsRenameOpen] = useState(false);
   const [renameValue, setRenameValue] = useState(name);

   const cloneAction = useAction(cloneTos, {
      onSuccess: () => toast.success("Kopie dokumentu byla vytvořena"),
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? "Kopii se nepodařilo vytvořit"),
   });

   const renameAction = useAction(renameTos, {
      onSuccess: () => {
         toast.success("Dokument byl přejmenován");
         setIsRenameOpen(false);
      },
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? "Dokument se nepodařilo přejmenovat"),
   });

   const deleteAction = useAction(deleteTos, {
      onSuccess: () => toast.success("Dokument byl odstraněn"),
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? "Dokument se nepodařilo odstranit"),
   });

   return (
      <>
         <Button variant="outline" size="icon" title="Vytvořit kopii" disabled={cloneAction.isExecuting} onClick={() => cloneAction.execute({ id: tosId })}>
            {cloneAction.isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
         </Button>

         {!isImmutable && <TosEditor tosId={tosId} htmlContent={htmlContent} />}

         {!isImmutable && (
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
               <DialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Přejmenovat" onClick={() => setRenameValue(name)}>
                     <Pencil className="h-4 w-4" />
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Přejmenovat dokument</DialogTitle>
                  </DialogHeader>
                  <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder="Název dokumentu" />
                  <DialogFooter className="flex gap-2">
                     <DialogClose asChild>
                        <Button variant="outline" disabled={renameAction.isExecuting}>
                           Zrušit
                        </Button>
                     </DialogClose>
                     <Button disabled={renameAction.isExecuting || !renameValue.trim()} onClick={() => renameAction.execute({ id: tosId, name: renameValue.trim() })}>
                        {renameAction.isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Uložit"}
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         )}

         {!isImmutable && (
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Odstranit" disabled={deleteAction.isExecuting}>
                     {deleteAction.isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Odstranit dokument?</AlertDialogTitle>
                     <AlertDialogDescription>Dokument i jeho soubor budou trvale odstraněny. Tuto akci nelze vrátit zpět.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Zrušit</AlertDialogCancel>
                     <AlertDialogAction variant="destructive" onClick={() => deleteAction.execute({ id: tosId })}>
                        Odstranit
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         )}
      </>
   );
}
