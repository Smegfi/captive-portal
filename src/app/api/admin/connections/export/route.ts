import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";
import { listConnection } from "@/server/repositories/connection/list";
import { NextResponse } from "next/server";

const EXPORT_BATCH_SIZE = 1000;

type ExportConnection = {
   connection: { id: number };
   device: { macAddress: string } | null;
   network: { name: string } | null;
   guest_user: { email: string; updatedAt: Date } | null;
};

function escapeCsvValue(value: string): string {
   const escaped = value.replace(/"/g, '""');
   return `"${escaped}"`;
}

function parseQueryParams(request: Request) {
   const { searchParams } = new URL(request.url);
   const search = searchParams.get("search")?.trim() ?? "";
   const mac = searchParams.get("mac")?.trim() ?? "";
   const network = searchParams.get("network")?.trim() ?? "";
   const user = searchParams.get("user")?.trim() ?? "";
   const updatedFromValue = searchParams.get("updatedFrom");
   const updatedToValue = searchParams.get("updatedTo");
   const updatedFrom = updatedFromValue ? new Date(updatedFromValue) : undefined;
   const updatedTo = updatedToValue ? new Date(updatedToValue) : undefined;

   return {
      search,
      mac,
      network,
      user,
      updatedFrom: updatedFrom && !Number.isNaN(updatedFrom.getTime()) ? updatedFrom : undefined,
      updatedTo: updatedTo && !Number.isNaN(updatedTo.getTime()) ? updatedTo : undefined,
   };
}

async function loadAllConnections(filters: ReturnType<typeof parseQueryParams>) {
   let page = 1;
   const connections: ExportConnection[] = [];

   while (true) {
      const { data: result, serverError } = await listConnection({
         itemsPerPage: EXPORT_BATCH_SIZE,
         page,
         ...filters,
      });

      if (serverError) {
         throw new Error(serverError.message);
      }

      const pageConnections = (result?.data ?? []) as ExportConnection[];
      const totalPages = result?.totalPages ?? 0;
      connections.push(...pageConnections);

      if (totalPages === 0 || page >= totalPages) {
         break;
      }

      page += 1;
   }

   return connections;
}

function buildCsvContent(connections: ExportConnection[]) {
   const header = ["id", "macAddress", "network", "userEmail", "updatedAt"].join(",");
   const rows = connections.map((entry) =>
      [
         entry.connection.id.toString(),
         escapeCsvValue(entry.device?.macAddress ?? ""),
         escapeCsvValue(entry.network?.name ?? ""),
         escapeCsvValue(entry.guest_user?.email ?? ""),
         escapeCsvValue(entry.guest_user?.updatedAt.toISOString() ?? ""),
      ].join(",")
   );

   return [header, ...rows].join("\n");
}

export async function GET(request: Request) {
   const session = await auth.api.getSession({
      headers: request.headers,
   });

   if (!session || !isAdminRole(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
   }

   const filters = parseQueryParams(request);
   const connections = await loadAllConnections(filters);
   const csv = buildCsvContent(connections);
   const datePart = new Date().toISOString().slice(0, 10);

   return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
         "Content-Type": "text/csv; charset=utf-8",
         "Content-Disposition": `attachment; filename="connections-${datePart}.csv"`,
         "Cache-Control": "no-store",
      },
   });
}
