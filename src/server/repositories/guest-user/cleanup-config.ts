"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { guestUserCleanupConfig } from "@/server/db/schema/guest-user-cleanup-config";
import { updateGuestUserCleanupConfigSchema } from "@/server/repositories/guest-user/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const DEFAULT_GUEST_USER_RETENTION_MONTHS = 6;

async function getOrCreateCleanupConfigRecord() {
   const existingConfig = await db.query.guestUserCleanupConfig.findFirst({
      orderBy: (table, { desc }) => [desc(table.id)],
   });

   if (existingConfig) {
      return existingConfig;
   }

   const now = new Date();
   const createdConfig = await db
      .insert(guestUserCleanupConfig)
      .values({
         retentionMonths: DEFAULT_GUEST_USER_RETENTION_MONTHS,
         createdAt: now,
         updatedAt: now,
      })
      .returning();

   return createdConfig[0];
}

export async function getGuestUserCleanupRetentionMonths() {
   const config = await getOrCreateCleanupConfigRecord();
   return config.retentionMonths;
}

/**
 * Načtení konfigurace automatického mazání guest uživatelů.
 */
export const getGuestUserCleanupConfig = adminActionClient.action(async () => {
   const retentionMonths = await getGuestUserCleanupRetentionMonths();
   return {
      retentionMonths,
   };
});

/**
 * Uložení konfigurace automatického mazání guest uživatelů.
 */
export const updateGuestUserCleanupConfig = adminActionClient
   .inputSchema(updateGuestUserCleanupConfigSchema)
   .action(async ({ parsedInput: { retentionMonths } }) => {
      const existingConfig = await getOrCreateCleanupConfigRecord();

      const updatedConfig = await db
         .update(guestUserCleanupConfig)
         .set({
            retentionMonths,
            updatedAt: new Date(),
         })
         .where(eq(guestUserCleanupConfig.id, existingConfig.id))
         .returning();

      revalidatePath("/admin/settings");

      return {
         retentionMonths: updatedConfig[0].retentionMonths,
      };
   });
