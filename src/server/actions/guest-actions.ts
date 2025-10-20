"use server";

import { db } from "@/db/db";
import { network } from "@/db/schema";
import { connection as connectionTable } from "@/db/schema/connection";
import { device } from "@/db/schema/device";
import { guestUser } from "@/db/schema/guest-user";
import { actionClient, authActionClient } from "@/lib/safe-action";
import { DeviceSchema, createConnectionSchema, guestLoginSchema, listGuestSchema } from "@/server/actions-scheme/guest-user/schema";
import { and, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const guestLoginAction = actionClient.inputSchema(guestLoginSchema).action(async ({ parsedInput: { email, marketingApproved, device, connection } }) => {
   const existingGuest = await db.select().from(guestUser).where(eq(guestUser.email, email));

   const networkResult = await findNetworkBySSID(connection.ssid);

   if (existingGuest.length > 0) {
      const deviceResult = await findOrCreateDevice(existingGuest[0].id!, connection.usermac, device);

      await createConnectionAction({
         deviceId: deviceResult.id,
         networkId: networkResult.id,
         connection: connection,
      });

      if (await isPassthroughModeEnabled()) {
         return returnPassthroughUser(connection.post, connection.magic);
      }

      return {
         postUrl: connection.post,
         magic: connection.magic,
         username: existingGuest[0].email,
         password: "", // TODO: Generate password
      };
   }

   // Uživatel nebyl nalezen, vytvoříme nového
   const guestLogin = await db
      .insert(guestUser)
      .values({
         email,
         marketingApproved,
         createdAt: new Date(),
         updatedAt: new Date(),
      })
      .returning();

   // Vytvoříme nové zařízení pro uživatele
   const deviceResult = await findOrCreateDevice(guestLogin[0].id, connection.usermac, device);

   await createConnectionAction({
      deviceId: deviceResult.id,
      networkId: networkResult.id,
      connection: connection,
   });

   revalidatePath("/admin/devices");
   revalidatePath("/admin/users");

   if (await isPassthroughModeEnabled()) {
      return returnPassthroughUser(connection.post, connection.magic);
   }

   return {
      postUrl: connection.post,
      magic: connection.magic,
      username: guestLogin[0].email,
      password: "", // TODO: Generate password
   };
});

export const listGuestUserAction = authActionClient.inputSchema(listGuestSchema).action(async ({ parsedInput: { itemsPerPage, page, search } }) => {
   const offset = (page - 1) * itemsPerPage;

   const guestUsers = await db.query.guestUser.findMany({
      limit: itemsPerPage,
      offset,
      where: ilike(guestUser.email, `%${search}%`),
      with: {
         devices: {
            columns: {
               id: true,
            },
         },
      },
   });

   return guestUsers;
});

/**
 * Vytvoří nové připojení mezi zařízením a sítí
 */
export const createConnectionAction = actionClient.inputSchema(createConnectionSchema).action(async ({ parsedInput: { deviceId, networkId, connection } }) => {
   const result = await db.insert(connectionTable).values({
      deviceId: deviceId,
      networkId: networkId,
      connection: connection,
   });

   return result[0];
});

/**
 * Tuto cestu volá Fortigate pomocí HTTP 301 redirectu
 * Fortigate request example
 * https://srv-captive/?
 * post=http://192.168.30.1:1000/fgtauth&
 * magic=040d028c9aaae999&
 * usermac=60:03:08:8f:5e:b6&
 * apmac=08:5b:0e:08:d4:ee&
 * apip=192.168.30.41&
 * ssid=test&
 * apname=FWF60D4613003326&
 * bssid=00:00:00:00:00:00
 */

/**
 * Find network by SSID
 * @param ssid
 * @returns
 */
async function findNetworkBySSID(ssid: string) {
   const result = await db.query.network.findFirst({
      where: eq(network.ssid, ssid),
   });

   if (!result) {
      throw new Error(`Network with SSID ${ssid} not found`);
   }

   return result;
}

/**
 * Find device by user ID and MAC address and check if it exists
 * @param userId
 * @param macAddress
 * @param deviceInfo
 */
async function findOrCreateDevice(userId: number, macAddress: string, deviceInfo: DeviceSchema) {
   const result = await db.query.device.findFirst({
      where: and(eq(device.userId, userId), eq(device.macAddress, macAddress)),
   });

   if (!result) {
      // Zařízení nebylo nalezeno, vytvoříme nové
      const newDeviceResult = await db
         .insert(device)
         .values({
            userId: userId,
            macAddress: macAddress,
            device: deviceInfo,
            firstSeenAt: new Date(),
         })
         .returning();

      return newDeviceResult[0];
   }

   // Zařízení bylo nalezeno, updatujeme jeho data
   const updatedDeviceResult = await db
      .update(device)
      .set({
         device: deviceInfo,
      })
      .where(eq(device.id, result.id))
      .returning();

   return updatedDeviceResult[0];
}

/**
 * Checks if passthrough mode is enabled in .env file
 * @returns true if passthrough mode is enabled, false otherwise
 */
export async function isPassthroughModeEnabled() {
   return process.env.PASS_THROUGH_MODE?.toUpperCase() === "TRUE";
}

/**
 * Returns passthrough user credentials
 * @param post Post URL address
 * @param magic Magic token
 * @returns Passthrough user credentials { email, password }
 */
export async function returnPassthroughUser(post: string, magic: string) {
   return {
      postUrl: post,
      magic: magic,
      username: process.env.FORTINET_USER,
      password: process.env.FORTINET_PASSWORD,
   };
}
