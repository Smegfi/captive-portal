"use client";

import { Button } from "@/components/ui/button";
import { VscAzure } from "react-icons/vsc";

export default function AzureButton() {
   return (
      <Button type="submit" className="w-full mt-4" size="lg" variant="outline">
         <VscAzure />
         Přihlásit pomocí Azure
      </Button>
   );
}