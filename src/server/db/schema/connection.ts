import { device } from "@/server/db/schema/device";
import { network } from "@/server/db/schema/network";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, serial } from "drizzle-orm/pg-core";

export const connection = pgTable("connection", {
   id: serial("id").primaryKey(),
   deviceId: integer("device_id").references(() => device.id),
   networkId: integer("network_id").references(() => network.id),
   connection: jsonb("connection").notNull(),
});

export const connectionRelations = relations(connection, ({ one }) => ({
   device: one(device, {
      fields: [connection.deviceId],
      references: [device.id],
   }),
   network: one(network, {
      fields: [connection.networkId],
      references: [network.id],
   }),
}));
