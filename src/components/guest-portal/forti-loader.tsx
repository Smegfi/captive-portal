"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function FortiLoader() {
   const searchParams = useSearchParams();
   const form = useFormContext();

   useEffect(() => {
      const post = searchParams.get("post"); // Adresa pro redirect
      const magic = searchParams.get("magic"); // Magic token
      const usermac = searchParams.get("usermac"); // MAC address of the user
      const apmac = searchParams.get("apmac"); // MAC address of the access point
      const apip = searchParams.get("apip"); // IP address of the access point
      const ssid = searchParams.get("ssid"); // SSID of the access point
      const apname = searchParams.get("apname"); // Name of the access point
      const bssid = searchParams.get("bssid"); // BSSID of the access point

      if (magic && usermac) {
         form.setValue("connection.usermac", usermac);
         form.setValue("connection.magic", magic);
         form.setValue("connection.post", post);
         form.setValue("connection.apmac", apmac);
         form.setValue("connection.apip", apip);
         form.setValue("connection.ssid", ssid);
         form.setValue("connection.apname", apname);
         form.setValue("connection.bssid", bssid);
      }

      console.log("connection", form.getValues("connection"));
   }, [searchParams, form]);

   return null;
}
