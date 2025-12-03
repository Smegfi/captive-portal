import { device } from "@/server/db/schema/device";
import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
