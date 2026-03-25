"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";

/**
 * Vrací seznam všech sítí
 */
export const listNetwork = authActionClient.action(async () => {
   const result = await db.query.network.findMany();

   return result;
});
