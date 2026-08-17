"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { network } from "@/server/db/schema/network";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { removeNetworkSchema } from "@/server/repositories/network/schema";

/**
 * Odstranění wifi sítě
 */
export const removeNetwork = authActionClient.inputSchema(removeNetworkSchema).action(async ({ parsedInput: { id } }) => {
   const result = await db.delete(network).where(eq(network.id, id)).returning();

   revalidatePath("/admin/networks");

   return result[0];
});
