"use server";

import { authActionClient } from "@/lib/safe-action";
import { getStoredSmtpConfiguration } from "@/server/repositories/configuration/config-store";
import { getStoredWelcomeEmailConfiguration } from "@/server/repositories/configuration/welcome-email-config-store";

/**
 * Načtení SMTP konfigurace z lokálního config souboru.
 */
export const getSmtpConfiguration = authActionClient.action(async () => {
   return getStoredSmtpConfiguration();
});

/**
 * Načtení konfigurace uvítacího emailu.
 */
export const getWelcomeEmailConfiguration = authActionClient.action(async () => {
   return await getStoredWelcomeEmailConfiguration();
});
