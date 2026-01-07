"use server";

import { authActionClient } from "@/lib/safe-action";
import { listConnectionSchema } from "@/server/actions-scheme/connection/schema";
import { db } from "@/server/db/db";
import { count } from "drizzle-orm";
import { connection } from "../db/schema";
import { actionResultSchema } from "@/server/actions-scheme/action-result";

export const getLatestConnectionsAction = authActionClient
   .outputSchema(actionResultSchema)
   .inputSchema(listConnectionSchema)
   .action(async ({ parsedInput: { itemsPerPage, page } }) => {
      const offset = (page - 1) * itemsPerPage;

      const connections = await db.query.connection.findMany({
         with: {
            device: {
               with: {
                  guestUser: true,
               },
            },
            network: true,
         },
         limit: itemsPerPage,
         offset,
      });

      const total = await db.select({ value: count() }).from(connection);

      return {
         data: connections,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
