"use server";

import { authActionClient } from "@/lib/safe-action";
import { sendWelcomeEmailSchema } from "@/server/repositories/email/schema";
import { sendConfiguredWelcomeEmail } from "@/server/services/welcome-email";

/**
 * Odeslání uloženého uvítacího emailu na zadanou adresu.
 */
export const sendWelcomeEmail = authActionClient.inputSchema(sendWelcomeEmailSchema).action(async ({ parsedInput: { email } }) => {
   try {
      await sendConfiguredWelcomeEmail(email);
      return { ok: true as const };
   } catch (error) {
      console.error(`[welcome-email] Failed to send welcome email to ${email}`, error);
      return { ok: false as const };
   }
});
