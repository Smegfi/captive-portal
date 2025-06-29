"use server";

import { db } from "@/db/db";
import { actionClient } from "@/lib/safe-action";
import { guestLoginSchema, listGuestSchema } from "@/server/actions-scheme/guest-user/schema";
import { guestUser } from "@/db/schema/guest-user";
import { eq, ilike } from "drizzle-orm";
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

export const listGuestUserAction = actionClient.inputSchema(listGuestSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const offset = (page - 1) * itemsPerPage;

   const guestUsers = await db.query.guestUser.findMany({
      limit: itemsPerPage,
      offset,
      where: ilike(guestUser.email, `%${search}%`),
      with: {
         devices: {
            columns: {
               id: true,
            },
         },
      },
   });

   return guestUsers;
});
