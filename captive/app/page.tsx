import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default async function Page() {
   return (
      <div className="grid min-h-svh">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
               <Link href="/login" className="flex items-center gap-2 font-medium">
                  <Image
                     src="/logo-white.webp"
                     width={200}
                     height={70}
                     alt="Praha 10 - logo"
                     className="mx-auto hidden dark:block"
                  />
                  <Image
                     src="/logo-black.webp"
                     width={200}
                     height={70}
                     alt="Praha 10 - logo"
                     className="mx-auto block dark:hidden"
                  />
               </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <form className="flex flex-col gap-6">
                     <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold uppercase">Captive portál</h1>
                     </div>
                     <div className="grid gap-6">
                        <div className="grid gap-3">
                           <Label htmlFor="email">Email</Label>
                           <Input id="email" type="email" placeholder="vas@email.cz" required />
                        </div>
                        <div className="grid gap-3">
                           <div className="flex items-center space-x-2">
                              <Checkbox id="terms" />
                              <Label
                                 htmlFor="terms"
                                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                 Souhlasím s použitím emailové adresy pro marketingové a informativní účely Městské
                                 části Praha 10
                              </Label>
                           </div>
                        </div>
                        <Button type="submit" size="xl" className="w-full">
                           Připojit se
                        </Button>
                     </div>
                     <div className="text-center text-sm">
                        <Dialog>
                           <DialogTrigger asChild>
                              <label className="text-sm text-muted-foreground mt-8">
                                 Kliknutím na tlačítko <strong className="text-foreground">Připojit se</strong> souhlasíte{" "}
                                 <span className="underline text-foreground">s podmínkami použítí Wi-Fi sítě.</span>
                              </label>
                           </DialogTrigger>
                           <DialogContent>
                              <DialogHeader>
                                 <DialogTitle>Podmínky použítí Wi-Fi sítě</DialogTitle>
                                 <DialogDescription>
                                    Tato síť je určena pro osoby, které mají přihlášený účet v Městské části Praha 10.
                                 </DialogDescription>
                              </DialogHeader>
                           </DialogContent>
                        </Dialog>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}
