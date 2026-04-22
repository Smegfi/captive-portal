import { z } from "zod";

export const listDeviceSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   mac: z.string(),
   user: z.string(),
   device: z.string().optional(),
   connectedFrom: z.date().optional(),
   connectedTo: z.date().optional(),
});
