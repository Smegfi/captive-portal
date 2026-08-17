"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE, parsePositiveInt } from "@/lib/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PagePaginationProps {
   totalPages: number;
}

export default function PagePagination({ totalPages }: PagePaginationProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const currentPage = parsePositiveInt(searchParams.get("page") || undefined, DEFAULT_PAGE);
   const itemsPerPage = parsePositiveInt(searchParams.get("pageSize") || searchParams.get("items") || undefined, DEFAULT_ITEMS_PER_PAGE);

   const maxPage = totalPages > 0 ? totalPages : 1;
   const normalizedPage = Math.min(Math.max(currentPage, 1), maxPage);
   const pageLabel = totalPages > 0 ? `${normalizedPage} / ${totalPages}` : "0 / 0";

   function updateSearchParams(update: (params: URLSearchParams) => void) {
      const params = new URLSearchParams(searchParams.toString());
      update(params);
      router.push(`${pathname}?${params.toString()}`);
   }

   function nextPage() {
      if (normalizedPage < maxPage) {
         updateSearchParams((params) => {
            params.set("page", (normalizedPage + 1).toString());
         });
      }
   }

   function previousPage() {
      if (normalizedPage > 1) {
         updateSearchParams((params) => {
            params.set("page", (normalizedPage - 1).toString());
         });
      }
   }

   function handleItemsPerPageChange(value: string) {
      updateSearchParams((params) => {
         params.set("pageSize", value);
         params.delete("items");
         params.set("page", DEFAULT_PAGE.toString());
      });
   }

   return (
      <div className="flex items-center justify-between gap-4">
         <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Počet záznamů na stránku</FieldLabel>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
               <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
               </SelectTrigger>
               <SelectContent align="start">
                  <SelectGroup>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="25">25</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                     <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>
         </Field>
         <Pagination className="mx-0 w-auto">
            <PaginationContent>
               <PaginationItem>
                  <Button variant="outline" onClick={previousPage} disabled={normalizedPage <= 1}>
                     <ChevronLeftIcon />
                  </Button>
               </PaginationItem>
               <PaginationItem>
                  <span className="px-2 text-sm text-muted-foreground">{pageLabel}</span>
               </PaginationItem>
               <PaginationItem>
                  <Button variant="outline" onClick={nextPage} disabled={normalizedPage >= maxPage}>
                     <ChevronRightIcon />
                  </Button>
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
