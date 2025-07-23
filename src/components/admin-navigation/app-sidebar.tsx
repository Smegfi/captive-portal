"use server";

import { NavMain } from "@/components/admin-navigation/nav-main";
import { NavUser } from "@/components/admin-navigation/nav-user";
import { data } from "@/components/admin-navigation/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ComponentProps } from "react";

export async function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      redirect("/login");
   }

   const user = {
      name: session!.user.name,
      email: session!.user.email,
      avatar: session!.user.image ?? undefined,
   };

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                     <Link href="/admin" className="relative h-16 w-48">
                        <Image src="/logo.svg" alt="Logo" fill className="object-contain dark:invert" />
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={user} />
         </SidebarFooter>
      </Sidebar>
   );
}
