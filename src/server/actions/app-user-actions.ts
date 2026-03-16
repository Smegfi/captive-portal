"use server";

import { adminActionClient } from "@/lib/safe-action";
import { createAppUserSchema, updateAppUserRoleSchema } from "@/server/actions-scheme/app-user/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const listAppUsersAction = adminActionClient.action(async () => {
   const response = await auth.api.listUsers({
      query: {
         sortBy: "createdAt",
         sortDirection: "desc",
         limit: 100,
         offset: 0,
      },
      headers: await headers(),
   });

   return response.users;
});

export const createAppUserAction = adminActionClient.inputSchema(createAppUserSchema).action(async ({ parsedInput }) => {
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

export const updateAppUserRoleAction = adminActionClient.inputSchema(updateAppUserRoleSchema).action(async ({ parsedInput }) => {
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
