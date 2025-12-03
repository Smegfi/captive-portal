"use server";

import { authActionClient } from "@/lib/safe-action";
import { listConnectionSchema } from "@/server/actions-scheme/connection/schema";
import { db } from "@/server/db/db";

export const listConnectionAction = authActionClient.inputSchema(listConnectionSchema).action(async ({ parsedInput: { itemsPerPage, page } }) => {
   const offset = (page - 1) * itemsPerPage;

   const connections = await db.query.connection.findMany({
      limit: itemsPerPage,
      offset,
   });

   return connections;
});

export const getLatestConnectionsAction = authActionClient.action(async () => {
   const connections = await db.query.connection.findMany({
      with: {
         device: {
            with: {
               guestUser: true,
            },
         },
         network: true,
      },
      limit: 20,
   });

   return connections;
});
