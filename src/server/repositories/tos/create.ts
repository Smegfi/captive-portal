"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { randomUUID } from "crypto";
import fs from "fs";
import mammoth from "mammoth";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import path from "path";
import { uploadTosSchema } from "@/server/repositories/tos/schema";
import { eq } from "drizzle-orm";

/**
 * Nahrání nového TOS dokumentu (DOCX).
 */
export const uploadTos = authActionClient.inputSchema(uploadTosSchema).action(async ({ parsedInput: { name, fileName, fileSize, file, uploadedAt } }) => {
   try {
      const { fileUrl, htmlOutput } = await convertAndUploadDocx(file, fileName);

      const result = await db.transaction(async (tx) => {
         await tx.update(tos).set({ isActive: false }).where(eq(tos.isActive, true));
         const inserted = await tx
            .insert(tos)
            .values({ name, fileName, fileSize, fileUrl, uploadedAt, isActive: true, htmlContent: htmlOutput })
            .returning();
         return inserted;
      });

      revalidatePath("/admin/tos");
      revalidatePath("/");
      return result[0];
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

   const uniqueId = randomUUID();

   const fileExtension = path.extname(fileName);
   if (!fileExtension || fileExtension.toLowerCase() !== ".docx") {
      throw new Error("Soubor musí mít rozšíření .docx");
   }

   const uniqueFileName = `${uniqueId}${fileExtension}`;

   const folderPath = path.join(process.cwd(), "public", "tos", yearMonth);

   if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
   }

   const filePath = path.join(folderPath, uniqueFileName);

   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   const { value: htmlOutput } = await mammoth.convertToHtml({ buffer });
   await fs.promises.writeFile(filePath, buffer);

   return {
      fileUrl: path.join("/tos", yearMonth, uniqueFileName).replace(/\\/g, "/"),
      htmlOutput,
   };
}
