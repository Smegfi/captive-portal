import { user } from "@/server/db/schema/user";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const session = pgTable("session", {
   id: text("id").primaryKey(),
   expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
   token: text("token").notNull().unique(),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
   ipAddress: text("ip_address"),
   userAgent: text("user_agent"),
   impersonatedBy: text("impersonated_by"),
   userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
});
