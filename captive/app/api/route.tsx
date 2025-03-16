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

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const post = searchParams.get("post");
   const magic = searchParams.get("magic");
   return NextResponse.json({ post, magic });
}