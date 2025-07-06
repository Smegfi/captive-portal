import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { device } from "@/db/schema/device";
import { network } from "@/db/schema/network";
import { relations } from "drizzle-orm";

export const connection = pgTable("connection", {
   id: serial("id").primaryKey(),
   deviceId: integer("device_id").references(() => device.id),
   networkId: integer("network_id").references(() => network.id),
   clientIp: text("client_ip").notNull(),
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
