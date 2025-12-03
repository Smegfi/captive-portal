import { FileText, LayoutDashboard, Monitor, Network, Radio, Settings, Users } from "lucide-react";

export const data = {
   navMain: [
      {
         title: "Dashboard",
         url: "/admin",
         icon: LayoutDashboard,
      },
      {
         title: "Připojení",
         url: "/admin/connection",
         icon: Radio,
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
         title: "TOS",
         url: "/admin/tos",
         icon: FileText,
      },
      {
         title: "Nastavení",
         url: "/admin/settings",
         icon: Settings,
      },
   ],
};
