"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { network } from "@/server/db/schema/network";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { updateNetworkSchema } from "@/server/repositories/network/schema";

/**
 * Aktualizace wifi sítě
 */
export const updateNetwork = authActionClient.inputSchema(updateNetworkSchema).action(async ({ parsedInput: { id, name, ssid, isActive } }) => {
   const result = await db.update(network).set({ name, ssid, isActive, updatedAt: new Date() }).where(eq(network.id, id)).returning();

   revalidatePath("/admin/networks");

   return result[0];
});
