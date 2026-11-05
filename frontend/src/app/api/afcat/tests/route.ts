import { NextResponse } from "next/server";
import { afcatStagingAdmin } from "@/lib/afcat/staging-server";
import { afcatMockLabel } from "@/lib/afcat/mock-labels";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = afcatStagingAdmin();
    const { data, error } = await db.from("afcat_tests")
      .select("id,code,kind,section,title,duration_seconds,expected_questions,max_marks,release_version")
      .eq("status", "PUBLISHED").eq("kind", "FULL_MOCK").like("code", "AFCAT-FM%").order("code");
    if (error) throw error;
    const tests = (data ?? []).map((t) => ({ ...t, title: afcatMockLabel(t.code, t.title) }));
    return NextResponse.json({ tests }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT unavailable" }, { status: 503 });
  }
}
