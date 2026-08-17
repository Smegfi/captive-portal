"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle, DialogHeader, DialogContent, DialogTrigger, Dialog, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
   mac: z.string().optional(),
   user: z.string().optional(),
   connectedFrom: z.date().optional(),
   connectedTo: z.date().optional(),
   device: z.string().default("all").optional(),
});

export default function FilerDialog() {
   const [isOpen, setIsOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         mac: "",
         user: "",
         connectedFrom: undefined,
         connectedTo: undefined,
         device: "all",
      },
   });

   function onSubmit(values: z.infer<typeof formSchema>) {
      const params = new URLSearchParams(searchParams.toString());
      const mac = values.mac?.trim();
      const user = values.user?.trim();

      if (mac) {
         params.set("mac", mac);
      } else {
         params.delete("mac");
      }

      if (user) {
         params.set("user", user);
      } else {
         params.delete("user");
      }

      if (values.device && values.device !== "all") {
         params.set("device", values.device);
      } else {
         params.delete("device");
      }

      if (values.connectedFrom) {
         params.set("connectedFrom", values.connectedFrom.toISOString());
      } else {
         params.delete("connectedFrom");
      }

      if (values.connectedTo) {
         params.set("connectedTo", values.connectedTo.toISOString());
      } else {
         params.delete("connectedTo");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      setIsOpen(false);
   }

   function handleOpenChange(open: boolean) {
      setIsOpen(open);
   }

   useEffect(() => {
      const connectedFrom = searchParams.get("connectedFrom");
      const connectedTo = searchParams.get("connectedTo");
      const parsedConnectedFrom = connectedFrom ? new Date(connectedFrom) : undefined;
      const parsedConnectedTo = connectedTo ? new Date(connectedTo) : undefined;

      form.reset({
         mac: searchParams.get("mac") ?? "",
         user: searchParams.get("user") ?? "",
         device: searchParams.get("device") ?? "all",
         connectedFrom: parsedConnectedFrom && !Number.isNaN(parsedConnectedFrom.getTime()) ? parsedConnectedFrom : undefined,
         connectedTo: parsedConnectedTo && !Number.isNaN(parsedConnectedTo.getTime()) ? parsedConnectedTo : undefined,
      });
   }, [form, searchParams]);

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>
            <Button>
               <FilterIcon />
               <span>Filtrovat</span>
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Filtrovat</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form id="filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                     name="device"
                     render={({ field, fieldState }) => (
                        <FormItem>
                           <FormLabel>Zařízení</FormLabel>
                           <FormControl>
                              <Select name={field.name} value={field.value} defaultValue="all" onValueChange={field.onChange}>
                                 <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                                    <SelectValue placeholder="Vyberte zařízení" />
                                 </SelectTrigger>
                                 <SelectContent position="item-aligned">
                                    <SelectItem value="all">Vše</SelectItem>
                                    <SelectItem value="linux">Linux</SelectItem>
                                    <SelectItem value="windows">Windows</SelectItem>
                                    <SelectItem value="android">Android</SelectItem>
                                    <SelectItem value="ios">iOS</SelectItem>
                                    <SelectItem value="macos">MacOS</SelectItem>
                                 </SelectContent>
                              </Select>
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
                     name="connectedFrom"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Spuštěno od</FormLabel>
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
                     name="connectedTo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Spuštěno do</FormLabel>
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
               <Button type="submit" form="filter-form">
                  Filtrovat
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
