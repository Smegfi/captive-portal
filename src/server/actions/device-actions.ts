"use server";

import { authActionClient } from "@/lib/safe-action";
import { listDeviceSchema } from "@/server/actions-scheme/device/schema";
import { db } from "@/server/db/db";
import { device } from "@/server/db/schema/device";
import { ilike } from "drizzle-orm";

export const listDeviceAction = authActionClient.inputSchema(listDeviceSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const offset = (page - 1) * itemsPerPage;

   const devices = await db.query.device.findMany({
      limit: itemsPerPage,
      offset,
      where: ilike(device.macAddress, `%${search}%`),
      with: { guestUser: true },
   });

   return devices;
});
