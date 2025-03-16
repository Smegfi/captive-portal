import { integer, pgTable as table, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const sessionsTable = table("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  networkId: varchar({ length: 255 }).notNull(),
  deviceId: varchar({ length: 255 }).notNull(),
  loginTime: timestamp().notNull(),
  magic: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull(),
});

export const devicesTable = table("devices", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mac: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull(),
});

export const networksTable = table("networks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  ssid: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull(),
});

export const usersTable = table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  marketingApproved: boolean().notNull(),
  createdAt: timestamp().notNull(),
});



