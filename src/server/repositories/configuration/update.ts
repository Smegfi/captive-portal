"use server";

import { authActionClient } from "@/lib/safe-action";
import { EmailService } from "@/server/services/email-service";
import { readStoredConfig, writeStoredConfig } from "@/server/repositories/configuration/config-store";
import { updateStoredWelcomeEmailConfiguration } from "@/server/repositories/configuration/welcome-email-config-store";
import { smtpConfigurationSchema, welcomeEmailConfigurationSchema } from "@/server/repositories/configuration/schema";

/**
 * Uložení SMTP konfigurace a ověření připojení k serveru.
 */
export const updateSmtpConfiguration = authActionClient
   .inputSchema(smtpConfigurationSchema)
   .action(async ({ parsedInput: { host, port, secure, from, anonymousAuth, auth } }) => {
      const config = readStoredConfig();
      const smtpConfiguration = {
         host,
         port,
         secure,
         from,
         anonymousAuth,
         auth: anonymousAuth ? { user: "", pass: "" } : auth,
      };
      config.smtp = smtpConfiguration;
      writeStoredConfig(config);

      const emailService = new EmailService(smtpConfiguration);
      const result = await emailService.verifyConnection();

      if (result !== true) {
         throw new Error("Failed to verify email service connection");
      }

      return result;
   });

/**
 * Uložení konfigurace uvítacího emailu.
 */
export const updateWelcomeEmailConfiguration = authActionClient
   .inputSchema(welcomeEmailConfigurationSchema)
   .action(async ({ parsedInput: { subject, bodyTemplate } }) => {
      return await updateStoredWelcomeEmailConfiguration(subject, bodyTemplate);
   });
