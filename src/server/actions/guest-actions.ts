"use server";

import { db } from "@/db/db";
import { guestUser } from "@/db/schema/guest-user";
import { authActionClient } from "@/lib/safe-action";
import { guestLoginSchema, listGuestSchema } from "@/server/actions-scheme/guest-user/schema";
import { eq, ilike } from "drizzle-orm";

export const guestLoginAction = authActionClient.inputSchema(guestLoginSchema).action(async ({ parsedInput: { email, marketingApproved } }) => {
   const existingGuest = await db.select().from(guestUser).where(eq(guestUser.email, email));

   if (existingGuest.length > 0) {
      return existingGuest[0];
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

export const listGuestUserAction = authActionClient.inputSchema(listGuestSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
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

/**
 * Tuto cestu volá Fortigate pomocí HTTP 301 redirectu
 * Fortigate request example
 * https://srv-captive/?
 * post=http://192.168.30.1:1000/fgtauth&
 * magic=040d028c9aaae999&
 * usermac=60:03:08:8f:5e:b6&
 * apmac=08:5b:0e:08:d4:ee&
 * apip=192.168.30.41&
 * ssid=test&
 * apname=FWF60D4613003326&
 * bssid=00:00:00:00:00:00
 */
