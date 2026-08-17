"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { network } from "@/server/db/schema/network";
import { eq } from "drizzle-orm";
import { getNetworkSchema } from "@/server/repositories/network/schema";

/**
 * Získání wifi sítě podle ID
 */
export const getNetwork = authActionClient.inputSchema(getNetworkSchema).action(async ({ parsedInput: { id } }) => {
   const result = await db.select().from(network).where(eq(network.id, id));

   return result[0];
});
