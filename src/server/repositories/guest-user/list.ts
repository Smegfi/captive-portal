"use server";

import { reviewerActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { guestUser } from "@/server/db/schema/guest-user";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";
import { listGuestSchema } from "@/server/repositories/guest-user/schema";

/**
 * Stránkovaný seznam hostujících uživatelů (portál / admin).
 */
export const listGuestUser = reviewerActionClient
   .inputSchema(listGuestSchema)
   .outputSchema(actionResultSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search, email, marketing, createdFrom, createdTo } }) => {
      const offset = (page - 1) * itemsPerPage;
      const searchValue = search.trim();
      const emailValue = email.trim();
      const marketingValue = marketing?.trim();

      const filters = [
         searchValue ? ilike(guestUser.email, `%${searchValue}%`) : undefined,
         emailValue ? ilike(guestUser.email, `%${emailValue}%`) : undefined,
         marketingValue === "approved"
            ? eq(guestUser.marketingApproved, true)
            : marketingValue === "not-approved"
              ? eq(guestUser.marketingApproved, false)
              : undefined,
         createdFrom ? gte(guestUser.createdAt, createdFrom) : undefined,
         createdTo ? lte(guestUser.createdAt, createdTo) : undefined,
      ].filter((condition) => condition !== undefined);

      const whereCondition = filters.length > 0 ? and(...filters) : undefined;

      const guestUsers = await db.query.guestUser.findMany({
         limit: itemsPerPage,
         offset,
         where: whereCondition,
         with: {
            acceptedTos: {
               columns: {
                  id: true,
                  name: true,
               },
            },
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
         .where(whereCondition);

      return {
         data: guestUsers,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
