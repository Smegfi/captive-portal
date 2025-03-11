import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeSwitch } from "@/components/themes/theme-switch";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default async function Page() {
   return (
      // <div className="p-4 flex justify-center">
      //    <Card className="w-[48rem]">
      //       <CardHeader>
      //          <Image
      //             src="/logo-white.webp"
      //             width={200}
      //             height={200}
      //             alt="Praha 10 - logo"
      //             className="mx-auto hidden dark:block"
      //          />
      //          <Image
      //             src="/logo-black.webp"
      //             width={200}
      //             height={200}
      //             alt="Praha 10 - logo"
      //             className="mx-auto block dark:hidden"
      //          />
      //          <CardTitle className="text-center text-2xl font-semibold tracking-tight uppercase">
      //             Captive portál
      //          </CardTitle>
      //       </CardHeader>
      //       <CardContent>
      //          <div className="grid w-full items-center gap-4">
      //             <div className="flex flex-col space-y-1.5">
      //                <Label htmlFor="email">Email</Label>
      //                <Input id="email" placeholder="vas@email.cz" />
      //             </div>
      //             <div className="flex flex-col space-y-1.5">
      //                <div className="flex items-center space-x-2">
      //                   <Checkbox id="terms" />
      //                   <Label
      //                      htmlFor="terms"
      //                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      //                      Souhlasím s použitím emailové adresy pro marketingové a informativní účely Městské části
      //                      Praha 10
      //                   </Label>
      //                </div>
      //             </div>
      //          </div>
      //          <div className="flex flex-col mt-8 items-center">
      //             <Button size="xl">Připojit se</Button>
      //             <Dialog>
      //                <DialogTrigger asChild>
      //                   <label className="text-sm text-muted-foreground mt-8">
      //                      Kliknutím na tlačítko <Badge variant="default">Připojit se</Badge> souhlasíte{" "}
      //                      <span className="underline text-foreground">s podmínkami použítí Wi-Fi sítě.</span>
      //                   </label>
      //                </DialogTrigger>
      //                <DialogContent>
      //                   <DialogHeader>
      //                      <DialogTitle>Podmínky použítí Wi-Fi sítě</DialogTitle>
      //                      <DialogDescription>
      //                         Tato síť je určena pro osoby, které mají přihlášený účet v Městské části Praha 10.
      //                      </DialogDescription>
      //                   </DialogHeader>
      //                </DialogContent>
      //             </Dialog>
      //          </div>
      //       </CardContent>
      //       <CardFooter>
      //          <ThemeSwitch />
      //       </CardFooter>
      //    </Card>
      // </div>
      <div className="grid min-h-svh">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
               <a href="#" className="flex items-center gap-2 font-medium">
                  <Image
                     src="/logo-white.webp"
                     width={200}
                     height={200}
                     alt="Praha 10 - logo"
                     className="mx-auto hidden dark:block"
                  />
                  <Image
                     src="/logo-black.webp"
                     width={200}
                     height={200}
                     alt="Praha 10 - logo"
                     className="mx-auto block dark:hidden"
                  />
               </a>
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <LoginForm />
               </div>
            </div>
         </div>
      </div>
   );
}
