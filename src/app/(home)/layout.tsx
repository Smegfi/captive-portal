import type { Metadata } from "next";
import "@public/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/admin-navigation/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-navigation/app-sidebar";

export const metadata: Metadata = {
   title: "Praha 10 - Captive Portal",
   description: "Praha 10 - Captive Portal",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
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
