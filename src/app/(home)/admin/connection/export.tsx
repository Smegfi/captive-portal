import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";

interface ConnectionExportButtonProps {
   searchParams: {
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      mac?: string;
      network?: string;
      user?: string;
      updatedFrom?: string;
      updatedTo?: string;
   };
}

function buildExportHref(searchParams: ConnectionExportButtonProps["searchParams"]): string {
   const params = new URLSearchParams();

   Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
         params.set(key, value);
      }
   });

   const query = params.toString();
   return query ? `/api/admin/connections/export?${query}` : "/api/admin/connections/export";
}

export default function ConnectionExportButton({ searchParams }: ConnectionExportButtonProps) {
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
