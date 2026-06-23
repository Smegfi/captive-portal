"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { removeAppUserSchema } from "@/server/repositories/app-user/schema";

/**
 * Smazání aplikačního uživatele (včetně relací a účtů). Akci nelze vrátit zpět.
 */
export const removeAppUser = adminActionClient.inputSchema(removeAppUserSchema).action(async ({ parsedInput }) => {
   const response = await auth.api.removeUser({
      body: {
         userId: parsedInput.userId,
      },
      headers: await headers(),
   });

   revalidatePath("/admin/settings");

   return response;
});
