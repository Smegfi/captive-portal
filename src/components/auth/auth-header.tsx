import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export function AuthHeader() {
   return (
      <div className="w-full flex justify-between items-center gap-2">
         <Link href="/" className="relative h-16 w-48">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain dark:invert" />
         </Link>
         <ThemeToggle />
      </div>
   );
}
