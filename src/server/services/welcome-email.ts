import { getStoredSmtpConfiguration } from "@/server/repositories/configuration/config-store";
import { getStoredWelcomeEmailConfiguration } from "@/server/repositories/configuration/welcome-email-config-store";
import { EmailService } from "@/server/services/email-service";

/**
 * Sestaví a odešle uložený uvítací email na zadanou adresu.
 */
export async function sendConfiguredWelcomeEmail(to: string) {
   const smtpConfiguration = getStoredSmtpConfiguration();
   const welcomeEmailConfiguration = await getStoredWelcomeEmailConfiguration();
   const emailService = new EmailService(smtpConfiguration);

   const termsUrl = process.env.WELCOME_EMAIL_TERMS_URL ?? "https://praha10.cz";
   const contactEmail = process.env.WELCOME_EMAIL_CONTACT_EMAIL ?? smtpConfiguration.from;

   const body = welcomeEmailConfiguration.bodyTemplate
      .replaceAll("[ODKAZ_NA_PODMINKY_A_OCHRANU_OSOBNICH_UDAJU]", termsUrl)
      .replaceAll("[KONTAKTNI_EMAIL]", contactEmail);

   const html = body.replaceAll("\n", "<br />");

   await emailService.sendEmail(to, welcomeEmailConfiguration.subject, html);
}
