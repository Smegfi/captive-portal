import { pgTable, text, timestamp, serial, boolean } from "drizzle-orm/pg-core";

export const network = pgTable("network", {
   id: serial("id").primaryKey(),
   name: text("name").notNull(),
   ssid: text("ssid").notNull(),
   isActive: boolean("is_active").notNull().default(true),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
