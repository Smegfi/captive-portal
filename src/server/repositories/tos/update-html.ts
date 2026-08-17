"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { isTosImmutable } from "@/lib/utils";
import { updateTosHtmlSchema } from "@/server/repositories/tos/schema";
import { eq } from "drizzle-orm";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";

/**
 * Aktualizuje HTML obsah TOS dokumentu. Povoleno pouze u dokumentů, které
 * nebyly nikdy aktivovány (neaktivované koncepty); aktivované dokumenty jsou
 * neměnné.
 */
export const updateTosHtml = adminActionClient.inputSchema(updateTosHtmlSchema).action(async ({ parsedInput: { id, htmlContent } }) => {
   try {
      const existing = await db.query.tos.findFirst({ where: eq(tos.id, id) });

      if (!existing) {
         throw new Error("TOS dokument nebyl nalezen");
      }

      if (isTosImmutable(existing)) {
         throw new Error("Aktivovaný dokument je neměnný a jeho obsah nelze upravit. Vytvořte jeho kopii.");
      }

      const updated = await db.update(tos).set({ htmlContent }).where(eq(tos.id, id)).returning();

      revalidatePath("/admin/tos");
      return updated[0];
   } catch (error) {
      console.log(error);
      returnValidationErrors(updateTosHtmlSchema, {
         _errors: [(error as Error).message],
      });
   }
});
