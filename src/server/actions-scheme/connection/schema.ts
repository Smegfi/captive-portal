import { z } from "zod";

export const listConnectionSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string().optional(),
});
