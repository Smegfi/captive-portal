import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const welcomeEmailConfig = pgTable("welcome_email_config", {
   id: serial("id").primaryKey(),
   subject: text("subject").notNull(),
   bodyTemplate: text("body_template").notNull(),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
