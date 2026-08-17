"use server";

import { db } from "@/server/db/db";
import { network } from "@/server/db/schema/network";
import { authActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { createNetworkSchema } from "@/server/repositories/network/schema";

/**
 * Vytvoření nové wifi sítě
 */
export const createNetwork = authActionClient.inputSchema(createNetworkSchema).action(async ({ parsedInput: { name, ssid, isActive } }) => {
   const result = await db
      .insert(network)
      .values({
         name,
         ssid,
         isActive,
         createdAt: new Date(),
         updatedAt: new Date(),
      })
      .returning();

   revalidatePath("/admin/networks");

   return result[0];
});
