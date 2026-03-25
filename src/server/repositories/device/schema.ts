import { z } from "zod";

export const listDeviceSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
});
