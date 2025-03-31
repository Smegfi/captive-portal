import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

const securedRoutes = ["/admin", "/admin/users", "/admin/devices"];

export const { handlers, signIn, signOut, auth } = NextAuth({
   providers: [
      Credentials({
         async authorize(credentials) {
            throw new Error("Not implemented");
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async authorized({ request, auth }) {
         if (securedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
            if (!auth) {
               return NextResponse.redirect(new URL("/login", request.url));
            }
         }
         return NextResponse.next();
      },
   },
});
