import { z } from "zod";

const emailAddressSchema = z.string().email({ message: "Email musí být ve správném formátu" });

export const sendTestEmailSchema = z.object({
   email: emailAddressSchema,
});

export type sendTestEmailSchemaType = z.infer<typeof sendTestEmailSchema>;

export const sendWelcomeEmailSchema = z.object({
   email: emailAddressSchema,
});

export type sendWelcomeEmailSchemaType = z.infer<typeof sendWelcomeEmailSchema>;
