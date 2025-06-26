import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavMainProps {
   items: {
      title: string;
      url: string;
      icon?: LucideIcon;
   }[];
}

export function NavMain({ items }: NavMainProps) {
   return (
      <SidebarGroup>
         <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
               {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton tooltip={item.title} asChild>
                        <Link href={item.url}>
                           {item.icon && <item.icon />}
                           <span>{item.title}</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
