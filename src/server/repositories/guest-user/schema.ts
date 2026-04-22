import { z } from "zod";

export const listGuestSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
   email: z.string(),
   marketing: z.string().optional(),
   createdFrom: z.date().optional(),
   createdTo: z.date().optional(),
});
