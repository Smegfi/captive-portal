"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function NewUser() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus />
               <span>Přidat uživatele</span>
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Přidat uživatele</DialogTitle>
               <DialogDescription>Zde můžete přidat nového uživatele.</DialogDescription>
            </DialogHeader>

            <Input placeholder="Jan" />
            <Input placeholder="Novák" />
            <Input placeholder="jan.novak@example.com" />
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline">Zrušit</Button>
               </DialogClose>
               <Button>
                  <Plus />
                  <span>Přidat</span>
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
