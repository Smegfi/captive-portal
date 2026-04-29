"use server";

import { authActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { listTosSchema } from "@/server/repositories/tos/schema";

/**
 * Stránkovaný seznam TOS dokumentů.
 */
export const listTos = authActionClient
   .inputSchema(listTosSchema)
   .outputSchema(actionResultSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
      const whereCondition = search ? or(ilike(tos.name, `%${search}%`), ilike(tos.fileName, `%${search}%`)) : undefined;

      const result = await db.query.tos.findMany({
         limit: itemsPerPage,
         offset: (page - 1) * itemsPerPage,
         where: whereCondition,
      });

      const total = await db.select({ value: count() }).from(tos).where(whereCondition);

      return {
         data: result,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });

/**
 * Vrátí aktivní TOS dokument, případně nejnovější jako fallback.
 */
export async function getActiveTosForGuest() {
   const activeTos = await db.query.tos.findFirst({
      where: eq(tos.isActive, true),
      orderBy: [desc(tos.uploadedAt)],
   });

   if (activeTos) {
      return activeTos;
   }

   return db.query.tos.findFirst({
      orderBy: [desc(tos.uploadedAt)],
   });
}
