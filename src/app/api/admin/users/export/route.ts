import { canAccessPortal } from "@/lib/authorization";
import { auth } from "@/lib/auth";
import { db } from "@/server/db/db";
import { guestUser } from "@/server/db/schema/guest-user";
import { ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

function escapeCsvValue(value: string): string {
   const escaped = value.replace(/"/g, '""');
   return `"${escaped}"`;
}

function buildCsvContent(
   users: {
      id: number;
      email: string;
      marketingApproved: boolean;
      createdAt: Date;
      updatedAt: Date;
      devices: { id: number }[];
   }[]
) {
   const header = ["id", "email", "marketingApproved", "createdAt", "updatedAt", "deviceCount"].join(",");
   const rows = users.map((user) =>
      [
         user.id.toString(),
         escapeCsvValue(user.email),
         user.marketingApproved ? "true" : "false",
         escapeCsvValue(user.createdAt.toISOString()),
         escapeCsvValue(user.updatedAt.toISOString()),
         user.devices.length.toString(),
      ].join(",")
   );

   return [header, ...rows].join("\n");
}

export async function GET(request: Request) {
   const session = await auth.api.getSession({
      headers: request.headers,
   });

   if (!session || !canAccessPortal(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
   }

   const { searchParams } = new URL(request.url);
   const search = searchParams.get("search")?.trim() ?? "";

   const users = await db.query.guestUser.findMany({
      where: search ? ilike(guestUser.email, `%${search}%`) : undefined,
      orderBy: (guestUserTable, { desc }) => [desc(guestUserTable.createdAt)],
      with: {
         devices: {
            columns: {
               id: true,
            },
         },
      },
   });

   const csv = buildCsvContent(users);
   const datePart = new Date().toISOString().slice(0, 10);

   return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
         "Content-Type": "text/csv; charset=utf-8",
         "Content-Disposition": `attachment; filename="guest-users-${datePart}.csv"`,
         "Cache-Control": "no-store",
      },
   });
}
