"use server";

import { authActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { connection, device, guestUser, network } from "@/server/db/schema";
import { count, eq, like, or } from "drizzle-orm";
import { listConnectionSchema } from "@/server/repositories/connection/schema";

/**
 * Stránkovaný seznam připojení (admin).
 */
export const listConnection = authActionClient
   .outputSchema(actionResultSchema)
   .inputSchema(listConnectionSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
      const offset = (page - 1) * itemsPerPage;
      const searchTerm = search ?? "";

      const connections = await db
         .select()
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .innerJoin(guestUser, eq(device.userId, guestUser.id))
         .where(or(like(device.macAddress, `%${searchTerm}%`), like(network.name, `%${searchTerm}%`)))
         .limit(itemsPerPage)
         .offset(offset);

      const total = await db
         .select({ value: count() })
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .where(or(like(device.macAddress, `%${searchTerm}%`), like(network.name, `%${searchTerm}%`)));

      return {
         data: connections,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
