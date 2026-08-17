"use server";

import { db } from "@/server/db/db";
import { guestUser } from "@/server/db/schema/guest-user";
import { removeGuestUserCascade } from "@/server/repositories/guest-user/remove";
import { lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function subtractMonths(baseDate: Date, months: number): Date {
   const threshold = new Date(baseDate);
   threshold.setMonth(threshold.getMonth() - months);
   return threshold;
}

/**
 * Smaže guest uživatele starší než zadaný počet měsíců podle updatedAt.
 */
export async function runGuestUserCleanup(retentionMonths: number) {
   const thresholdDate = subtractMonths(new Date(), retentionMonths);

   const usersToDelete = await db
      .select({
         id: guestUser.id,
      })
      .from(guestUser)
      .where(lte(guestUser.updatedAt, thresholdDate));

   let deletedCount = 0;

   for (const userEntry of usersToDelete) {
      const deletedUser = await removeGuestUserCascade(userEntry.id);
      if (deletedUser) {
         deletedCount += 1;
      }
   }

   if (deletedCount > 0) {
      revalidatePath("/admin/users");
      revalidatePath("/admin/devices");
      revalidatePath("/admin/connection");
   }

   return {
      deletedCount,
      thresholdDate,
   };
}
