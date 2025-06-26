import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { device } from "@/db/schema/device";
import { network } from "@/db/schema/network";

export const connection = pgTable("connection", {
   id: serial("id").primaryKey(),
   deviceId: integer("device_id").references(() => device.id),
   networkId: integer("network_id").references(() => network.id),
   clientIp: text("client_ip").notNull(),
});
