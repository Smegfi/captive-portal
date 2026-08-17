"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { resetAppUserPasswordSchema } from "@/server/repositories/app-user/schema";

/**
 * Nastavení nového hesla aplikačního uživatele administrátorem.
 */
export const resetAppUserPassword = adminActionClient.inputSchema(resetAppUserPasswordSchema).action(async ({ parsedInput }) => {
   const response = await auth.api.setUserPassword({
      body: {
         userId: parsedInput.userId,
         newPassword: parsedInput.password,
      },
      headers: await headers(),
   });

   return response;
});
