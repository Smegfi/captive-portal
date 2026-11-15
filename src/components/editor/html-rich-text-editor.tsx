"use client";

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { Button } from "@/components/ui/button";
import { defineTosExtension, type TosExtension } from "@/components/tos/tos-extension";
import { cn } from "@/lib/utils";
import { createEditor, type Editor } from "prosekit/core";
import { ProseKit, useDocChange, useEditor, useEditorDerivedValue } from "prosekit/react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

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

export interface HtmlRichTextEditorProps {
   /** Initial HTML (or plain text) content loaded into the editor. */
   defaultContent: string;
   /** Called whenever the document HTML changes. */
   onChange?: (html: string) => void;
   /** Optional class for the outer editor chrome. */
   className?: string;
   /** Optional class for the editable surface. */
   contentClassName?: string;
   /** Accessible label for the editable region. */
   "aria-label"?: string;
   /** Optional id forwarded to the editable mount element. */
   id?: string;
}

/**
 * Shared ProseKit WYSIWYG editor used by TOS documents and welcome email settings.
 */
export function HtmlRichTextEditor({ defaultContent, onChange, className, contentClassName, id, "aria-label": ariaLabel }: HtmlRichTextEditorProps) {
   const onChangeRef = useRef(onChange);
   const skipInitialChangeRef = useRef(true);

   useEffect(() => {
      onChangeRef.current = onChange;
   }, [onChange]);

   const editor = useMemo(() => {
      const extension = defineTosExtension();
      return createEditor({ extension, defaultContent });
      // Intentionally mount once with the provided initial content.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useDocChange(() => {
      if (skipInitialChangeRef.current) {
         skipInitialChangeRef.current = false;
         return;
      }
      onChangeRef.current?.(editor.getDocHTML());
   }, { editor });

   return (
      <ProseKit editor={editor}>
         <div className={cn("flex w-full flex-col overflow-hidden rounded-md border", className)}>
            <Toolbar />
            <div className="overflow-y-auto">
               <div
                  id={id}
                  ref={editor.mount}
                  role="textbox"
                  aria-multiline="true"
                  aria-label={ariaLabel}
                  className={cn("prose prose-sm min-h-48 max-w-none p-4 outline-none", contentClassName)}
               />
            </div>
         </div>
      </ProseKit>
   );
}
