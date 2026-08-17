import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("email_verified").notNull(),
   image: text("image"),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
   role: text("role").notNull(),
   banned: boolean("banned"),
   banReason: text("ban_reason"),
   banExpires: timestamp("ban_expires", { withTimezone: true }),
});
