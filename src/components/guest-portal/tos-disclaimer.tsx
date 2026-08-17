import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

interface TosDisclaimerProps {
   htmlContent?: string | null;
   fileUrl?: string | null;
}

export function TosDisclaimer({ htmlContent, fileUrl }: TosDisclaimerProps) {
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
               <div className="h-[80dvh] w-full overflow-y-auto">
                  {htmlContent ? (
                     <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  ) : (
                     <p className="text-sm text-muted-foreground">TOS dokument není aktuálně k dispozici.</p>
                  )}
               </div>
               {fileUrl ? (
                  <Button variant="outline" className="mx-2" asChild>
                     <a href={fileUrl} download>
                        <Download className="w-4 h-4" />
                        Stáhnout
                     </a>
                  </Button>
               ) : null}
            </DialogContent>
         </Dialog>
      </p>
   );
}
