"use server";

import { EmailService } from "../services/email-service";
import { actionClient } from "@/lib/safe-action";
import config from "@/server/configuration/config.json";
import { sendTestEmailSchema } from "@/server/actions-scheme/email/email-schema";
import { readFileSync } from "fs";
import path from "path";

export const sendTestEmailAction = actionClient.inputSchema(sendTestEmailSchema).action(async ({ parsedInput: { email } }) => {
   const emailService = new EmailService(config.smtp);
   const htmlTemplate = readFileSync(path.join(process.cwd(), "src", "server", "email-templates", "test-email.html"), "utf8");
   let html = htmlTemplate.replace("{{APP_URL_ADMIN}}", (process.env.BETTER_AUTH_URL || "https://localhost:3000") + "/admin/settings");
   html = html.replace("{{YEAR}}", new Date().getFullYear().toString());
   await emailService.sendEmail(email, "Captive portál - Praha 10", html);
   return;
});
