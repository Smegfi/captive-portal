"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDevice } from "@/lib/device-hook";
import { guestLoginSchema } from "@/server/actions-scheme/guest-user/schema";
import { guestLoginAction } from "@/server/actions/guest-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function GuestForm() {
   const [loading, setLoading] = useState(false);
   const { ua, browser, cpu, device, engine, os } = useDevice();

   const form = useForm<z.infer<typeof guestLoginSchema>>({
      resolver: zodResolver(guestLoginSchema),
      defaultValues: {
         email: "",
         marketingApproved: false,
         device: {
            userAgent: ua,
            browser: browser,
            device: device,
            os: os,
            cpu: cpu,
            engine: engine,
         },
      },
   });

   async function onSubmit(data: z.infer<typeof guestLoginSchema>) {
      setLoading(true);
      await guestLoginAction(data);
      setLoading(false);
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Veřejná WiFi</CardTitle>
            <CardDescription className="text-center">Pro připojení k bezplatné Wi-Fi zadejte svou emailovou adresu</CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} id="guest-form" className="space-y-6">
                  <div className="flex flex-col gap-2">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input type="email" placeholder="email@example.com" className="w-full" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <FormField
                        control={form.control}
                        name="marketingApproved"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                    <Checkbox
                                       className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                    <div className="grid gap-1.5 font-normal">
                                       <p className="text-sm leading-none font-medium">Přijímat emailové upozornění</p>
                                       <p className="text-muted-foreground text-sm">
                                          Souhlasím s použitím emailové adresy pro marketingové a informativní účely Městské části Praha 10
                                       </p>
                                    </div>
                                 </Label>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </form>
            </Form>
         </CardContent>
         <CardFooter>
            <Button className="w-full lg:w-1/2 lg:mx-auto" disabled={loading} onClick={() => form.handleSubmit(onSubmit)} form="guest-form">
               {loading ? (
                  <>
                     <Loader2 className="animate-spin" />
                     <span>Přihlašuji...</span>
                  </>
               ) : (
                  "Přihlásit se"
               )}
            </Button>
         </CardFooter>
      </Card>
   );
}
