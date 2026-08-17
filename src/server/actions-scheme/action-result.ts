import { z } from "zod";

export const actionResultSchema = z.object({
   data: z.any(),
   totalPages: z.number(),
});

export type ActionResult = z.infer<typeof actionResultSchema>;
