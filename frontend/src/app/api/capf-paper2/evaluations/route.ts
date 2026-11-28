import { NextResponse } from "next/server";
import { istDayStart } from "@/lib/capf-p2-evaluator";
import { capfP2DailyLimit, capfP2User } from "@/lib/capf-p2-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

/** The signed-in learner's recent evaluations (read through RLS) and today's remaining quota. */
export async function GET() {
  const user = await capfP2User().catch(() => null);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers: NO_STORE });
  try {
    const client = await createClient();
    const { data, error } = await client.from("capf_p2_evaluations")
      .select("id,exam_year,question,part,input_mode,status,total_score,word_count,result,answer_text,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    const rows = data ?? [];
    const dayStart = istDayStart();
    const fresh = Date.now() - 10 * 60_000;
    const used = rows.filter((r) => r.created_at >= dayStart
      && (r.status === "COMPLETED" || (r.status === "PENDING" && Date.parse(r.created_at) > fresh))).length;
    const limit = capfP2DailyLimit();
    return NextResponse.json({
      limit,
      remaining: Math.max(0, limit - used),
      evaluations: rows.filter((r) => r.status === "COMPLETED"),
    }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Unable to load evaluations" }, { status: 503, headers: NO_STORE });
  }
}
