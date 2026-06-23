import { z } from "zod";

export const appRoleSchema = z.enum(["admin", "reviewer"]);

export const createAppUserSchema = z.object({
   name: z.string().trim().min(2, "Jméno musí mít alespoň 2 znaky"),
   email: z.string().trim().email("Neplatný email"),
   password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
   role: appRoleSchema,
});

export const updateAppUserSchema = z.object({
   userId: z.string().min(1, "Uživatel není platný"),
   name: z.string().trim().min(2, "Jméno musí mít alespoň 2 znaky"),
   email: z.string().trim().email("Neplatný email"),
   role: appRoleSchema,
});

export const resetAppUserPasswordSchema = z.object({
   userId: z.string().min(1, "Uživatel není platný"),
   password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
});

export const removeAppUserSchema = z.object({
   userId: z.string().min(1, "Uživatel není platný"),
});

export type CreateAppUserSchemaType = z.infer<typeof createAppUserSchema>;
export type UpdateAppUserSchemaType = z.infer<typeof updateAppUserSchema>;
export type ResetAppUserPasswordSchemaType = z.infer<typeof resetAppUserPasswordSchema>;
export type RemoveAppUserSchemaType = z.infer<typeof removeAppUserSchema>;
