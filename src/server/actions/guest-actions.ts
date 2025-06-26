"use server";

import { db } from "@/db/db";
import { actionClient } from "@/lib/safe-action";
import { guestLoginSchema } from "@/server/actions-scheme/guest-user/schema";
import { guestUser } from "@/db/schema/guest-user";
import { eq } from "drizzle-orm";
import { returnValidationErrors } from "next-safe-action";

export const guestLoginAction = actionClient.inputSchema(guestLoginSchema).action(async ({ parsedInput: { email, marketingApproved } }) => {
   const existingGuest = await db.select().from(guestUser).where(eq(guestUser.email, email));

   if (existingGuest.length > 0) {
      returnValidationErrors(guestLoginSchema, {
         email: {
            _errors: ["Tento email již existuje."],
         },
      });
   }

   const guestLogin = await db
      .insert(guestUser)
      .values({
         email,
         marketingApproved,
         createdAt: new Date(),
         updatedAt: new Date(),
      })
      .returning();

   return guestLogin[0];
});
