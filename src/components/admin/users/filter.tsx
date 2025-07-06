"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, Filter as FilterIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Filter() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const pathname = usePathname();
   const [searchValue, setSearchValue] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   function handleSearch() {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim()) {
         params.set("search", searchValue.trim());
      } else {
         params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
   }

   function handleKeyPress(e: React.KeyboardEvent) {
      if (e.key === "Enter") {
         handleSearch();
      }
   }

   function handleReset() {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      setSearchValue("");
   }

   useEffect(() => {
      setSearchValue(searchParams.get("search") || "");
      setIsLoading(false);
   }, [searchParams]);

   return (
      <>
         <div className="flex-1 flex items-center">
            <Input
               placeholder="Hledat uživatele"
               className="rounded-r-none"
               value={searchValue}
               onChange={(e) => setSearchValue(e.target.value)}
               onKeyUpCapture={handleKeyPress}
               disabled={isLoading}
            />
            {searchValue && (
               <Button className="rounded-l-none rounded-r-none" variant="outline" onClick={handleReset} disabled={isLoading}>
                  <X />
               </Button>
            )}
            <Button className="rounded-l-none" variant="outline" onClick={handleSearch} disabled={isLoading}>
               {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search />}
            </Button>
         </div>

         <Dialog>
            <DialogTrigger asChild>
               <Button>
                  <FilterIcon className="w-4 h-4" />
                  <span>Filtrovat</span>
               </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Filtrace</DialogTitle>
                  <DialogDescription>Working on it</DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </>
   );
}
