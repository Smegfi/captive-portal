"use server";

import { authActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { connection, device, guestUser, network } from "@/server/db/schema";
import { and, count, eq, gte, ilike, lte, or } from "drizzle-orm";
import { listConnectionSchema } from "@/server/repositories/connection/schema";

/**
 * Stránkovaný seznam připojení (admin).
 */
export const listConnection = authActionClient
   .outputSchema(actionResultSchema)
   .inputSchema(listConnectionSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search, mac, network: networkName, user, updatedFrom, updatedTo } }) => {
      const offset = (page - 1) * itemsPerPage;
      const searchValue = search.trim();
      const macValue = mac.trim();
      const networkValue = networkName.trim();
      const userValue = user.trim();

      const filters = [
         searchValue
            ? or(ilike(device.macAddress, `%${searchValue}%`), ilike(network.name, `%${searchValue}%`), ilike(guestUser.email, `%${searchValue}%`))
            : undefined,
         macValue ? ilike(device.macAddress, `%${macValue}%`) : undefined,
         networkValue ? ilike(network.name, `%${networkValue}%`) : undefined,
         userValue ? ilike(guestUser.email, `%${userValue}%`) : undefined,
         updatedFrom ? gte(guestUser.updatedAt, updatedFrom) : undefined,
         updatedTo ? lte(guestUser.updatedAt, updatedTo) : undefined,
      ].filter((condition) => condition !== undefined);

      const whereCondition = filters.length > 0 ? and(...filters) : undefined;

      const connections = await db
         .select()
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .innerJoin(guestUser, eq(device.userId, guestUser.id))
         .where(whereCondition)
         .limit(itemsPerPage)
         .offset(offset)
         .orderBy(connection.id);

      const total = await db
         .select({ value: count() })
         .from(connection)
         .innerJoin(device, eq(connection.deviceId, device.id))
         .innerJoin(network, eq(connection.networkId, network.id))
         .innerJoin(guestUser, eq(device.userId, guestUser.id))
         .where(whereCondition);

      return {
         data: connections,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
