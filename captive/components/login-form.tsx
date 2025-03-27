import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
               <Label htmlFor="password">Heslo</Label>
               <Input id="password" type="password" placeholder="********" required />
            </div>
            <Button type="submit" size="xl" className="w-full">
               Přihlásit se
            </Button>
         </div>
      </form>
   );
}
