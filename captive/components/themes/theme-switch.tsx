"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitchPopover() {
   const { setTheme } = useTheme();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
               <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
               <span className="sr-only">Toggle theme</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export function ThemeSwitch() {
   const { theme, setTheme } = useTheme();
   if (theme === "dark") {
      return (
         <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
            <Sun className="h-4 w-4" />
         </Button>
      );
   } else {
      return (
         <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
            <Moon className="h-4 w-4" />
         </Button>
      );
   }
}
