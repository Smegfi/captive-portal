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
import { ControllerRenderProps, useForm } from "react-hook-form";

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
         setError(error.error?.serverError?.message ?? "Chyba při nahrávání dokumentu");
      },
   });

   const form = useForm({
      resolver: zodResolver(uploadTosSchema),
      defaultValues: {
         name: "",
      },
   });

   function onSubmit(values: uploadTosSchemaType) {
      if (!file) {
         setError("Prosím vyberte soubor");
         return;
      }
      execute({ ...values, fileName: file.name, fileSize: file.size, uploadedAt: new Date() });
   }

   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);
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
                     render={({ field }: { field: ControllerRenderProps<uploadTosSchemaType, "name"> }) => (
                        <FormItem>
                           <FormLabel>Název dokumentu</FormLabel>
                           <FormControl>
                              <Input placeholder="Např. Obecné podmínky použití" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="space-y-2">
                     <FormLabel>Soubor</FormLabel>
                     <div className="flex flex-col items-center gap-4">
                        <Input type="file" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
                     </div>
                     <p className="text-xs text-muted-foreground">Podporované formáty: PDF</p>
                     {file && (
                        <span className="text-sm text-muted-foreground">
                           {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                     )}
                  </div>
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
