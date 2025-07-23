import { getLatestConnectionsAction } from "@/server/actions/connection-actions";
import { NextResponse } from "next/server";

export async function GET() {
   const result = await getLatestConnectionsAction();

   if (result.serverError !== undefined) {
      return NextResponse.json(result.serverError, { status: result.serverError.status });
   }

   return NextResponse.json(result.data);
}
