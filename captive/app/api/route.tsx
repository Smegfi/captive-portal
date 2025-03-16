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

import { DeviceType, devices, FortigateRequestType } from "@/server/data";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/database";
import { devicesTable, networksTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
   const devices = await db.query.devicesTable.findMany();
   return NextResponse.json(devices);
}

export async function POST(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;

   try {
      const data = loadDataFromRequest(searchParams);

      const resultId = await db.insert(devicesTable).values({
         mac: data.usermac,
         createdAt: new Date(),
      }).returning({id: devicesTable.id});

      let networkId = await db.select({id: networksTable.id}).from(networksTable).where(eq(networksTable.ssid, data.ssid));

      if (!networkId) {
         const newNetworkId = await db.insert(networksTable).values({
            name: data.ssid,
            ssid: data.ssid,
            createdAt: new Date(),
         }).returning({id: networksTable.id});

         networkId = newNetworkId; 
      }         

      return NextResponse.json({ newDeviceId: resultId, connectedNetworkId: networkId });
   } catch (error) {
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
   };

   return data;
}
