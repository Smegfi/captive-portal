"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
   email: z.string().optional(),
   marketing: z.string().default("all").optional(),
   createdFrom: z.date().optional(),
   createdTo: z.date().optional(),
});

export default function UserFilterDialog() {
   const [isOpen, setIsOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         marketing: "all",
         createdFrom: undefined,
         createdTo: undefined,
      },
   });

   function onSubmit(values: z.infer<typeof formSchema>) {
      const params = new URLSearchParams(searchParams.toString());
      const email = values.email?.trim();

      if (email) {
         params.set("email", email);
      } else {
         params.delete("email");
      }

      if (values.marketing && values.marketing !== "all") {
         params.set("marketing", values.marketing);
      } else {
         params.delete("marketing");
      }

      if (values.createdFrom) {
         params.set("createdFrom", values.createdFrom.toISOString());
      } else {
         params.delete("createdFrom");
      }

      if (values.createdTo) {
         params.set("createdTo", values.createdTo.toISOString());
      } else {
         params.delete("createdTo");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      setIsOpen(false);
   }

   useEffect(() => {
      const createdFrom = searchParams.get("createdFrom");
      const createdTo = searchParams.get("createdTo");
      const parsedCreatedFrom = createdFrom ? new Date(createdFrom) : undefined;
      const parsedCreatedTo = createdTo ? new Date(createdTo) : undefined;

      form.reset({
         email: searchParams.get("email") ?? "",
         marketing: searchParams.get("marketing") ?? "all",
         createdFrom: parsedCreatedFrom && !Number.isNaN(parsedCreatedFrom.getTime()) ? parsedCreatedFrom : undefined,
         createdTo: parsedCreatedTo && !Number.isNaN(parsedCreatedTo.getTime()) ? parsedCreatedTo : undefined,
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
               <DialogTitle>Filtrovat uživatele</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form id="user-filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="marketing"
                     render={({ field, fieldState }) => (
                        <FormItem>
                           <FormLabel>Marketing</FormLabel>
                           <FormControl>
                              <Select name={field.name} value={field.value} defaultValue="all" onValueChange={field.onChange}>
                                 <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                                    <SelectValue placeholder="Vyberte stav" />
                                 </SelectTrigger>
                                 <SelectContent position="item-aligned">
                                    <SelectItem value="all">Vše</SelectItem>
                                    <SelectItem value="approved">Schváleno</SelectItem>
                                    <SelectItem value="not-approved">Neschváleno</SelectItem>
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="createdFrom"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Vytvořen od</FormLabel>
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
                     name="createdTo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Vytvořen do</FormLabel>
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
               <Button type="submit" form="user-filter-form">
                  Filtrovat
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
