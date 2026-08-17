import { FileText, LayoutDashboard, Monitor, Network, Radio, Settings, Users } from "lucide-react";

export const data = {
   navMain: [
      {
         title: "Přehled",
         url: "/admin",
         icon: LayoutDashboard,
         roles: ["admin", "reviewer"],
      },
      {
         title: "Připojení",
         url: "/admin/connection",
         icon: Radio,
         roles: ["admin"],
      },
      {
         title: "Sítě",
         url: "/admin/networks",
         icon: Network,
         roles: ["admin"],
      },
      {
         title: "Uživatelé",
         url: "/admin/users",
         icon: Users,
         roles: ["admin", "reviewer"],
      },
      {
         title: "Zařízení",
         url: "/admin/devices",
         icon: Monitor,
         roles: ["admin"],
      },
      {
         title: "TOS",
         url: "/admin/tos",
         icon: FileText,
         roles: ["admin"],
      },
      {
         title: "Nastavení",
         url: "/admin/settings",
         icon: Settings,
         roles: ["admin"],
      },
   ],
};
