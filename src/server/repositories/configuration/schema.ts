import { z } from "zod";

const smtpAuthSchema = z.object({
   user: z.string(),
   pass: z.string(),
});

export const smtpConfigurationSchema = z
   .object({
      host: z.string().min(1, { message: "Host je povinný" }),
      port: z.number().min(1, { message: "Port je povinný" }),
      secure: z.boolean(),
      from: z.string().email({ message: "Email musí být ve správném formátu" }),
      anonymousAuth: z.boolean(),
      auth: smtpAuthSchema,
   })
   .superRefine((data, ctx) => {
      if (data.anonymousAuth) {
         return;
      }

      if (!data.auth.user.trim()) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "User je povinný",
            path: ["auth", "user"],
         });
      }

      if (!data.auth.pass.trim()) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Pass je povinný",
            path: ["auth", "pass"],
         });
      }
   });

export type smtpConfigurationSchemaType = z.infer<typeof smtpConfigurationSchema>;

export const DEFAULT_WELCOME_EMAIL_SUBJECT = "Dokončení registrace do odběru novinek MČ Praha 10";

export const DEFAULT_WELCOME_EMAIL_BODY_TEMPLATE = `Dobrý den,

děkujeme, že jste při připojení k bezplatné Wi-Fi síti MČ Praha 10 zvolil(a) možnost dostávat informace o novinkách a akcích Městské části Praha 10 e-mailem.

Aby bylo možné odběr novinek dokončit, je nutné provést registraci v systému MUNIPOLIS na následujícím odkazu:
https://praha10.munipolis.cz/registrace

Pokud registraci nedokončíte, k odběru novinek Vás nepřihlásíme a žádné další informace Vám v této souvislosti zasílány nebudou.

Tento e-mail Vám byl zaslán jednorázově na základě Vaší volby provedené v captive portálu při připojení k Wi-Fi síti MČ Praha 10. Další e-mail z tohoto procesu již zaslán nebude.

Pokud jste o odběr novinek nežádal(a), považujte prosím tento e-mail za bezpředmětný a dále jej ignorujte.

Více informací o podmínkách využívání Wi-Fi a zpracování osobních údajů naleznete zde:
[ODKAZ_NA_PODMINKY_A_OCHRANU_OSOBNICH_UDAJU]

V případě dotazů nás můžete kontaktovat na:
[KONTAKTNI_EMAIL]

S pozdravem,
Úřad městské části Praha 10
www.praha10.cz`;

export const welcomeEmailConfigurationSchema = z.object({
   subject: z.string().min(1, { message: "Předmět je povinný" }),
   bodyTemplate: z.string().min(1, { message: "Text emailu je povinný" }),
});

export type WelcomeEmailConfigurationSchemaType = z.infer<typeof welcomeEmailConfigurationSchema>;
