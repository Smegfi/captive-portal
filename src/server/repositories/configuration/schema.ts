import { z } from "zod";

export const smtpConfigurationSchema = z.object({
   host: z.string().min(1, { message: "Host je povinný" }),
   port: z.number().min(1, { message: "Port je povinný" }),
   secure: z.boolean(),
   from: z.string().email({ message: "Email musí být ve správném formátu" }),
   auth: z
      .object({
         user: z.string().min(1, { message: "User je povinný" }),
         pass: z.string().min(1, { message: "Pass je povinný" }),
      })
      .optional(),
});

export type smtpConfigurationSchemaType = z.infer<typeof smtpConfigurationSchema>;
