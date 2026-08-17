"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAppUserSchema } from "@/server/repositories/app-user/schema";

/**
 * Vytvoření aplikačního uživatele.
 */
export const createAppUser = adminActionClient.inputSchema(createAppUserSchema).action(async ({ parsedInput }) => {
   const apiRole = parsedInput.role === "reviewer" ? "user" : "admin";

   const response = await auth.api.createUser({
      body: {
         name: parsedInput.name,
         email: parsedInput.email,
         password: parsedInput.password,
         role: apiRole,
      },
      headers: await headers(),
   });

   revalidatePath("/admin/settings");

   return response.user;
});
