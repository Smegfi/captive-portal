import { LayoutDashboard, Monitor, Network, Settings, Users } from "lucide-react";

export const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
   navMain: [
      {
         title: "Dashboard",
         url: "/admin",
         icon: LayoutDashboard,
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
         icon: Monitor,
      },
      {
         title: "Nastavení",
         url: "/admin/settings",
         icon: Settings,
      },
   ],
};
