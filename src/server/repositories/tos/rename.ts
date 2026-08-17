"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { isTosImmutable } from "@/lib/utils";
import { renameTosSchema } from "@/server/repositories/tos/schema";
import { eq } from "drizzle-orm";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";

/**
 * Přejmenuje TOS dokument. Povoleno pouze u dokumentů, které nebyly nikdy
 * aktivovány (neaktivované koncepty); aktivované dokumenty jsou neměnné.
 */
export const renameTos = adminActionClient.inputSchema(renameTosSchema).action(async ({ parsedInput: { id, name } }) => {
   try {
      const existing = await db.query.tos.findFirst({ where: eq(tos.id, id) });

      if (!existing) {
         throw new Error("TOS dokument nebyl nalezen");
      }

      if (isTosImmutable(existing)) {
         throw new Error("Aktivovaný dokument je neměnný a nelze jej přejmenovat. Vytvořte jeho kopii.");
      }

      const updated = await db.update(tos).set({ name }).where(eq(tos.id, id)).returning();

      revalidatePath("/admin/tos");
      return updated[0];
   } catch (error) {
      console.log(error);
      returnValidationErrors(renameTosSchema, {
         _errors: [(error as Error).message],
      });
   }
});
