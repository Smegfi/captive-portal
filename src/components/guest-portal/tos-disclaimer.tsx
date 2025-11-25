import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TosDisclaimer() {
   return (
      <p className="text-sm text-center text-muted-foreground">
         Kliknutím na tlačítko <span className="text-primary">Připojit se</span> souhlasíte s{" "}
         <Dialog>
            <DialogTrigger asChild>
               <span className="text-primary underline cursor-pointer">podmínkami použítí Wi-Fi</span>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-3xl px-0 sm:px-4">
               <DialogHeader>
                  <DialogTitle>Podmínky použítí Wi-Fi</DialogTitle>
               </DialogHeader>
               <ScrollArea className="h-[80dvh] w-full">
                  <div className="flex flex-col gap-4 p-0 sm:p-2 sm:pr-4 bg-secondary">
                     <div className="overflow-hidden">
                        <img src="TOS/TOS-1.png" alt="Podmínky použítí Wi-Fi" className="w-full h-auto scale-110 sm:scale-100" />
                     </div>
                     <div className="overflow-hidden">
                        <img src="TOS/TOS-2.png" alt="Podmínky použítí Wi-Fi" className="w-full h-auto scale-110 sm:scale-100" />
                     </div>
                     <div className="overflow-hidden">
                        <img src="TOS/TOS-3.png" alt="Podmínky použítí Wi-Fi" className="w-full h-auto scale-110 sm:scale-100" />
                     </div>
                     <div className="overflow-hidden">
                        <img src="TOS/TOS-4.png" alt="Podmínky použítí Wi-Fi" className="w-full h-auto scale-110 sm:scale-100" />
                     </div>
                  </div>
               </ScrollArea>
            </DialogContent>
         </Dialog>
      </p>
   );
}
