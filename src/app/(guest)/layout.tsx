import { ThemeProvider } from "@/components/theme-provider";
import "@public/globals.css";
import type { Metadata } from "next";

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
                  {children}
               </ThemeProvider>
            </body>
         </html>
      </>
   );
}
