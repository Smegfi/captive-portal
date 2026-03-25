"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateAppUserRoleSchema } from "@/server/repositories/app-user/schema";

/**
 * Změna role aplikačního uživatele.
 */
export const updateAppUserRole = adminActionClient.inputSchema(updateAppUserRoleSchema).action(async ({ parsedInput }) => {
   const apiRole = parsedInput.role === "reviewer" ? "user" : "admin";

   const response = await auth.api.setRole({
      body: {
         userId: parsedInput.userId,
         role: apiRole,
      },
      headers: await headers(),
   });

   revalidatePath("/admin/settings");

   return response.user;
});
