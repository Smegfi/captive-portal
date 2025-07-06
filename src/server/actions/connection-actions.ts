"use server";

import { db } from "@/db/db";
import { connection } from "@/db/schema/connection";
import { actionClient } from "@/lib/safe-action";
import { listConnectionSchema } from "@/server/actions-scheme/connection/schema";
import { ilike } from "drizzle-orm";

export const listConnectionAction = actionClient.inputSchema(listConnectionSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const offset = (page - 1) * itemsPerPage;

   const connections = await db.query.connection.findMany({
      limit: itemsPerPage,
      offset,
      where: ilike(connection.clientIp, `%${search}%`),
   });

   return connections;
});

export const getLatestConnectionsAction = actionClient.action(async () => {
   const connections = await db.query.connection.findMany({
      with: {
         device: {
            with: {
               guestUser: true,
            },
         },
         network: true,
      },
   });

   return connections;
});
