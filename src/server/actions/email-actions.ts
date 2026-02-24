"use server";

import { EmailService } from "../services/email-service";
import { actionClient } from "@/lib/safe-action";
import config from "@/server/configuration/config.json";
import { sendTestEmailSchema } from "@/server/actions-scheme/email/email-schema";

export const sendTestEmailAction = actionClient.inputSchema(sendTestEmailSchema).action(async ({ parsedInput: { email } }) => {
   const emailService = new EmailService(config.smtp);
   await emailService.sendEmail(email, "Testovací email", "<h1>Tento je testovací email</h1>");
   return;
});
