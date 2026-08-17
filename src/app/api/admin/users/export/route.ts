import { canAccessPortal } from "@/lib/authorization";
import { auth } from "@/lib/auth";
import { listGuestUser } from "@/server/repositories/guest-user/list";
import { NextResponse } from "next/server";

const EXPORT_BATCH_SIZE = 1000;

function escapeCsvValue(value: string): string {
   const escaped = value.replace(/"/g, '""');
   return `"${escaped}"`;
}

type ExportGuestUser = {
   id: number;
   email: string;
   marketingApproved: boolean;
   createdAt: Date;
   updatedAt: Date;
   devices: { id: number }[];
};

function parseQueryParams(request: Request) {
   const { searchParams } = new URL(request.url);
   const search = searchParams.get("search")?.trim() ?? "";
   const email = searchParams.get("email")?.trim() ?? "";
   const marketing = searchParams.get("marketing")?.trim() || "all";
   const createdFromValue = searchParams.get("createdFrom");
   const createdToValue = searchParams.get("createdTo");
   const createdFrom = createdFromValue ? new Date(createdFromValue) : undefined;
   const createdTo = createdToValue ? new Date(createdToValue) : undefined;

   return {
      search,
      email,
      marketing,
      createdFrom: createdFrom && !Number.isNaN(createdFrom.getTime()) ? createdFrom : undefined,
      createdTo: createdTo && !Number.isNaN(createdTo.getTime()) ? createdTo : undefined,
   };
}

async function loadAllUsers(filters: ReturnType<typeof parseQueryParams>) {
   let page = 1;
   const users: ExportGuestUser[] = [];

   while (true) {
      const { data: result, serverError } = await listGuestUser({
         itemsPerPage: EXPORT_BATCH_SIZE,
         page,
         ...filters,
      });

      if (serverError) {
         throw new Error(serverError.message);
      }

      const pageUsers = (result?.data ?? []) as ExportGuestUser[];
      const totalPages = result?.totalPages ?? 0;
      users.push(...pageUsers);

      if (totalPages === 0 || page >= totalPages) {
         break;
      }

      page += 1;
   }

   return users;
}

function buildCsvContent(users: ExportGuestUser[]) {
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

   const filters = parseQueryParams(request);
   const users = await loadAllUsers(filters);

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
