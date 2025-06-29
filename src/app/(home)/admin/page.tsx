import { AspectRatio } from "@/components/ui/aspect-ratio";

export default async function Page() {
   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold">Dashboard</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
               <div className="flex flex-col gap-2 items-center justify-center p-4">
                  <div className="w-full h-full relative">
                     <svg className="h-full w-full blur-sm opacity-60" viewBox="0 0 100 60">
                        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points="10,50 20,45 30,35 40,40 50,25 60,30 70,20 80,15 90,10" />
                        <circle cx="10" cy="50" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="20" cy="45" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="30" cy="35" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="40" cy="40" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="50" cy="25" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="60" cy="30" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="70" cy="20" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="80" cy="15" r="1.5" fill="hsl(var(--primary))" />
                        <circle cx="90" cy="10" r="1.5" fill="hsl(var(--primary))" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">Již brzy...</div>
                     </div>
                  </div>
               </div>
            </AspectRatio>

            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
               <div className="flex flex-col gap-2 items-center justify-center p-4">
                  <div className="w-full h-full relative">
                     <svg className="w-full h-full blur-sm opacity-30" viewBox="0 0 100 50">
                        <rect x="10" y="40" width="8" height="20" fill="hsl(var(--primary))" />
                        <rect x="22" y="35" width="8" height="25" fill="hsl(var(--primary))" />
                        <rect x="34" y="30" width="8" height="30" fill="hsl(var(--primary))" />
                        <rect x="46" y="25" width="8" height="35" fill="hsl(var(--primary))" />
                        <rect x="58" y="20" width="8" height="40" fill="hsl(var(--primary))" />
                        <rect x="70" y="15" width="8" height="45" fill="hsl(var(--primary))" />
                        <rect x="82" y="10" width="8" height="50" fill="hsl(var(--primary))" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">Již brzy...</div>
                     </div>
                  </div>
               </div>
            </AspectRatio>

            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
               <div className="flex flex-col gap-2 items-center justify-center p-4">
                  <div className="w-full h-full relative">
                     {/* Mock pie chart */}
                     <svg className="w-full h-full blur-sm opacity-30" viewBox="0 0 100 60">
                        <circle cx="50" cy="30" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <path d="M 50 30 L 50 10 A 20 20 0 0 1 70 30 Z" fill="hsl(var(--primary))" opacity="0.3" />
                        <path d="M 50 30 L 70 30 A 20 20 0 0 1 50 50 Z" fill="hsl(var(--primary))" opacity="0.5" />
                        <path d="M 50 30 L 50 50 A 20 20 0 0 1 30 30 Z" fill="hsl(var(--primary))" opacity="0.7" />
                        <path d="M 50 30 L 30 30 A 20 20 0 0 1 50 10 Z" fill="hsl(var(--primary))" opacity="0.9" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">Již brzy...</div>
                     </div>
                  </div>
               </div>
            </AspectRatio>
         </div>
      </div>
   );
}
