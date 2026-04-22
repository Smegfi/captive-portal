"use server";

import { authActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { device } from "@/server/db/schema/device";
import { guestUser } from "@/server/db/schema/guest-user";
import { and, count, gte, ilike, lte, or, sql } from "drizzle-orm";
import { listDeviceSchema } from "@/server/repositories/device/schema";

/**
 * Stránkovaný seznam zařízení (admin).
 */
export const listDevice = authActionClient
   .inputSchema(listDeviceSchema)
   .outputSchema(actionResultSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search, mac, user, device: os, connectedFrom, connectedTo } }) => {
      const offset = (page - 1) * itemsPerPage;
      const searchValue = search.trim();
      const macValue = mac.trim();
      const userValue = user.trim();
      const osValue = os?.trim().toLowerCase();

      const filters = [
         searchValue
            ? or(
                 ilike(device.macAddress, `%${searchValue}%`),
                 sql`COALESCE(${guestUser.email}, '') ILIKE ${`%${searchValue}%`}`,
              )
            : undefined,
         macValue ? ilike(device.macAddress, `%${macValue}%`) : undefined,
         userValue ? ilike(guestUser.email, `%${userValue}%`) : undefined,
         osValue && osValue !== "all" ? sql`LOWER(${device.device} -> 'os' ->> 'name') = ${osValue}` : undefined,
         connectedFrom ? gte(device.firstSeenAt, connectedFrom) : undefined,
         connectedTo ? lte(device.firstSeenAt, connectedTo) : undefined,
      ].filter((condition) => condition !== undefined);

      const whereCondition = filters.length > 0 ? and(...filters) : undefined;

      const devices = await db
         .select({ data: device, guestUser })
         .from(device)
         .leftJoin(guestUser, sql`${device.userId} = ${guestUser.id}`)
         .where(whereCondition)
         .limit(itemsPerPage)
         .offset(offset)
         .orderBy(device.id);

      const total = await db
         .select({ value: count() })
         .from(device)
         .leftJoin(guestUser, sql`${device.userId} = ${guestUser.id}`)
         .where(whereCondition);

      return {
         data: devices.map((entry) => ({
            ...entry.data,
            guestUser: entry.guestUser,
         })),
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
