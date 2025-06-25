"use client";

import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd, LayoutDashboard, MonitorSmartphone, Network, Users } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar";

const data = {
   navMain: [
      {
         title: "Dashboard",
         url: "/admin/dashboard",
         icon: LayoutDashboard,
         isActive: true,
      },
      {
         title: "Sítě",
         url: "/admin/networks",
         icon: Network,
      },
      {
         title: "Uživatelé",
         url: "/admin/users",
         icon: Users,
      },
      {
         title: "Zařízení",
         url: "/admin/devices",
         icon: MonitorSmartphone,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="icon" {...props}>
         <SidebarHeader>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
               <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
               </div>
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Praha 10</span>
                  <span className="truncate text-xs">Captive portál</span>
               </div>
               <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   );
}
