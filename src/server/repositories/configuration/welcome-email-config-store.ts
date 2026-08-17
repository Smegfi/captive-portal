import { db } from "@/server/db/db";
import { welcomeEmailConfig } from "@/server/db/schema/welcome-email-config";
import {
   DEFAULT_WELCOME_EMAIL_BODY_TEMPLATE,
   DEFAULT_WELCOME_EMAIL_SUBJECT,
   welcomeEmailConfigurationSchema,
} from "@/server/repositories/configuration/schema";
import { eq } from "drizzle-orm";

async function getOrCreateWelcomeEmailConfigRecord() {
   const existingConfig = await db.query.welcomeEmailConfig.findFirst({
      orderBy: (table, { desc }) => [desc(table.id)],
   });

   if (existingConfig) {
      return existingConfig;
   }

   const now = new Date();
   const createdConfig = await db
      .insert(welcomeEmailConfig)
      .values({
         subject: DEFAULT_WELCOME_EMAIL_SUBJECT,
         bodyTemplate: DEFAULT_WELCOME_EMAIL_BODY_TEMPLATE,
         createdAt: now,
         updatedAt: now,
      })
      .returning();

   return createdConfig[0];
}

export async function getStoredWelcomeEmailConfiguration() {
   const config = await getOrCreateWelcomeEmailConfigRecord();
   return welcomeEmailConfigurationSchema.parse({
      subject: config.subject,
      bodyTemplate: config.bodyTemplate,
   });
}

export async function updateStoredWelcomeEmailConfiguration(subject: string, bodyTemplate: string) {
   const existingConfig = await getOrCreateWelcomeEmailConfigRecord();
   const updatedConfig = await db
      .update(welcomeEmailConfig)
      .set({
         subject,
         bodyTemplate,
         updatedAt: new Date(),
      })
      .where(eq(welcomeEmailConfig.id, existingConfig.id))
      .returning();

   return welcomeEmailConfigurationSchema.parse({
      subject: updatedConfig[0].subject,
      bodyTemplate: updatedConfig[0].bodyTemplate,
   });
}
