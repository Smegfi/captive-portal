import { z } from "zod";

export const guestLoginSchema = z.object({
   email: z.string().email().nonempty(),
   marketingApproved: z.boolean().default(false),
});

export const listGuestSchema = z.object({
   itemsPerPage: z.number(),
   page: z.number(),
   search: z.string(),
});
