"use client";

import { HtmlRichTextEditor } from "@/components/editor/html-rich-text-editor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toRichTextHtml } from "@/lib/html-content";
import { updateTosHtml } from "@/server/repositories/tos/update-html";
import { FilePenLine, Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface TosEditorProps {
   tosId: number;
   htmlContent: string | null;
}

interface TosEditorFormProps {
   tosId: number;
   htmlContent: string | null;
   onSaved: () => void;
}

function TosEditorForm({ tosId, htmlContent, onSaved }: TosEditorFormProps) {
   const htmlRef = useRef(toRichTextHtml(htmlContent ?? ""));

   const { execute, isExecuting } = useAction(updateTosHtml, {
      onSuccess: () => {
         toast.success("Obsah byl uložen");
         onSaved();
      },
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? "Obsah se nepodařilo uložit"),
   });

   function handleSave() {
      execute({ id: tosId, htmlContent: htmlRef.current });
   }

   return (
      <>
         <HtmlRichTextEditor
            defaultContent={htmlRef.current}
            onChange={(html) => {
               htmlRef.current = html;
            }}
            className="max-h-[70dvh]"
            contentClassName="min-h-64"
            aria-label="Obsah TOS dokumentu"
         />
         <DialogFooter className="flex gap-2">
            <DialogClose asChild>
               <Button variant="outline" disabled={isExecuting}>
                  Zrušit
               </Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={isExecuting}>
               {isExecuting ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin" /> Ukládám...
                  </>
               ) : (
                  <>
                     <Save className="h-4 w-4" /> Uložit
                  </>
               )}
            </Button>
         </DialogFooter>
      </>
   );
}

export default function TosEditor({ tosId, htmlContent }: TosEditorProps) {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="icon" title="Upravit obsah">
               <FilePenLine className="h-4 w-4" />
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-4xl sm:max-w-3xl">
            <DialogHeader>
               <DialogTitle>Upravit obsah dokumentu</DialogTitle>
               <DialogDescription>Upravte HTML obsah podmínek použití. Změny lze provádět pouze do první aktivace dokumentu.</DialogDescription>
            </DialogHeader>
            {isOpen && <TosEditorForm tosId={tosId} htmlContent={htmlContent} onSaved={() => setIsOpen(false)} />}
         </DialogContent>
      </Dialog>
   );
}
