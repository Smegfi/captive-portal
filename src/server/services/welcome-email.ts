import { toEmailBodyHtml } from "@/lib/html-content";
import { getStoredSmtpConfiguration } from "@/server/repositories/configuration/config-store";
import { getStoredWelcomeEmailConfiguration } from "@/server/repositories/configuration/welcome-email-config-store";
import { EmailService } from "@/server/services/email-service";

/**
 * Builds the final HTML body for the welcome email after placeholder substitution.
 */
export function buildWelcomeEmailHtml(bodyTemplate: string, termsUrl: string, contactEmail: string): string {
   const body = bodyTemplate
      .replaceAll("[ODKAZ_NA_PODMINKY_A_OCHRANU_OSOBNICH_UDAJU]", termsUrl)
      .replaceAll("[KONTAKTNI_EMAIL]", contactEmail);

   const content = toEmailBodyHtml(body);

   return `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Uvítací email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f6f8;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:32px;font-size:15px;line-height:1.6;color:#374151;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Sestaví a odešle uložený uvítací email na zadanou adresu.
 */
export async function sendConfiguredWelcomeEmail(to: string) {
   const smtpConfiguration = getStoredSmtpConfiguration();
   const welcomeEmailConfiguration = await getStoredWelcomeEmailConfiguration();
   const emailService = new EmailService(smtpConfiguration);

   const termsUrl = process.env.WELCOME_EMAIL_TERMS_URL ?? "https://praha10.cz";
   const contactEmail = process.env.WELCOME_EMAIL_CONTACT_EMAIL ?? smtpConfiguration.from;

   const html = buildWelcomeEmailHtml(welcomeEmailConfiguration.bodyTemplate, termsUrl, contactEmail);

   await emailService.sendEmail(to, welcomeEmailConfiguration.subject, html);
}
