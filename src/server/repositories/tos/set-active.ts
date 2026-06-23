"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { activateTosWithinTx } from "@/server/repositories/tos/activate-helper";
import { setActiveTosSchema } from "@/server/repositories/tos/schema";
import { revalidatePath } from "next/cache";

/**
 * Nastaví vybraný TOS dokument jako aktivní, archivuje předchozí aktivní dokument
 * a přiřadí novou verzi. Aktivace je nevratná – dokument se stane neměnným.
 */
export const setActiveTos = adminActionClient.inputSchema(setActiveTosSchema).action(async ({ parsedInput: { id } }) => {
   const updatedTos = await db.transaction(async (tx) => {
      return activateTosWithinTx(tx, id, new Date());
   });

   revalidatePath("/admin/tos");
   revalidatePath("/");

   return updatedTos;
});
