import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
   return (
      <form className={cn("flex flex-col gap-6", className)} {...props}>
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
                     Souhlasím s použitím emailové adresy pro marketingové a informativní účely Městské části Praha 10
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
                     Kliknutím na tlačítko <Badge variant="default">Připojit se</Badge> souhlasíte{" "}
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
   );
}
