"use client";

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { createEditor, type NodeJSON } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo } from "react";

import { sampleContent } from "@/components/editor/sample/sample-doc-full";
import { tags } from "@/components/editor/sample/sample-tag-data";
import { sampleUploader } from "@/components/editor/sample/sample-uploader";
import { users } from "@/components/editor/sample/sample-user-data";
import { BlockHandle } from "@/components/editor/ui/block-handle/index";
import { DropIndicator } from "@/components/editor/ui/drop-indicator/index";
import { InlineMenu } from "@/components/editor/ui/inline-menu/index";
import { SlashMenu } from "@/components/editor/ui/slash-menu/index";
import { TableHandle } from "@/components/editor/ui/table-handle/index";
import { TagMenu } from "@/components/editor/ui/tag-menu/index";
import { Toolbar } from "@/components/editor/ui/toolbar/index";
import { UserMenu } from "@/components/editor/ui/user-menu/index";

import { defineExtension } from "@/components/editor/examples/full/extension";

interface EditorProps {
   initialContent?: NodeJSON;
}

export default function Editor(props: EditorProps) {
   const defaultContent = props.initialContent ?? sampleContent;
   const editor = useMemo(() => {
      const extension = defineExtension();
      return createEditor({ extension, defaultContent });
   }, [defaultContent]);

   return (
      <ProseKit editor={editor}>
         <div className="box-border h-full w-full min-h-36 overflow-y-hidden overflow-x-hidden rounded-md border border-solid border-gray-200 dark:border-gray-700 shadow-sm flex flex-col bg-[canvas] text-black dark:text-white">
            <Toolbar uploader={sampleUploader} />
            <div className="relative w-full flex-1 box-border overflow-y-auto">
               <div
                  ref={editor.mount}
                  className="ProseMirror box-border min-h-full px-[max(4rem,calc(50%-20rem))] py-8 outline-hidden outline-0 [&_span[data-mention=user]]:text-blue-500 [&_span[data-mention=tag]]:text-violet-500"
               ></div>
               <InlineMenu />
               <SlashMenu />
               <UserMenu users={users} />
               <TagMenu tags={tags} />
               <BlockHandle />
               <TableHandle />
               <DropIndicator />
            </div>
         </div>
      </ProseKit>
   );
}
