"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadTosSchema, uploadTosSchemaType } from "@/server/actions-scheme/tos/schema";
import { uploadTosAction } from "@/server/actions/tos-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UploadTos() {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [file, setFile] = useState<File | null>(null);

   const { execute, isExecuting } = useAction(uploadTosAction, {
      onExecute: () => {
         setError(null);
      },
      onSuccess: () => {
         form.reset();
         setFile(null);
         setIsOpen(false);
      },
      onError: (error) => {
         setError(error.error?.validationErrors?._errors?.join(", ") ?? "Chyba při nahrávání dokumentu");
      },
   });

   const form = useForm({
      resolver: zodResolver(uploadTosSchema),
      defaultValues: {
         name: "",
         uploadedAt: new Date(),
      },
   });

   function onSubmit(values: uploadTosSchemaType) {
      if (!file) {
         setError("Prosím vyberte soubor");
         return;
      }
      execute({ ...values, fileName: file.name, fileSize: file.size, file: file, uploadedAt: new Date() });
   }

   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);
         form.setValue("file", selectedFile);
         form.setValue("fileName", selectedFile.name);
         form.setValue("fileSize", selectedFile.size);
      }
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus />
               <span>Přidat dokument</span>
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Přidat TOS dokument</DialogTitle>
               <DialogDescription>Nahrajte nový dokument s podmínkami použití.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="new-tos-form">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Název dokumentu</FormLabel>
                           <FormControl>
                              <Input placeholder="Např. Obecné podmínky použití" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="file"
                     render={() => (
                        <FormItem>
                           <FormLabel>Soubor</FormLabel>
                           <FormControl>
                              <Input type="file" accept=".pdf" className="cursor-pointer" onChange={handleFileChange} />
                           </FormControl>
                           <span className="text-sm text-muted-foreground">Povolené formáty: .pdf</span>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </form>
            </Form>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline">Zrušit</Button>
               </DialogClose>
               <Button onClick={form.handleSubmit(onSubmit)} form="new-tos-form" disabled={isExecuting || !file}>
                  {isExecuting ? (
                     <>
                        <Loader2 className="animate-spin" /> Nahrávám...
                     </>
                  ) : (
                     <>
                        <Upload /> Nahrát
                     </>
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
