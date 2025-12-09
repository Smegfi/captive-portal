"use server";

import { authActionClient } from "@/lib/safe-action";
import { listTosSchema, uploadTosSchema } from "@/server/actions-scheme/tos/schema";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { randomUUID } from "crypto";
import { ilike, or } from "drizzle-orm";
import fs from "fs";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import path from "path";

export const listTosAction = authActionClient.inputSchema(listTosSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const result = await db.query.tos.findMany({
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      where: search ? or(ilike(tos.name, `%${search}%`), ilike(tos.fileName, `%${search}%`)) : undefined,
   });

   return result;
});

export const uploadTosAction = authActionClient.inputSchema(uploadTosSchema).action(async ({ parsedInput: { name, fileName, fileSize, file, uploadedAt } }) => {
   try {
      const fileUrl = await uploadFileToLocalStorage(file, fileName);
      const result = await db.insert(tos).values({ name, fileName, fileSize, fileUrl, uploadedAt }).returning();
      revalidatePath("/admin/tos");
      return result[0];
   } catch (error) {
      console.log(error);
      returnValidationErrors(uploadTosSchema, {
         _errors: [(error as Error).message],
      });
   }
});

async function uploadFileToLocalStorage(file: File, fileName: string) {
   // Get current date in yyyy-MM format
   const now = new Date();
   const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

   // Generate unique identifier
   const uniqueId = randomUUID();

   // Preserve file extension
   const fileExtension = path.extname(fileName);
   if (!fileExtension || fileExtension !== ".pdf") {
      throw new Error("Soubor musí mít rozšíření .pdf");
   }

   const uniqueFileName = `${uniqueId}${fileExtension}`;

   // Create folder path
   const folderPath = path.join(process.cwd(), "public", "tos", yearMonth);

   // Create folder if it doesn't exist
   if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
   }

   // Create full file path
   const filePath = path.join(folderPath, uniqueFileName);

   // Convert File to Buffer and write
   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   await fs.promises.writeFile(filePath, buffer);

   // Return relative path for URL (e.g., "/tos/2024-01/uuid-filename.ext")
   return path.join("/tos", yearMonth, uniqueFileName).replace(/\\/g, "/");
}
