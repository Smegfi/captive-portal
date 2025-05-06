"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {

  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard", "/test", "/admin/:path*"],
};