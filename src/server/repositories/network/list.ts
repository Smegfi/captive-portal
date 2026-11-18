"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { network } from "@/server/db/schema/network";

/**
 * Vrací seznam všech sítí
 */
export const listNetwork = authActionClient.action(async () => {
   return db.select().from(network);
});
