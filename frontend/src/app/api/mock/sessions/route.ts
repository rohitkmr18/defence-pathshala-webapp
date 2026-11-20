import { NextRequest, NextResponse } from "next/server";
import { mockAdmin, mockUser } from "@/lib/mock/server";
import { isMockExpired, isMockUuid, mockDeadline, MOCK_PAPER_CDS_GK } from "@/lib/mock/engine";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    let body: unknown;
    try { body = await request.json(); } catch { body = null; }
    const testId = body && typeof body === "object" ? (body as Record<string, unknown>).testId : undefined;
    if (!isMockUuid(testId)) return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    const db = mockAdmin();
    const { data: test, error: testError } = await db.from("mock_tests")
      .select("id,status,release_version").eq("id", testId).eq("status", "PUBLISHED")
      .eq("paper_id", MOCK_PAPER_CDS_GK).maybeSingle();
    if (testError) throw testError;
    if (!test) return NextResponse.json({ error: "Test unavailable" }, { status: 404 });
    // Reuse an in-progress attempt instead of creating a duplicate on refresh.
    const { data: existing, error: lookupError } = await db.from("mock_sessions")
      .select("id").eq("user_id", user.id).eq("test_id", test.id).eq("status", "IN_PROGRESS")
      .order("started_at", { ascending: false }).limit(1);
    if (lookupError) throw lookupError;
    if (existing?.length) return NextResponse.json({ sessionId: existing[0].id, resumed: true }, { headers: NO_STORE });
    const { data: created, error } = await db.from("mock_sessions")
      .insert({ user_id: user.id, test_id: test.id, test_release_version: test.release_version })
      .select("id").single();
    if (error?.code === "23505") {
      // Concurrent start: the partial unique index picked a winner; return that row.
      const { data: winner, error: winnerError } = await db.from("mock_sessions")
        .select("id").eq("user_id", user.id).eq("test_id", test.id).eq("status", "IN_PROGRESS").single();
      if (winnerError) throw winnerError;
      return NextResponse.json({ sessionId: winner.id, resumed: true }, { headers: NO_STORE });
    }
    if (error) throw error;
    return NextResponse.json({ sessionId: created.id, resumed: false }, { status: 201, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Unable to start mock test" }, { status: 503 });
  }
}

/** The signed-in learner's CDS GK mock attempts, newest first (home dashboard and catalogue). */
export async function GET() {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const db = mockAdmin();
    const { data: sessions, error } = await db.from("mock_sessions")
      .select("id,test_id,status,started_at")
      .eq("user_id", user.id).order("started_at", { ascending: false }).limit(30);
    if (error) throw error;
    const testIds = [...new Set((sessions ?? []).map((x) => x.test_id))];
    const sessionIds = (sessions ?? []).map((x) => x.id);
    const [{ data: tests, error: te }, { data: results, error: re }] = await Promise.all([
      testIds.length ? db.from("mock_tests").select("id,code,title,paper_id,duration_seconds").in("id", testIds) : Promise.resolve({ data: [], error: null }),
      sessionIds.length ? db.from("mock_session_results")
        .select("session_id,score,max_marks,correct_count,incorrect_count,unanswered_count,completed_at")
        .eq("user_id", user.id).in("session_id", sessionIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (te) throw te;
    if (re) throw re;
    const testMap = new Map((tests ?? []).map((t) => [t.id, t]));
    const resultMap = new Map((results ?? []).map((r) => [r.session_id, r]));
    const attempts = (sessions ?? []).flatMap((s) => {
      const t = testMap.get(s.test_id);
      // Demo tests (dummy questions) are excluded from learner history.
      if (!t || t.paper_id !== MOCK_PAPER_CDS_GK || /-DEMO$/i.test(t.code)) return [];
      const r = resultMap.get(s.id);
      const expired = s.status === "IN_PROGRESS" && isMockExpired(s.started_at, t.duration_seconds);
      return [{
        sessionId: s.id, testId: s.test_id, code: t.code, title: t.title, status: s.status,
        startedAt: s.started_at, deadline: mockDeadline(s.started_at, t.duration_seconds), expired,
        result: r ? {
          score: Number(r.score), maxMarks: Number(r.max_marks), correct: r.correct_count,
          incorrect: r.incorrect_count, unanswered: r.unanswered_count, completedAt: r.completed_at,
        } : null,
      }];
    });
    return NextResponse.json({ attempts }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock attempts unavailable" }, { status: 503 });
  }
}
