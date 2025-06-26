"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNetworkSchema } from "@/server/actions-scheme/network/schema";
import { getNetworkAction, updateNetworkAction } from "@/server/actions/network-actions";
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UpdateNetworkProps {
   id: number;
}

export default function UpdateNetwork({ id }: UpdateNetworkProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   const { execute: loadNetwork } = useAction(getNetworkAction, {
      onSuccess: (response) => {
         form.reset({
            id,
            name: response.data?.name,
            ssid: response.data?.ssid,
            isActive: response.data?.isActive,
         });
         setIsLoading(false);
      },
   });

   const { execute, isPending } = useAction(updateNetworkAction, {
      onExecute: () => {
         setError(null);
      },
      onSuccess: () => {
         form.reset();
         setIsOpen(false);
      },
      onError: (error) => {
         setError(error.error.validationErrors?._errors?.join(", ") ?? null);
      },
   });

   type FormValues = z.infer<typeof updateNetworkSchema>;

   const form = useForm<FormValues>({
      resolver: zodResolver(updateNetworkSchema),
      defaultValues: {
         id,
         name: "",
         ssid: "",
         isActive: false,
      },
   });

   function onSubmit(values: FormValues) {
      execute(values);
   }

   function handleOpenChange(open: boolean) {
      setIsOpen(open);
      if (open) {
         loadNetwork({ id });
         setIsLoading(true);
      }
   }

   if (isLoading) {
      return (
         <AlertDialog open>
            <AlertDialogContent className="flex items-center justify-center">
               <Loader2 className="animate-spin" />
               <AlertDialogTitle>Načítám síť...</AlertDialogTitle>
            </AlertDialogContent>
         </AlertDialog>
      );
   }

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button variant="outline">Upravit</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Upravit síť</DialogTitle>
               <DialogDescription>Zde můžete upravit nastavení sítě.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="update-network-form">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }: { field: ControllerRenderProps<FormValues, "name"> }) => (
                        <FormItem>
                           <FormLabel>Název sítě</FormLabel>
                           <FormControl>
                              <Input placeholder="Testovací síť" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="ssid"
                     render={({ field }: { field: ControllerRenderProps<FormValues, "ssid"> }) => (
                        <FormItem>
                           <FormLabel>SSID</FormLabel>
                           <FormControl>
                              <Input placeholder="testovaci-sit" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="isActive"
                     render={({ field }: { field: ControllerRenderProps<FormValues, "isActive"> }) => (
                        <FormItem>
                           <FormControl>
                              <div className="flex items-center gap-3">
                                 <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                                 <Label htmlFor="isActive">Aktivní</Label>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </form>
            </Form>

            {error && <p className="text-red-500">{error}</p>}
            <DialogFooter className="flex gap-2">
               <DialogClose asChild>
                  <Button variant="outline">Zrušit</Button>
               </DialogClose>
               <Button onClick={form.handleSubmit(onSubmit)} form="update-network-form" disabled={isPending}>
                  {isPending ? (
                     <>
                        <Loader2 className="animate-spin" /> Upravuji...
                     </>
                  ) : (
                     "Upravit"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
