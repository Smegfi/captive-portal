"use server";

import { db } from "@/db/db";
import { network } from "@/db/schema/network";
import { authActionClient } from "@/lib/safe-action";
import { getNetworkSchema, listNetworkSchema, newNetworkSchema, removeNetworkSchema, updateNetworkSchema } from "@/server/actions-scheme/network/schema";
import { eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const newNetworkAction = authActionClient.inputSchema(newNetworkSchema).action(async ({ parsedInput: { name, ssid, isActive } }) => {
   const result = await db
      .insert(network)
      .values({
         name,
         ssid,
         isActive,
         createdAt: new Date(),
         updatedAt: new Date(),
      })
      .returning();

   revalidatePath("/admin/networks");

   return result[0];
});

export const updateNetworkAction = authActionClient.inputSchema(updateNetworkSchema).action(async ({ parsedInput: { id, name, ssid, isActive } }) => {
   const result = await db.update(network).set({ name, ssid, isActive, updatedAt: new Date() }).where(eq(network.id, id)).returning();

   revalidatePath("/admin/networks");

   return result[0];
});

export const removeNetworkAction = authActionClient.inputSchema(removeNetworkSchema).action(async ({ parsedInput: { id } }) => {
   const result = await db.delete(network).where(eq(network.id, id)).returning();

   revalidatePath("/admin/networks");

   return result[0];
});

export const getNetworkAction = authActionClient.inputSchema(getNetworkSchema).action(async ({ parsedInput: { id } }) => {
   const result = await db.select().from(network).where(eq(network.id, id));

   return result[0];
});

export const listNetworkAction = authActionClient.inputSchema(listNetworkSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const result = await db.query.network.findMany({
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      where: search ? or(ilike(network.name, `%${search}%`), ilike(network.ssid, `%${search}%`)) : undefined,
   });

   return result;
});
