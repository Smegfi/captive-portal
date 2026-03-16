import { z } from "zod";

export const appRoleSchema = z.enum(["admin", "reviewer"]);

export const createAppUserSchema = z.object({
   name: z.string().trim().min(2, "Jméno musí mít alespoň 2 znaky"),
   email: z.string().trim().email("Neplatný email"),
   password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
   role: appRoleSchema,
});

export const updateAppUserRoleSchema = z.object({
   userId: z.string().min(1, "Uživatel není platný"),
   role: appRoleSchema,
});

export type CreateAppUserSchemaType = z.infer<typeof createAppUserSchema>;
export type UpdateAppUserRoleSchemaType = z.infer<typeof updateAppUserRoleSchema>;
