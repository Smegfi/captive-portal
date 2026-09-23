"use client";

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { defineTosExtension } from "@/components/tos/tos-extension";
import { cn } from "@/lib/utils";
import { createEditor, union } from "prosekit/core";
import { defineReadonly } from "prosekit/extensions/readonly";
import { ProseKit } from "prosekit/react";
import { useMemo } from "react";

interface TosHtmlViewerProps {
   htmlContent: string;
   className?: string;
}

export function TosHtmlViewer({ htmlContent, className }: TosHtmlViewerProps) {
   const editor = useMemo(() => {
      const extension = union(defineTosExtension(), defineReadonly());
      return createEditor({ extension, defaultContent: htmlContent });
   }, [htmlContent]);

   return (
      <ProseKit editor={editor}>
         <div ref={editor.mount} className={cn("prose prose-sm max-w-none p-4 outline-none", className)} />
      </ProseKit>
   );
}
