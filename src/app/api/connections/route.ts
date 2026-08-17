import { listConnection } from "@/server/repositories/connection/list";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const itemsPerPage = searchParams.get("itemsPerPage") || "10";
   const page = searchParams.get("page") || "1";
   const search = searchParams.get("search") || "";
   const mac = searchParams.get("mac") || "";
   const network = searchParams.get("network") || "";
   const user = searchParams.get("user") || "";
   const updatedFromRaw = searchParams.get("updatedFrom");
   const updatedToRaw = searchParams.get("updatedTo");
   const updatedFrom = updatedFromRaw ? new Date(updatedFromRaw) : undefined;
   const updatedTo = updatedToRaw ? new Date(updatedToRaw) : undefined;

   const result = await listConnection({
      itemsPerPage: parseInt(itemsPerPage),
      page: parseInt(page),
      search,
      mac,
      network,
      user,
      updatedFrom: updatedFrom && !Number.isNaN(updatedFrom.getTime()) ? updatedFrom : undefined,
      updatedTo: updatedTo && !Number.isNaN(updatedTo.getTime()) ? updatedTo : undefined,
   });

   if (result.serverError !== undefined) {
      return NextResponse.json(result.serverError, { status: result.serverError.status });
   }

   return NextResponse.json(result.data);
}
