import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tos = pgTable("tos", {
   id: serial("id").primaryKey(),
   name: text("name").notNull(),
   fileName: text("file").notNull(),
   fileSize: integer("file_size").notNull(),
   fileUUID: text("file_uuid").notNull().unique(),
   storagePath: text("storage_path").notNull(),
   isActive: boolean("is_active").notNull().default(false),
   htmlContent: text("html_content"),
   uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull(),
   // Global, monotonically increasing version counter assigned at first activation.
   // The displayed label (d/m/yyyy-N) is derived from activeFrom + versionNumber.
   versionNumber: integer("version_number"),
   // Set when the document is first activated; presence of this value also means
   // the document is immutable (cannot be renamed or deleted).
   activeFrom: timestamp("active_from", { withTimezone: true }),
   // Set when the document is superseded by activating a different document.
   activeTo: timestamp("active_to", { withTimezone: true }),
});
