"use server";

import { authActionClient } from "@/lib/safe-action";
import { listConnectionSchema } from "@/server/actions-scheme/connection/schema";
import { db } from "@/server/db/db";
import { count, like, eq, or } from "drizzle-orm";
import { connection, device, guestUser, network } from "../db/schema";
import { actionResultSchema } from "@/server/actions-scheme/action-result";

export const getLatestConnectionsAction = authActionClient
   .outputSchema(actionResultSchema)
   .inputSchema(listConnectionSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
      const offset = (page - 1) * itemsPerPage;

      const connections = await db
         .select()
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .innerJoin(guestUser, eq(device.userId, guestUser.id))
         .where(or(like(device.macAddress, `%${search}%`), like(network.name, `%${search}%`)))
         .limit(itemsPerPage)
         .offset(offset);

      const total = await db
         .select({ value: count() })
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .where(or(like(device.macAddress, `%${search}%`), like(network.name, `%${search}%`)));

      return {
         data: connections,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
