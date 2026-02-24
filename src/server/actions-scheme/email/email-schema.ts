import { z } from "zod";

export const sendEmailSchema = z.object({
   to: z.string().email({ message: "Email musí být ve správném formátu" }),
   subject: z.string().min(1, { message: "Předmět je povinný" }),
   body: z.string().min(1, { message: "Text je povinný" }),
});

export type sendEmailSchemaType = z.infer<typeof sendEmailSchema>;

export const sendTestEmailSchema = z.object({
   email: z.string().email({ message: "Email musí být ve správném formátu" }),
});

export type sendTestEmailSchemaType = z.infer<typeof sendTestEmailSchema>;
