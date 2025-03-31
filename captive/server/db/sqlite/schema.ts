import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const sessionsTable = sqliteTable("sessions", {
  id: integer().primaryKey({autoIncrement: true}),
  userId: integer().notNull(),
  networkId: integer().notNull(),
  deviceId: integer().notNull(),
  loginTime: text().notNull(),
  magic: text().notNull(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});

export const devicesTable = sqliteTable("devices", {
  id: integer().primaryKey({autoIncrement: true}),
  mac: text().notNull(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});

export const networksTable = sqliteTable("networks", {
  id: integer().primaryKey({autoIncrement: true}),
  name: text().notNull(),
  ssid: text().notNull(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({autoIncrement: true}),
  email: text().notNull(),
  marketingApproved: integer({ mode: "boolean" }).notNull(),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});