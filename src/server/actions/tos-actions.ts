"use server";

import { authActionClient } from "@/lib/safe-action";
import { listTosSchema, uploadTosSchema } from "@/server/actions-scheme/tos/schema";
import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const listTosAction = authActionClient.inputSchema(listTosSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const result = await db.query.tos.findMany({
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      where: search ? or(ilike(tos.name, `%${search}%`), ilike(tos.fileName, `%${search}%`)) : undefined,
   });

   return result;
});

export const uploadTosAction = authActionClient.inputSchema(uploadTosSchema).action(async ({ parsedInput: { name, fileName, fileSize, uploadedAt } }) => {
   const result = await db.insert(tos).values({ name, fileName, fileSize, uploadedAt }).returning();

   revalidatePath("/admin/tos");

   return result[0];
});
