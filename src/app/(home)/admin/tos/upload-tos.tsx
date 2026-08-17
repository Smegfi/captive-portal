"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadTos } from "@/server/repositories/tos/create";
import { uploadTosSchema, uploadTosSchemaType } from "@/server/repositories/tos/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UploadTos() {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const [uploadStatus, setUploadStatus] = useState("Připraveno k nahrání");

   const { execute, isExecuting } = useAction(uploadTos, {
      onExecute: () => {
         setError(null);
         setUploadStatus("Příprava nahrávání...");
      },
      onSuccess: () => {
         form.reset();
         setFile(null);
         setUploadStatus("Připraveno k nahrání");
         setIsOpen(false);
      },
      onError: (error) => {
         setUploadStatus("Nahrávání selhalo");
         setError(error.error?.validationErrors?._errors?.join(", ") ?? "Chyba při nahrávání dokumentu");
      },
   });

   const form = useForm({
      resolver: zodResolver(uploadTosSchema),
      defaultValues: {
         name: "",
         uploadedAt: new Date(),
         setActive: false,
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
         setUploadStatus("Připraveno k nahrání");
         form.setValue("file", selectedFile);
         form.setValue("fileName", selectedFile.name);
         form.setValue("fileSize", selectedFile.size);
      }
   }

   useEffect(() => {
      if (!isExecuting) {
         return;
      }

      const statuses = ["Příprava nahrávání...", "Konverze DOCX do HTML...", "Ukládání dokumentu..."];
      let currentIndex = 0;
      setUploadStatus(statuses[currentIndex]);

      const interval = setInterval(() => {
         currentIndex = (currentIndex + 1) % statuses.length;
         setUploadStatus(statuses[currentIndex]);
      }, 1000);

      return () => clearInterval(interval);
   }, [isExecuting]);

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
               <DialogDescription>Nahrajte nový DOCX dokument s podmínkami použití.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
               <p className="text-sm text-muted-foreground">{uploadStatus}</p>
               <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  {isExecuting ? <div className="bg-primary h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite]" /> : <div className="bg-primary/30 h-full w-full" />}
               </div>
            </div>
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
                              <Input type="file" accept=".docx" className="cursor-pointer" onChange={handleFileChange} />
                           </FormControl>
                           <span className="text-sm text-muted-foreground">Povolené formáty: .docx</span>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="setActive"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 rounded-md border p-3">
                           <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Aktivovat ihned po nahrání</FormLabel>
                              <p className="text-sm text-muted-foreground">Dokument se zobrazí hostům, přiřadí se mu verze a stane se neměnným. Tuto akci nelze vrátit zpět.</p>
                           </div>
                        </FormItem>
                     )}
                  />
               </form>
            </Form>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline" disabled={isExecuting}>
                     Zrušit
                  </Button>
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
