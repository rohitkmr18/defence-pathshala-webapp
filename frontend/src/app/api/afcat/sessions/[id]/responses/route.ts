import { NextRequest, NextResponse } from "next/server";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
import { isAfcatExpired } from "@/lib/afcat/engine";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
const isUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object" || !("questionId" in payload) ||
        !isUuid(payload.questionId) || !("selected" in payload) ||
        !(payload.selected === null || ["A","B","C","D"].includes(String(payload.selected))) ||
        !("markedForReview" in payload) || typeof payload.markedForReview !== "boolean" ||
        ("timeSpentSeconds" in payload && !(Number.isInteger(payload.timeSpentSeconds) &&
          (payload.timeSpentSeconds as number) >= 0))) {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }
    const db = afcatStagingAdmin();
    const { data: session, error } = await db.from("afcat_sessions")
      .select("id,test_id,status,started_at,user_id").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.status !== "IN_PROGRESS") return NextResponse.json({ error: "Session closed" }, { status: 409 });
    const { data: test, error: testError } = await db.from("afcat_tests")
      .select("duration_seconds").eq("id", session.test_id).single();
    if (testError) throw testError;
    if (isAfcatExpired(session.started_at, test.duration_seconds))
      return NextResponse.json({ error: "Time expired" }, { status: 409 });
    const { data: item, error: itemError } = await db.from("afcat_test_items")
      .select("question_id").eq("test_id", session.test_id).eq("question_id", payload.questionId).maybeSingle();
    if (itemError) throw itemError;
    if (!item) return NextResponse.json({ error: "Question not assigned" }, { status: 400 });
    // Time on a question is analysis-only (never scored). The client reports a cumulative
    // value; the server caps it at the time elapsed since the session started.
    const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(session.started_at)) / 1000));
    const timeSpent = "timeSpentSeconds" in payload
      ? Math.min(payload.timeSpentSeconds as number, elapsed, test.duration_seconds) : undefined;
    const { error: saveError } = await db.from("afcat_responses").upsert({
      session_id: session.id, user_id: user.id, question_id: payload.questionId,
      selected_option: payload.selected, marked_for_review: payload.markedForReview,
      answered_at: payload.selected === null ? null : new Date().toISOString(),
      ...(timeSpent === undefined ? {} : { time_spent_seconds: timeSpent }),
    }, { onConflict: "session_id,question_id" });
    if (saveError) throw saveError;
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT staging autosave unavailable" }, { status: 503 });
  }
}
