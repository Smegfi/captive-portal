import { device } from "@/server/db/schema/device";
import { tos } from "@/server/db/schema/tos";
import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const guestUser = pgTable("guest_user", {
   id: serial("id").primaryKey(),
   email: text("email").notNull().unique(),
   marketingApproved: boolean("marketing_approved").notNull().default(false),
   acceptedTosId: integer("accepted_tos_id").references(() => tos.id),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});

export const guestUserRelations = relations(guestUser, ({ many, one }) => ({
   devices: many(device),
   acceptedTos: one(tos, { fields: [guestUser.acceptedTosId], references: [tos.id] }),
}));
