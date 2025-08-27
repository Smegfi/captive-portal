import { connection } from "@/db/schema/connection";
import { guestUser } from "@/db/schema/guest-user";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const device = pgTable("device", {
   id: serial("id").primaryKey(),
   userId: integer("user_id").references(() => guestUser.id),
   macAddress: text("mac_address").notNull(),
   device: jsonb("device").notNull(),
   firstSeenAt: timestamp("first_seen").notNull(),
});

export const deviceRelations = relations(device, ({ one, many }) => ({
   guestUser: one(guestUser, { fields: [device.userId], references: [guestUser.id] }),
   connections: many(connection),
}));
