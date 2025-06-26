import { z } from "zod";

export const guestLoginSchema = z.object({
   email: z.string().email().nonempty(),
   marketingApproved: z.boolean().default(false),
});
