import { z } from "zod";

export const FortigateRequest = z.object({
   post: z.string(),
   magic: z.string(),
   usermac: z.string(),
   apmac: z.string(),
   apip: z.string(),
   ssid: z.string(),
   apname: z.string(),
   bssid: z.string(),
})

export type FortigateRequestType = z.infer<typeof FortigateRequest>

export const device = z.object({
   mac: z.string(),
   createdAt: z.string().datetime(),  
})

export type DeviceType = z.infer<typeof device>

export const devices: DeviceType[] = [];

export const session = z.object({
   id: z.string(),
   userId: z.string(),
   networkId: z.string(),
   deviceId: z.string(),
   loginTime: z.string().datetime(),
   magic: z.string(),
   createdAt: z.string().datetime(),
})

export type SessionType = z.infer<typeof session>
