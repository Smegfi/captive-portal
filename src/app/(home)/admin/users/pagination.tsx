"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface PagePaginationProps {
   totalPages: number;
}

export default function PagePagination({ totalPages }: PagePaginationProps) {
   const router = useRouter();
   const searchParams = useSearchParams();

   const currentPage = parseInt(searchParams.get("page") || "1");
   const itemsPerPage = parseInt(searchParams.get("items") || "25");

   function nexhPage() {
      if (currentPage < totalPages) {
         const params = new URLSearchParams(searchParams.toString());
         params.set("page", (currentPage + 1).toString());
         router.push(`?${params.toString()}`);
      }
   }

   function previousPage() {
      if (currentPage > 1) {
         const params = new URLSearchParams(searchParams.toString());
         params.set("page", (currentPage - 1).toString());
         router.push(`?${params.toString()}`);
      }
   }

   function handleChangeItemsPerPage(value: string) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("items", value);
      router.push(`?${params.toString()}`);
   }

   return (
      <div className="flex items-center justify-between gap-4">
         <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Počet záznamů na stránku</FieldLabel>
            <Select defaultValue={itemsPerPage.toString()} onValueChange={handleChangeItemsPerPage}>
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
                  <Button variant="outline" onClick={previousPage}>
                     <ChevronLeftIcon />
                  </Button>
               </PaginationItem>
               <PaginationItem>
                  <span className="text-sm text-muted-foreground px-2">
                     {currentPage} / {totalPages}
                  </span>
               </PaginationItem>
               <PaginationItem>
                  <Button variant="outline" onClick={nexhPage}>
                     <ChevronRightIcon />
                  </Button>
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
