import { db } from "@/db/db";
import { ForbiddenError, UnauthorizedError } from "@/lib/safe-action";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: "pg",
   }),
   secret: process.env.BETTER_AUTH_SECRET,
   url: process.env.BETTER_AUTH_URL,

   emailAndPassword: {
      enabled: true,
      autoVerifyEmail: true,
      verifyEmail: {
         enabled: false,
      },
   },

   user: {
      additionalFields: {
         role: {
            type: "string",
            required: true,
            default: "user",
         },
      },
   },
});

export type Session = typeof auth.$Infer.Session;

/**
 * Zkontroluje, zda má uživatel oprávnění k danému obsahu
 * @param role - Role, kterou chceme zkontrolovat
 * @throws Error pokud uživatel nemá oprávnění
 */
export async function checkUserRole(role: string) {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (session === null) {
      throw new UnauthorizedError("Není příhlášen žádný uživatel");
   }

   if (session.user.role !== role) {
      throw new ForbiddenError("Nemáte oprávnění k tomuto obsahu");
   }
}
