"use server";

import { authActionClient } from "@/lib/safe-action";
import { smtpConfigurationSchema } from "../actions-scheme/configuration/smtp-schema";
import { readFileSync, writeFileSync } from "fs";
import { EmailService } from "../services/email-service";

export const updateSmtpConfigurationAction = authActionClient
   .inputSchema(smtpConfigurationSchema)
   .action(async ({ parsedInput: { host, port, secure, from, auth } }) => {
      const config = JSON.parse(readFileSync("src/server/configuration/config.json", "utf8"));
      config.smtp = { host, port, secure, from, auth };
      writeFileSync("src/server/configuration/config.json", JSON.stringify(config, null, 2));

      const emailService = new EmailService(config.smtp);
      var result = await emailService.verifyConnection();

      if (result !== true) {
         throw new Error("Failed to verify email service connection");
      }

      return result;
   });

export const getSmtpConfigurationAction = authActionClient.action(async () => {
   const config = JSON.parse(readFileSync("src/server/configuration/config.json", "utf8"));
   return smtpConfigurationSchema.parse(config.smtp);
});
