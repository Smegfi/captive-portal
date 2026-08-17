import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";

interface DevicesExportButtonProps {
   searchParams: {
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      mac?: string;
      user?: string;
      device?: string;
      connectedFrom?: string;
      connectedTo?: string;
   };
}

function buildExportHref(searchParams: DevicesExportButtonProps["searchParams"]): string {
   const params = new URLSearchParams();

   Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
         params.set(key, value);
      }
   });

   const query = params.toString();
   return query ? `/api/admin/devices/export?${query}` : "/api/admin/devices/export";
}

export default function DevicesExportButton({ searchParams }: DevicesExportButtonProps) {
   const exportHref = buildExportHref(searchParams);

   return (
      <Button asChild>
         <Link href={exportHref}>
            <FileDown />
            <span>Exportovat</span>
         </Link>
      </Button>
   );
}
