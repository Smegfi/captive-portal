"use server";

import { db } from "@/server/db/sqlite/database";
import { devicesTable } from "@/server/db/sqlite/schema";

export async function getDevices() {
   const devices = await db.query.devicesTable.findMany();
   return devices;
}