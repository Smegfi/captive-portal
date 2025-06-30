import { z } from "zod";

export const LoginSchema = z.object({
   email: z.string().email({ message: "Email musí být ve správném formátu" }),
   password: z.string().min(8, { message: "Heslo musí mít alespoň 8 znaků" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
   name: z.string().min(1, { message: "Jméno je povinné" }),
   email: z.string().email({ message: "Email musí být ve správném formátu" }),
   password: z.string().min(8, { message: "Heslo musí mít alespoň 8 znaků" }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
