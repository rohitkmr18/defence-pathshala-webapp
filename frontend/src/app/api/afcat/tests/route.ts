import { NextResponse } from "next/server";
import { afcatStagingAdmin } from "@/lib/afcat/staging-server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = afcatStagingAdmin();
    const { data, error } = await db.from("afcat_tests")
      .select("id,code,kind,section,title,duration_seconds,expected_questions,max_marks,release_version")
      .eq("status", "PUBLISHED").order("code");
    if (error) throw error;
    return NextResponse.json({ tests: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT staging unavailable" }, { status: 503 });
  }
}
