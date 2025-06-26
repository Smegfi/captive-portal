"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newNetworkSchema } from "@/server/actions-scheme/network/schema";
import { newNetworkAction } from "@/server/actions/network-actions";
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

export default function NewNetwork() {
   const [isOpen, setIsOpen] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const { execute, isExecuting } = useAction(newNetworkAction, {
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

   type FormValues = z.infer<typeof newNetworkSchema>;

   const form = useForm<FormValues>({
      resolver: zodResolver(newNetworkSchema),
      defaultValues: {
         name: "",
         ssid: "",
         isActive: true,
      },
   });

   function onSubmit(values: FormValues) {
      execute(values);
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <Plus />
               <span>Přidat síť</span>
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Přidat síť</DialogTitle>
               <DialogDescription>Zde můžete přidat novou síť.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="new-network-form">
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
               <Button onClick={form.handleSubmit(onSubmit)} form="new-network-form" disabled={isExecuting}>
                  {isExecuting ? (
                     <>
                        <Loader2 className="animate-spin" /> Vytvářím...
                     </>
                  ) : (
                     "Přidat"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
