import { z } from "zod";

/**
 * Formulář pro přihlášení
 */
export const LoginForm = z.object({
   username: z.string().email({ message: "Zadejte prosím email" }),
   password: z.string().min(1, { message: "Zadejte prosím heslo" }),
});

/**
 * Formulář pro přihlášení
 */
export type LoginFormType = z.infer<typeof LoginForm>;

export const FortigateRequest = z.object({
   post: z.string(),
   magic: z.string(),
   usermac: z.string(),
   apmac: z.string(),
   apip: z.string(),
   ssid: z.string(),
   apname: z.string(),
   bssid: z.string(),
});

export type FortigateRequestType = z.infer<typeof FortigateRequest>;
