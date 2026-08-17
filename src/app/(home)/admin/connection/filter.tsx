"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = z.object({
   mac: z.string().optional(),
   network: z.string().optional(),
   user: z.string().optional(),
   updatedFrom: z.date().optional(),
   updatedTo: z.date().optional(),
});

export default function ConnectionFilterDialog() {
   const [isOpen, setIsOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         mac: "",
         network: "",
         user: "",
         updatedFrom: undefined,
         updatedTo: undefined,
      },
   });

   function onSubmit(values: z.infer<typeof formSchema>) {
      const params = new URLSearchParams(searchParams.toString());
      const mac = values.mac?.trim();
      const network = values.network?.trim();
      const user = values.user?.trim();

      if (mac) {
         params.set("mac", mac);
      } else {
         params.delete("mac");
      }

      if (network) {
         params.set("network", network);
      } else {
         params.delete("network");
      }

      if (user) {
         params.set("user", user);
      } else {
         params.delete("user");
      }

      if (values.updatedFrom) {
         params.set("updatedFrom", values.updatedFrom.toISOString());
      } else {
         params.delete("updatedFrom");
      }

      if (values.updatedTo) {
         params.set("updatedTo", values.updatedTo.toISOString());
      } else {
         params.delete("updatedTo");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      setIsOpen(false);
   }

   useEffect(() => {
      const updatedFrom = searchParams.get("updatedFrom");
      const updatedTo = searchParams.get("updatedTo");
      const parsedUpdatedFrom = updatedFrom ? new Date(updatedFrom) : undefined;
      const parsedUpdatedTo = updatedTo ? new Date(updatedTo) : undefined;

      form.reset({
         mac: searchParams.get("mac") ?? "",
         network: searchParams.get("network") ?? "",
         user: searchParams.get("user") ?? "",
         updatedFrom: parsedUpdatedFrom && !Number.isNaN(parsedUpdatedFrom.getTime()) ? parsedUpdatedFrom : undefined,
         updatedTo: parsedUpdatedTo && !Number.isNaN(parsedUpdatedTo.getTime()) ? parsedUpdatedTo : undefined,
      });
   }, [form, searchParams]);

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button>
               <FilterIcon />
               <span>Filtrovat</span>
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Filtrovat připojení</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form id="connection-filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                     control={form.control}
                     name="mac"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>MAC adresa</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="network"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Síť</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="user"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Uživatel</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="updatedFrom"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Upraveno od</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       data-empty={!field.value}
                                       className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                       {field.value ? format(field.value, "dd.MM.yyyy") : <span>Zvolte datum</span>}
                                       <ChevronDownIcon />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} defaultMonth={field.value} />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="updatedTo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Upraveno do</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       data-empty={!field.value}
                                       className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                       {field.value ? format(field.value, "dd.MM.yyyy") : <span>Zvolte datum</span>}
                                       <ChevronDownIcon />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} defaultMonth={field.value} />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </form>
            </Form>
            <DialogFooter>
               <Button type="submit" form="connection-filter-form">
                  Filtrovat
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
