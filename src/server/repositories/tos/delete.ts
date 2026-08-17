"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { isTosImmutable } from "@/lib/utils";
import { deleteTosSchema } from "@/server/repositories/tos/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

/**
 * Smaže TOS dokument včetně souboru na disku. Povoleno pouze u dokumentů, které
 * nebyly nikdy aktivovány; aktivovaný dokument nelze odstranit.
 */
export const deleteTos = adminActionClient.inputSchema(deleteTosSchema).action(async ({ parsedInput: { id } }) => {
   try {
      const existing = await db.query.tos.findFirst({ where: eq(tos.id, id) });

      if (!existing) {
         throw new Error("TOS dokument nebyl nalezen");
      }

      if (isTosImmutable(existing)) {
         throw new Error("Aktivovaný dokument nelze odstranit.");
      }

      await db.delete(tos).where(eq(tos.id, id));

      const absolutePath = path.resolve(UPLOADS_ROOT, existing.storagePath);
      if (absolutePath === UPLOADS_ROOT || absolutePath.startsWith(UPLOADS_ROOT + path.sep)) {
         await fs.promises.rm(absolutePath, { force: true });
      }

      revalidatePath("/admin/tos");
      revalidatePath("/");
      return { id };
   } catch (error) {
      console.log(error);
      returnValidationErrors(deleteTosSchema, {
         _errors: [(error as Error).message],
      });
   }
});
