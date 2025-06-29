import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { device } from "@/db/schema/device";

export const guestUser = pgTable("guest_user", {
   id: serial("id").primaryKey(),
   email: text("email").notNull().unique(),
   marketingApproved: boolean("marketing_approved").notNull().default(false),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});

export const guestUserRelations = relations(guestUser, ({ many }) => ({
   devices: many(device),
}));
