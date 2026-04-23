import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const guestUserCleanupConfig = pgTable("guest_user_cleanup_config", {
   id: serial("id").primaryKey(),
   retentionMonths: integer("retention_months").notNull().default(6),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});
