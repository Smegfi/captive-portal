import { db } from "@/server/db/db";
import { tos } from "@/server/db/schema/tos";
import { eq } from "drizzle-orm";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ fileUUID: string }> }) {
   const { fileUUID } = await params;

   if (!UUID_REGEX.test(fileUUID)) {
      return new NextResponse("Invalid file identifier", { status: 400 });
   }

   const record = await db.query.tos.findFirst({
      where: eq(tos.fileUUID, fileUUID),
   });

   if (!record) {
      return new NextResponse("File not found", { status: 404 });
   }

   // storagePath comes from the DB (trusted), but resolve and verify it stays
   // within the uploads root as a defense-in-depth against path traversal.
   const absolutePath = path.resolve(UPLOADS_ROOT, record.storagePath);
   if (absolutePath !== UPLOADS_ROOT && !absolutePath.startsWith(UPLOADS_ROOT + path.sep)) {
      return new NextResponse("File not found", { status: 404 });
   }

   let buffer: Buffer;
   try {
      buffer = await fs.promises.readFile(absolutePath);
   } catch {
      return new NextResponse("File not found", { status: 404 });
   }

   const asciiFallback = record.fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'");
   const encodedFileName = encodeURIComponent(record.fileName);

   return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
         "Content-Type": DOCX_MIME,
         "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedFileName}`,
         "Content-Length": buffer.byteLength.toString(),
         "Cache-Control": "public, max-age=31536000, immutable",
      },
   });
}
