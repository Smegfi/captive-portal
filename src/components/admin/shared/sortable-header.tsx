"use client";

import { TableHead } from "@/components/ui/table";
import { DEFAULT_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortOrder = "asc" | "desc";

interface SortableHeaderProps {
   column: string;
   label: string;
   className?: string;
}

export default function SortableHeader({ column, label, className }: SortableHeaderProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const activeColumn = searchParams.get("sortBy");
   const activeOrder = (searchParams.get("sortOrder") as SortOrder | null) ?? null;
   const isActive = activeColumn === column;
   const currentOrder: SortOrder | null = isActive ? activeOrder : null;

   function handleClick() {
      const params = new URLSearchParams(searchParams.toString());

      // Cycle for this column: NONE -> asc -> desc -> NONE
      if (currentOrder === "asc") {
         params.set("sortBy", column);
         params.set("sortOrder", "desc");
      } else if (currentOrder === "desc") {
         params.delete("sortBy");
         params.delete("sortOrder");
      } else {
         params.set("sortBy", column);
         params.set("sortOrder", "asc");
      }

      params.set("page", DEFAULT_PAGE.toString());
      router.push(`${pathname}?${params.toString()}`);
   }

   const Icon = currentOrder === "asc" ? ChevronUp : currentOrder === "desc" ? ChevronDown : ChevronsUpDown;

   return (
      <TableHead className={className}>
         <button
            type="button"
            onClick={handleClick}
            className={cn(
               "-mx-2 inline-flex select-none items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-muted/50",
               !currentOrder && "text-muted-foreground"
            )}
         >
            {label}
            <Icon className="h-4 w-4 shrink-0 opacity-70" />
         </button>
      </TableHead>
   );
}
