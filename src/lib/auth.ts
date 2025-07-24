import { db } from "@/db/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const timeSettings = {
   oneDay: 60 * 60 * 24, // = 86 400 seconds (one day)
};

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

   session: {
      expiresIn: timeSettings.oneDay,
      disableSessionRefresh: true,
   },
});

export type Session = typeof auth.$Infer.Session;
