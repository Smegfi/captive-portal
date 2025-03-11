import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
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
               <main>{children}</main>
            </ThemeProvider>
         </body>
      </html>
   );
}
