"use client";

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { updateTosHtml } from "@/server/repositories/tos/update-html";
import { defineBasicExtension } from "prosekit/basic";
import { createEditor, union, type Editor } from "prosekit/core";
import { defineTextAlign } from "prosekit/extensions/text-align";
import { ProseKit, useEditor, useEditorDerivedValue } from "prosekit/react";
import { AlignCenter, AlignLeft, AlignRight, Bold, FilePenLine, Italic, List, ListOrdered, Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function defineTosExtension() {
   return union(defineBasicExtension(), defineTextAlign({ types: ["paragraph", "heading"] }));
}

type TosExtension = ReturnType<typeof defineTosExtension>;

function getToolbarState(editor: Editor<TosExtension>) {
   const align = (editor.state.selection.$from.parent.attrs.textAlign as string | null) ?? "left";
   return {
      bold: { active: editor.marks.bold.isActive(), disabled: !editor.commands.toggleBold.canExec() },
      italic: { active: editor.marks.italic.isActive(), disabled: !editor.commands.toggleItalic.canExec() },
      bulletList: { active: editor.nodes.list.isActive({ kind: "bullet" }), disabled: !editor.commands.toggleList.canExec({ kind: "bullet" }) },
      orderedList: { active: editor.nodes.list.isActive({ kind: "ordered" }), disabled: !editor.commands.toggleList.canExec({ kind: "ordered" }) },
      align,
   };
}

interface ToolbarButtonProps {
   active?: boolean;
   disabled?: boolean;
   title: string;
   onClick: () => void;
   children: React.ReactNode;
}

function ToolbarButton({ active, disabled, title, onClick, children }: ToolbarButtonProps) {
   return (
      <Button
         type="button"
         variant={active ? "default" : "ghost"}
         size="icon"
         className="h-8 w-8"
         disabled={disabled}
         title={title}
         onMouseDown={(e) => e.preventDefault()}
         onClick={onClick}
      >
         {children}
      </Button>
   );
}

function Toolbar() {
   const editor = useEditor<TosExtension>();
   const state = useEditorDerivedValue(getToolbarState);

   return (
      <div className="flex flex-wrap items-center gap-1 border-b p-1">
         <ToolbarButton active={state.bold.active} disabled={state.bold.disabled} title="Tučné" onClick={() => editor.commands.toggleBold()}>
            <Bold className="h-4 w-4" />
         </ToolbarButton>
         <ToolbarButton active={state.italic.active} disabled={state.italic.disabled} title="Kurzíva" onClick={() => editor.commands.toggleItalic()}>
            <Italic className="h-4 w-4" />
         </ToolbarButton>

         <div className="bg-border mx-1 h-5 w-px" />

         <ToolbarButton active={state.align === "left"} title="Zarovnat vlevo" onClick={() => editor.commands.setTextAlign("left")}>
            <AlignLeft className="h-4 w-4" />
         </ToolbarButton>
         <ToolbarButton active={state.align === "center"} title="Zarovnat na střed" onClick={() => editor.commands.setTextAlign("center")}>
            <AlignCenter className="h-4 w-4" />
         </ToolbarButton>
         <ToolbarButton active={state.align === "right"} title="Zarovnat vpravo" onClick={() => editor.commands.setTextAlign("right")}>
            <AlignRight className="h-4 w-4" />
         </ToolbarButton>

         <div className="bg-border mx-1 h-5 w-px" />

         <ToolbarButton active={state.bulletList.active} disabled={state.bulletList.disabled} title="Odrážkový seznam" onClick={() => editor.commands.toggleList({ kind: "bullet" })}>
            <List className="h-4 w-4" />
         </ToolbarButton>
         <ToolbarButton active={state.orderedList.active} disabled={state.orderedList.disabled} title="Číslovaný seznam" onClick={() => editor.commands.toggleList({ kind: "ordered" })}>
            <ListOrdered className="h-4 w-4" />
         </ToolbarButton>
      </div>
   );
}

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
   const editor = useMemo(() => {
      const extension = defineTosExtension();
      return createEditor({ extension, defaultContent: htmlContent ?? "" });
   }, [htmlContent]);

   const { execute, isExecuting } = useAction(updateTosHtml, {
      onSuccess: () => {
         toast.success("Obsah byl uložen");
         onSaved();
      },
      onError: (error) => toast.error(error.error?.validationErrors?._errors?.join(", ") ?? "Obsah se nepodařilo uložit"),
   });

   function handleSave() {
      execute({ id: tosId, htmlContent: editor.getDocHTML() });
   }

   return (
      <ProseKit editor={editor}>
         <div className="flex max-h-[70dvh] w-full flex-col overflow-hidden rounded-md border">
            <Toolbar />
            <div className="overflow-y-auto">
               <div ref={editor.mount} className={cn("prose prose-sm max-w-none p-4 outline-none")} />
            </div>
         </div>
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
      </ProseKit>
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
