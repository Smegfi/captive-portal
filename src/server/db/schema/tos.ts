import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tos = pgTable("tos", {
   id: serial("id").primaryKey(),
   name: text("name").notNull(),
   fileName: text("file").notNull(),
   fileSize: integer("file_size").notNull(),
   fileUrl: text("file_url").notNull(),
   uploadedAt: timestamp("uploaded_at").notNull(),
});
