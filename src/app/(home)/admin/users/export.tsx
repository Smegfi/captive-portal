import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";

interface UsersExportButtonProps {
   searchParams: {
      page?: string;
      pageSize?: string;
      items?: string;
      search?: string;
      email?: string;
      marketing?: string;
      createdFrom?: string;
      createdTo?: string;
   };
}

function buildExportHref(searchParams: UsersExportButtonProps["searchParams"]): string {
   const params = new URLSearchParams();

   Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
         params.set(key, value);
      }
   });

   const query = params.toString();
   return query ? `/api/admin/users/export?${query}` : "/api/admin/users/export";
}

export default function UsersExportButton({ searchParams }: UsersExportButtonProps) {
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
