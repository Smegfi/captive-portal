"use server";

import { authActionClient } from "@/lib/safe-action";
import { EmailService } from "@/server/services/email-service";
import { readFileSync, writeFileSync } from "fs";
import { smtpConfigurationSchema } from "@/server/repositories/configuration/schema";

/**
 * Uložení SMTP konfigurace a ověření připojení k serveru.
 */
export const updateSmtpConfiguration = authActionClient
   .inputSchema(smtpConfigurationSchema)
   .action(async ({ parsedInput: { host, port, secure, from, auth } }) => {
      const config = JSON.parse(readFileSync("src/server/configuration/config.json", "utf8"));
      config.smtp = { host, port, secure, from, auth };
      writeFileSync("src/server/configuration/config.json", JSON.stringify(config, null, 2));

      const emailService = new EmailService(config.smtp);
      const result = await emailService.verifyConnection();

      if (result !== true) {
         throw new Error("Failed to verify email service connection");
      }

      return result;
   });
