-- TOS versioning & lifecycle.
-- Idempotent: safe to run regardless of whether `drizzle-kit push` already
-- added the new columns.

ALTER TABLE "tos" ADD COLUMN IF NOT EXISTS "version_number" integer;
ALTER TABLE "tos" ADD COLUMN IF NOT EXISTS "active_from" timestamp with time zone;
ALTER TABLE "tos" ADD COLUMN IF NOT EXISTS "active_to" timestamp with time zone;

-- Uploads now default to inactive drafts.
ALTER TABLE "tos" ALTER COLUMN "is_active" SET DEFAULT false;

-- Backfill existing rows (one-time). Only runs if no row has been migrated yet
-- (i.e. version_number is null everywhere).
DO $$
DECLARE
   newest_active_id integer;
BEGIN
   IF EXISTS (SELECT 1 FROM "tos" WHERE "version_number" IS NOT NULL) THEN
      RETURN;
   END IF;

   -- Pick the single newest currently-active document as the seeded active one.
   SELECT "id"
   INTO newest_active_id
   FROM "tos"
   WHERE "is_active" = true
   ORDER BY "uploaded_at" DESC, "id" DESC
   LIMIT 1;

   IF newest_active_id IS NOT NULL THEN
      UPDATE "tos"
      SET "version_number" = 1,
          "active_from" = "uploaded_at",
          "is_active" = true
      WHERE "id" = newest_active_id;
   END IF;

   -- Every other row becomes a deletable, never-activated draft.
   UPDATE "tos"
   SET "is_active" = false
   WHERE "id" IS DISTINCT FROM newest_active_id;
END $$;
