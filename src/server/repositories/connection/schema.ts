import { z } from "zod";

export const listConnectionSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   mac: z.string(),
   network: z.string(),
   user: z.string(),
   updatedFrom: z.date().optional(),
   updatedTo: z.date().optional(),
});
