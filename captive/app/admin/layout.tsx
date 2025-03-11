import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitchPopover } from "@/components/themes/theme-switch";
import { ThemeProvider } from "@/components/themes/theme-provider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Captive portál - Praha 10",
   description: "by smegfi",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html>
         <body suppressHydrationWarning className={geistSans.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
               <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                     <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                           <SidebarTrigger className="-ml-1" />
                           <Separator
                              orientation="vertical"
                              className="mr-2 data-[orientation=vertical]:h-4"
                           />
                           <ThemeSwitchPopover />
                        </div>
                     </header>
                     <main>{children}</main>
                  </SidebarInset>
               </SidebarProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
