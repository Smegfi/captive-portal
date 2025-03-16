"use client";

import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen, Bot, Frame, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
import Link from "next/link";
import * as React from "react";

// This is sample data.
const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
   navMain: [
      {
         title: "Zařízení",
         url: "/admin/devices",
         icon: SquareTerminal,
         isActive: true,
      },
      {
         title: "Uživatelé",
         url: "/admin/users",
         icon: Bot,
      },
      {
         title: "Dokumentace",
         url: "/admin/docs",
         icon: BookOpen,
      },
      {
         title: "Nastavení",
         url: "/admin/settings",
         icon: Settings2,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="icon" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                     <Link href={"/admin"}>
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                           <Bot className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-medium">Captive portál</span>
                           <span className="truncate text-xs">Praha 10</span>
                        </div>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   );
}
