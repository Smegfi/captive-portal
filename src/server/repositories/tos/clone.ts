"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { cloneTosSchema } from "@/server/repositories/tos/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import fs from "fs";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

/**
 * Vytvoří kopii existujícího TOS dokumentu jako nový neaktivní (a tedy
 * upravitelný a smazatelný) koncept. Zkopíruje i soubor na disku.
 */
export const cloneTos = adminActionClient.inputSchema(cloneTosSchema).action(async ({ parsedInput: { id } }) => {
   try {
      const source = await db.query.tos.findFirst({ where: eq(tos.id, id) });

      if (!source) {
         throw new Error("TOS dokument nebyl nalezen");
      }

      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const fileUUID = randomUUID();
      const fileExtension = path.extname(source.fileName) || ".docx";
      const uniqueFileName = `${fileUUID}${fileExtension}`;

      const folderPath = path.join(UPLOADS_ROOT, "tos", yearMonth);
      if (!fs.existsSync(folderPath)) {
         await fs.promises.mkdir(folderPath, { recursive: true });
      }

      const sourceAbsolutePath = path.resolve(UPLOADS_ROOT, source.storagePath);
      const destinationAbsolutePath = path.join(folderPath, uniqueFileName);
      await fs.promises.copyFile(sourceAbsolutePath, destinationAbsolutePath);

      const storagePath = path.posix.join("tos", yearMonth, uniqueFileName);

      const inserted = await db
         .insert(tos)
         .values({
            name: `${source.name} (kopie)`,
            fileName: source.fileName,
            fileSize: source.fileSize,
            fileUUID,
            storagePath,
            uploadedAt: now,
            isActive: false,
            htmlContent: source.htmlContent,
         })
         .returning();

      revalidatePath("/admin/tos");
      return inserted[0];
   } catch (error) {
      console.log(error);
      returnValidationErrors(cloneTosSchema, {
         _errors: [(error as Error).message],
      });
   }
});
