"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { setActiveTosSchema } from "@/server/repositories/tos/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Nastaví vybraný TOS dokument jako aktivní a ostatní deaktivuje.
 */
export const setActiveTos = adminActionClient.inputSchema(setActiveTosSchema).action(async ({ parsedInput: { id } }) => {
   const updatedTos = await db.transaction(async (tx) => {
      await tx.update(tos).set({ isActive: false }).where(eq(tos.isActive, true));
      const updated = await tx.update(tos).set({ isActive: true }).where(eq(tos.id, id)).returning();
      return updated[0] ?? null;
   });

   revalidatePath("/admin/tos");
   revalidatePath("/");

   return updatedTos;
});
