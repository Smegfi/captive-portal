import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CurrentStatus() {
   return (
      <div className="grid grid-cols-4 gap-4">
         <Card>
            <CardHeader>
               <CardTitle>Připojení</CardTitle>
               <CardDescription>Aktuální stav připojení</CardDescription>
               <CardAction>
                  <div className="flex items-center justify-center gap-2">
                     <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                     </span>
                     <span className="text-2xl font-bold">5</span>
                  </div>
               </CardAction>
            </CardHeader>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle>Nová připojení</CardTitle>
               <CardDescription>Nově připojení uživatelé tento měsíc</CardDescription>
               <CardAction>
                  <span className="text-2xl font-bold">72</span>
               </CardAction>
            </CardHeader>
         </Card>
      </div>
   );
}
