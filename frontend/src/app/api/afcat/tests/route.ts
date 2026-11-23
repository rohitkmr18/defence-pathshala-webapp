import { NextResponse } from "next/server";
import { getPublishedAfcatMocks } from "@/lib/afcat/public-catalogue";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const tests = await getPublishedAfcatMocks();
    return NextResponse.json({ tests }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT unavailable" }, { status: 503 });
  }
}
