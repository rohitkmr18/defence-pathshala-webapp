import { NextResponse } from "next/server";
import { mockAdmin } from "@/lib/mock/server";
import { MOCK_PAPER_CDS_GK } from "@/lib/mock/engine";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = mockAdmin();
    const { data, error } = await db.from("mock_tests")
      .select("id,code,paper_id,title,duration_seconds,expected_questions,correct_points,wrong_points,points_divisor,max_marks,blueprint,release_version")
      .eq("status", "PUBLISHED").eq("paper_id", MOCK_PAPER_CDS_GK).order("code");
    if (error) throw error;
    return NextResponse.json({ tests: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock tests unavailable" }, { status: 503 });
  }
}
