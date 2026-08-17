import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";
import { listDevice } from "@/server/repositories/device/list";
import { NextResponse } from "next/server";

const EXPORT_BATCH_SIZE = 1000;

function escapeCsvValue(value: string): string {
   const escaped = value.replace(/"/g, '""');
   return `"${escaped}"`;
}

function parseQueryParams(request: Request) {
   const { searchParams } = new URL(request.url);
   const search = searchParams.get("search")?.trim() ?? "";
   const mac = searchParams.get("mac")?.trim() ?? "";
   const user = searchParams.get("user")?.trim() ?? "";
   const device = searchParams.get("device")?.trim() || "all";
   const connectedFromValue = searchParams.get("connectedFrom");
   const connectedToValue = searchParams.get("connectedTo");
   const connectedFrom = connectedFromValue ? new Date(connectedFromValue) : undefined;
   const connectedTo = connectedToValue ? new Date(connectedToValue) : undefined;

   return {
      search,
      mac,
      user,
      device,
      connectedFrom: connectedFrom && !Number.isNaN(connectedFrom.getTime()) ? connectedFrom : undefined,
      connectedTo: connectedTo && !Number.isNaN(connectedTo.getTime()) ? connectedTo : undefined,
   };
}

async function loadAllDevices(filters: ReturnType<typeof parseQueryParams>) {
   let page = 1;
   const devices: Array<{
      id: number;
      macAddress: string;
      firstSeenAt: Date;
      guestUser: { email: string } | null;
      device: { os?: { name?: string }; browser?: { name?: string } };
   }> = [];

   while (true) {
      const { data: result, serverError } = await listDevice({
         itemsPerPage: EXPORT_BATCH_SIZE,
         page,
         ...filters,
      });

      if (serverError) {
         throw new Error(serverError.message);
      }

      const pageDevices = result?.data ?? [];
      const totalPages = result?.totalPages ?? 0;
      devices.push(...pageDevices);

      if (totalPages === 0 || page >= totalPages) {
         break;
      }

      page += 1;
   }

   return devices;
}

function buildCsvContent(
   devices: Array<{
      id: number;
      macAddress: string;
      firstSeenAt: Date;
      guestUser: { email: string } | null;
      device: { os?: { name?: string }; browser?: { name?: string } };
   }>
) {
   const header = ["id", "macAddress", "email", "os", "browser", "firstSeenAt"].join(",");
   const rows = devices.map((entry) => {
      const osName = entry.device?.os?.name ?? "";
      const browserName = entry.device?.browser?.name ?? "";

      return [
         entry.id.toString(),
         escapeCsvValue(entry.macAddress),
         escapeCsvValue(entry.guestUser?.email ?? ""),
         escapeCsvValue(osName),
         escapeCsvValue(browserName),
         escapeCsvValue(entry.firstSeenAt.toISOString()),
      ].join(",");
   });

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
   const devices = await loadAllDevices(filters);
   const csv = buildCsvContent(devices);
   const datePart = new Date().toISOString().slice(0, 10);

   return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
         "Content-Type": "text/csv; charset=utf-8",
         "Content-Disposition": `attachment; filename="devices-${datePart}.csv"`,
         "Cache-Control": "no-store",
      },
   });
}
