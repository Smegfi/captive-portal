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