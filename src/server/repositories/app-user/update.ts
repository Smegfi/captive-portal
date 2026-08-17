"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateAppUserSchema } from "@/server/repositories/app-user/schema";

/**
 * Úprava aplikačního uživatele (jméno, email, role).
 */
export const updateAppUser = adminActionClient.inputSchema(updateAppUserSchema).action(async ({ parsedInput }) => {
   const apiRole = parsedInput.role === "reviewer" ? "user" : "admin";

   const response = await auth.api.adminUpdateUser({
      body: {
         userId: parsedInput.userId,
         data: {
            name: parsedInput.name,
            email: parsedInput.email,
            role: apiRole,
         },
      },
      headers: await headers(),
   });

   revalidatePath("/admin/settings");

   return response;
});
