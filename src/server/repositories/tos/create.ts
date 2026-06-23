"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { activateTosWithinTx } from "@/server/repositories/tos/activate-helper";
import { randomUUID } from "crypto";
import fs from "fs";
import mammoth from "mammoth";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import path from "path";
import { uploadTosSchema } from "@/server/repositories/tos/schema";

/**
 * Nahrání nového TOS dokumentu (DOCX). Dokument se ve výchozím stavu nahraje
 * jako neaktivní koncept; pokud je `setActive` zaškrtnuto, rovnou se aktivuje.
 */
export const uploadTos = authActionClient.inputSchema(uploadTosSchema).action(async ({ parsedInput: { name, fileName, fileSize, file, uploadedAt, setActive } }) => {
   try {
      const { fileUUID, storagePath, htmlOutput } = await convertAndUploadDocx(file, fileName);

      const result = await db.transaction(async (tx) => {
         const inserted = await tx
            .insert(tos)
            .values({ name, fileName, fileSize, fileUUID, storagePath, uploadedAt, isActive: false, htmlContent: htmlOutput })
            .returning();

         const row = inserted[0];

         if (setActive) {
            return activateTosWithinTx(tx, row.id, new Date());
         }

         return row;
      });

      revalidatePath("/admin/tos");
      revalidatePath("/");
      return result;
   } catch (error) {
      console.log(error);
      returnValidationErrors(uploadTosSchema, {
         _errors: [(error as Error).message],
      });
   }
});

async function convertAndUploadDocx(file: File, fileName: string) {
   const now = new Date();
   const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

   const fileUUID = randomUUID();

   const fileExtension = path.extname(fileName);
   if (!fileExtension || fileExtension.toLowerCase() !== ".docx") {
      throw new Error("Soubor musí mít rozšíření .docx");
   }

   const uniqueFileName = `${fileUUID}${fileExtension}`;

   // Stored outside of public/ because Next.js snapshots public/ at build time
   // and would not serve files written at runtime. Files are served via /api/files.
   const folderPath = path.join(process.cwd(), "uploads", "tos", yearMonth);

   if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
   }

   const filePath = path.join(folderPath, uniqueFileName);

   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   const { value: htmlOutput } = await mammoth.convertToHtml({ buffer });
   await fs.promises.writeFile(filePath, buffer);

   return {
      fileUUID,
      storagePath: path.posix.join("tos", yearMonth, uniqueFileName),
      htmlOutput,
   };
}
