"use server";

import { authActionClient } from "@/lib/safe-action";
import { readFileSync } from "fs";
import { smtpConfigurationSchema } from "@/server/repositories/configuration/schema";

/**
 * Načtení SMTP konfigurace z lokálního config souboru.
 */
export const getSmtpConfiguration = authActionClient.action(async () => {
   const config = JSON.parse(readFileSync("src/server/configuration/config.json", "utf8"));
   return smtpConfigurationSchema.parse(config.smtp);
});
