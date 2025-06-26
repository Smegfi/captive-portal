import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

export const guestUser = pgTable("guest_user", {
   id: serial("id").primaryKey(),
   email: text("email").notNull().unique(),
   marketingApproved: boolean("marketing_approved").notNull().default(false),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});
