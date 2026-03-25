import { z } from "zod";

export const listGuestSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
});
