import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function TosDisclaimer() {
   return (
      <p className="text-sm text-center text-muted-foreground">
         Kliknutím na tlačítko <span className="text-primary">Připojit se</span> souhlasíte s{" "}
         <Dialog>
            <DialogTrigger asChild>
               <span className="text-primary underline cursor-pointer">podmínkami použítí Wi-Fi</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
               <DialogHeader>
                  <DialogTitle>Podmínky použítí Wi-Fi</DialogTitle>
               </DialogHeader>
               <div className="h-[80vh] w-full">
                  <object data="TOS.pdf" type="application/pdf" width="100%" height="100%">
                     <iframe src="TOS.pdf" width="100%" height="100%" className="border-none h-full w-full" style={{ border: "none" }}></iframe>
                  </object>
               </div>
            </DialogContent>
         </Dialog>
      </p>
   );
}
