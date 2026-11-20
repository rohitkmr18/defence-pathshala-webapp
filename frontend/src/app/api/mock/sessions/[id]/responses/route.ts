import { NextRequest, NextResponse } from "next/server";
import { mockAdmin, mockUser } from "@/lib/mock/server";
import { isMockExpired, isMockUuid, parseMockResponsePayload } from "@/lib/mock/engine";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!isMockUuid(id)) return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    let body: unknown;
    try { body = await request.json(); } catch { body = null; }
    const payload = parseMockResponsePayload(body);
    if (!payload) return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    const db = mockAdmin();
    // Membership of the question in the session's test and the deadline are enforced by the
    // mock_response_gate trigger inside the same write; the checks here only fail fast.
    const { data: session, error } = await db.from("mock_sessions")
      .select("id,status,started_at,mock_tests(duration_seconds)")
      .eq("id", id).eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.status !== "IN_PROGRESS") return NextResponse.json({ error: "Session closed" }, { status: 409 });
    const testRow = Array.isArray(session.mock_tests) ? session.mock_tests[0] : session.mock_tests;
    const durationSeconds = testRow?.duration_seconds;
    if (!Number.isInteger(durationSeconds)) throw new Error("Mock test not found");
    if (isMockExpired(session.started_at, durationSeconds)) return NextResponse.json({ error: "Time expired" }, { status: 409 });
    // Time on a question is analysis-only (never scored); cap the client's cumulative value.
    const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(session.started_at)) / 1000));
    const timeSpent = payload.timeSpentSeconds === undefined ? undefined
      : Math.min(payload.timeSpentSeconds, elapsed, durationSeconds);
    const { error: saveError } = await db.from("mock_responses").upsert({
      session_id: session.id, user_id: user.id, question_id: payload.questionId,
      selected_option: payload.selected, marked_for_review: payload.markedForReview,
      answered_at: payload.selected === null ? null : new Date().toISOString(),
      ...(timeSpent === undefined ? {} : { time_spent_seconds: timeSpent }),
    }, { onConflict: "session_id,question_id" });
    if (saveError) {
      const message = String(saveError.message ?? "");
      if (/deadline passed/i.test(message)) return NextResponse.json({ error: "Time expired" }, { status: 409 });
      if (/Invalid or closed mock response/i.test(message))
        return NextResponse.json({ error: "Question not assigned" }, { status: 400 });
      throw saveError;
    }
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock autosave unavailable" }, { status: 503 });
  }
}
