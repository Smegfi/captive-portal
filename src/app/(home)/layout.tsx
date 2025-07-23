import { AppSidebar } from "@/components/admin-navigation/app-sidebar";
import { SiteHeader } from "@/components/admin-navigation/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "@public/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "Praha 10 - Captive Portal",
   description: "Praha 10 - Captive Portal",
};

interface RootLayoutProps {
   children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
   return (
      <>
         <html lang="en" suppressHydrationWarning>
            <head />
            <body>
               <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <SidebarProvider
                     style={
                        {
                           "--sidebar-width": "calc(var(--spacing) * 72)",
                           "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                     }
                  >
                     <AppSidebar variant="inset" />
                     <SidebarInset>
                        <SiteHeader />
                        <div className="p-4">{children}</div>
                     </SidebarInset>
                  </SidebarProvider>
               </ThemeProvider>
            </body>
         </html>
      </>
   );
}
