// Tuto cestu volá Fortigate pomocí HTTP 301 redirectu
// Fortigate request example
// https://srv-captive/?
// post=http://192.168.30.1:1000/fgtauth&
// magic=040d028c9aaae999&
// usermac=60:03:08:8f:5e:b6&
// apmac=08:5b:0e:08:d4:ee&
// apip=192.168.30.41&
// ssid=test&
// apname=FWF60D4613003326&
// bssid=00:00:00:00:00:00

// EXAMPLE: http://localhost:3000/api?post=http://192.168.30.1:1000/fgtauth&magic=040d028c9aaae999&usermac=60:03:08:8f:5e:b6&apmac=08:5b:0e:08:d4:ee&apip=192.168.30.41&ssid=test&apname=FWF60D4613003326&bssid=00:00:00:00:00:00

import { DeviceType, FortigateRequestType } from "@/server/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;

   try{
      const data = loadDataFromRequest(searchParams);

      const device: DeviceType = {
         deviceName: "test",         
         mac: data.usermac,
         createdAt: new Date().toISOString(),
      }

      return NextResponse.json(data);
   }
   catch(error){
      const parsedError = error as Error;
      return NextResponse.json({ error: parsedError.message }, { status: 400 });
   }
}

function loadDataFromRequest(serachParameters: URLSearchParams): FortigateRequestType {
   const post = serachParameters.get("post");
   const magic = serachParameters.get("magic");
   const usermac = serachParameters.get("usermac");
   const apmac = serachParameters.get("apmac");
   const apip = serachParameters.get("apip");
   const ssid = serachParameters.get("ssid");
   const apname = serachParameters.get("apname");
   const bssid = serachParameters.get("bssid");

   if (!post || !magic || !usermac || !apmac || !apip || !ssid || !apname || !bssid) {
      throw new Error("Chybí povinný parametr");
   }
   
   // Vytvoříme objekt s požadovanými parametry
   const data: FortigateRequestType = {
      post,
      magic,
      usermac,
      apmac,
      apip,
      ssid,
      apname,
      bssid,
   }

   return data;
}