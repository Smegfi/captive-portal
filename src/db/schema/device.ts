import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { guestUser } from "@/db/schema/guest-user";

export const device = pgTable("device", {
   id: serial("id").primaryKey(),
   userId: integer("user_id").references(() => guestUser.id),
   macAddress: text("mac_address").notNull().unique(),
   firstSeenAt: timestamp("first_seen").notNull(),
});
