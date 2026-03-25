"use server";

import { authActionClient } from "@/lib/safe-action";
import { actionResultSchema } from "@/server/actions-scheme/action-result";
import { db } from "@/server/db/db";
import { device } from "@/server/db/schema/device";
import { count, ilike } from "drizzle-orm";
import { listDeviceSchema } from "@/server/repositories/device/schema";

/**
 * Stránkovaný seznam zařízení (admin).
 */
export const listDevice = authActionClient
   .inputSchema(listDeviceSchema)
   .outputSchema(actionResultSchema)
   .action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
      const offset = (page - 1) * itemsPerPage;

      const devices = await db.query.device.findMany({
         limit: itemsPerPage,
         offset,
         where: ilike(device.macAddress, `%${search}%`),
         with: { guestUser: true },
      });

      const total = await db
         .select({ value: count() })
         .from(device)
         .where(ilike(device.macAddress, `%${search}%`));

      return {
         data: devices,
         totalPages: Math.ceil(total[0].value / itemsPerPage),
      };
   });
