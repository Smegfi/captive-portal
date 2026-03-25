import { listConnection } from "@/server/repositories/connection/list";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const itemsPerPage = searchParams.get("itemsPerPage") || "10";
   const page = searchParams.get("page") || "1";
   const search = searchParams.get("search") || "";

   const result = await listConnection({ itemsPerPage: parseInt(itemsPerPage), page: parseInt(page), search: search });

   if (result.serverError !== undefined) {
      return NextResponse.json(result.serverError, { status: result.serverError.status });
   }

   return NextResponse.json(result.data);
}
