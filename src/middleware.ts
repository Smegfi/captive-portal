import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
 
	if (!sessionCookie) {		
        const url = new URL("/login", request.url);
        url.searchParams.set("redirectTo", request.nextUrl.pathname);
    
        return NextResponse.redirect(url);
	}
 
	return NextResponse.next();
}
 
export const config = {
  matcher: ["/dashboard", "/test", "/admin/:path*"],
};