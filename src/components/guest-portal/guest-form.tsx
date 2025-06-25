"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

import { Loader2 } from "lucide-react";

export function GuestForm() {
   const [loading, setLoading] = useState(false);

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Veřejná WiFi</CardTitle>
            <CardDescription className="text-center">Pro připojení k bezplatné Wi-Fi zadejte svou emailovou adresu</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
               <Label>Email</Label>
               <Input type="email" placeholder="email@example.com" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
               <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700" />
                  <div className="grid gap-1.5 font-normal">
                     <p className="text-sm leading-none font-medium">Přijímat emailové upozornění</p>
                     <p className="text-muted-foreground text-sm">
                        Souhlasím s použitím emailové adresy pro marketingové a informativní účely Městské části Praha 10
                     </p>
                  </div>
               </Label>
            </div>
         </CardContent>
         <CardFooter>
            <Button className="w-1/2 mx-auto" disabled={loading} onClick={() => setLoading(true)}>
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
