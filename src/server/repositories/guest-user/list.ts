"use server";

import { reviewerActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { guestUser } from "@/server/db/schema/guest-user";
import { count, ilike } from "drizzle-orm";
import { listGuestSchema } from "@/server/repositories/guest-user/schema";

/**
 * Stránkovaný seznam hostujících uživatelů (portál / admin).
 */
export const listGuestUser = reviewerActionClient
   .inputSchema(listGuestSchema)
   .outputSchema(actionResultSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
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

      const total = await db
         .select({ value: count() })
         .from(guestUser)
         .where(ilike(guestUser.email, `%${search}%`));

      return {
         data: guestUsers,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
