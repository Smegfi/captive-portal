"use server";

import { EmailService } from "../services/email-service";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { readFileSync, writeFileSync } from "fs";
import config from "../configuration/config.json";
import { emailConfigurationSchema } from "../actions-scheme/configuration/email-schema";

export const sendTestEmailAction = actionClient.inputSchema(z.object({ email: z.string() })).action(async ({ parsedInput: { email } }) => {
   const emailService = new EmailService(config.smtp);
   await emailService.sendEmail(email, "Testovací email", "Tento je testovací email");

   return {
      success: true,
   };
});

export const updateEmailConfigurationAction = actionClient
   .inputSchema(emailConfigurationSchema)
   .action(async ({ parsedInput: { host, port, secure, auth } }) => {
      var config = {
         smtp: {
            host,
            port,
            secure,
            auth,
         },
      };
      writeFileSync("src/server/configuration/config.json", JSON.stringify(config, null, 2));
      return { success: true };
   });

export const getEmailConfigurationAction = actionClient.action(async () => {
   const config = JSON.parse(readFileSync("src/server/configuration/config.json", "utf8"));
   return emailConfigurationSchema.parse(config.smtp);
});
