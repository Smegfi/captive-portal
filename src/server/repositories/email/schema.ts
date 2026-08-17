import { z } from "zod";

export const sendTestEmailSchema = z.object({
   email: z.string().email({ message: "Email musí být ve správném formátu" }),
});

export type sendTestEmailSchemaType = z.infer<typeof sendTestEmailSchema>;
