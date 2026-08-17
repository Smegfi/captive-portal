"use server";

import { actionClient } from "@/lib/safe-action";
import { getStoredSmtpConfiguration } from "@/server/repositories/configuration/config-store";
import { EmailService } from "@/server/services/email-service";
import { readFileSync } from "fs";
import path from "path";
import { sendTestEmailSchema } from "@/server/repositories/email/schema";

/**
 * Odeslání testovacího emailu (SMTP).
 */
export const sendTestEmail = actionClient.inputSchema(sendTestEmailSchema).action(async ({ parsedInput: { email } }) => {
   const smtpConfiguration = getStoredSmtpConfiguration();
   const emailService = new EmailService(smtpConfiguration);
   const htmlTemplate = readFileSync(path.join(process.cwd(), "src", "server", "email-templates", "test-email.html"), "utf8");
   let html = htmlTemplate.replace("{{APP_URL_ADMIN}}", (process.env.BETTER_AUTH_URL || "https://localhost:3000") + "/admin/settings");
   html = html.replace("{{YEAR}}", new Date().getFullYear().toString());
   await emailService.sendEmail(email, "Captive portál - Praha 10", html);
});
