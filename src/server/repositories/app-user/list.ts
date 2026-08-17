"use server";

import { adminActionClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Seznam aplikačních uživatelů (Better Auth).
 */
export const listAppUser = adminActionClient.action(async () => {
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
