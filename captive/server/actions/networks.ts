"use server";

import { db } from "@/server/db/sqlite/database";
import { networksTable } from "@/server/db/sqlite/schema";

export async function getNetworks() {
   const networks = await db.query.networksTable.findMany();
   return networks;
}