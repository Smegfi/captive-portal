import { z } from "zod";

export const emailConfigurationSchema = z.object({
   host: z.string(),
   port: z.number(),
   secure: z.boolean(),
   auth: z.object({
      user: z.string(),
      pass: z.string(),
   }),
});

export type emailConfigurationSchemaType = z.infer<typeof emailConfigurationSchema>;
