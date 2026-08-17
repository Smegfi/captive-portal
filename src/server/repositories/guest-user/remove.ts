"use server";

import { adminActionClient } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { connection } from "@/server/db/schema/connection";
import { device } from "@/server/db/schema/device";
import { guestUser } from "@/server/db/schema/guest-user";
import { removeGuestUserSchema } from "@/server/repositories/guest-user/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Odstranění guest uživatele včetně jeho zařízení a připojení.
 */
export async function removeGuestUserCascade(id: number) {
   return db.transaction(async (tx) => {
      const userDevices = await tx
         .select({
            id: device.id,
         })
         .from(device)
         .where(eq(device.userId, id));

      if (userDevices.length > 0) {
         const deviceIds = userDevices.map((item) => item.id);
         await tx.delete(connection).where(inArray(connection.deviceId, deviceIds));
         await tx.delete(device).where(inArray(device.id, deviceIds));
      }

      const removedUsers = await tx.delete(guestUser).where(eq(guestUser.id, id)).returning();
      return removedUsers[0] ?? null;
   });
}

export const removeGuestUser = adminActionClient.inputSchema(removeGuestUserSchema).action(async ({ parsedInput: { id } }) => {
   const deletedUser = await removeGuestUserCascade(id);

   revalidatePath("/admin/users");
   revalidatePath("/admin/devices");
   revalidatePath("/admin/connection");

   return deletedUser;
});
