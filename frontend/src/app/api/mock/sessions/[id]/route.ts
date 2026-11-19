import { NextRequest, NextResponse } from "next/server";
import { mockAdmin, mockUser } from "@/lib/mock/server";
import { isMockExpired, isMockUuid, mockDeadline } from "@/lib/mock/engine";
import { sanitizeMockQuestion } from "@/lib/mock/serialize";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!isMockUuid(id)) return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = mockAdmin();
    const { data: session, error: sessionError } = await db.from("mock_sessions")
      .select("id,user_id,test_id,status,started_at,current_position")
      .eq("id", id).eq("user_id", user.id).maybeSingle();
    if (sessionError) throw sessionError;
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const { data: test, error: testError } = await db.from("mock_tests")
      .select("id,code,title,duration_seconds,expected_questions,correct_points,wrong_points,points_divisor,max_marks,blueprint")
      .eq("id", session.test_id).single();
    if (testError) throw testError;
    const { data: items, error: itemError } = await db.from("mock_test_items")
      .select("question_id,position,question_content_version").eq("test_id", session.test_id).order("position");
    if (itemError) throw itemError;
    const ids = (items ?? []).map((i) => i.question_id);
    if (ids.length !== test.expected_questions || ids.length !== new Set(ids).size)
      return NextResponse.json({ error: "Test content incomplete" }, { status: 409 });
    // Explicit column allow-list: the answer key and editorial columns are never selected here.
    const { data: questions, error: questionError } = await db.from("mock_questions")
      .select("id,subject,stem,options,content_version,editorial_status").in("id", ids);
    if (questionError) throw questionError;
    const byId = new Map((questions ?? []).map((q) => [q.id, q]));
    const sanitized = (items ?? []).map((item) => {
      const q = byId.get(item.question_id);
      if (!q || q.editorial_status !== "APPROVED" || q.content_version !== item.question_content_version) return null;
      try { return sanitizeMockQuestion(item.question_id, item.position, q.subject, q.stem, q.options); }
      catch { return null; }
    });
    if (sanitized.some((q) => !q)) return NextResponse.json({ error: "Test version mismatch" }, { status: 409 });
    const { data: saved, error: responseError } = await db.from("mock_responses")
      .select("question_id,selected_option,marked_for_review,time_spent_seconds")
      .eq("session_id", session.id).eq("user_id", user.id);
    if (responseError) throw responseError;
    return NextResponse.json({
      session: {
        id: session.id, status: session.status, startedAt: session.started_at,
        deadline: mockDeadline(session.started_at, test.duration_seconds),
        expired: isMockExpired(session.started_at, test.duration_seconds),
        title: test.title, code: test.code, currentPosition: session.current_position,
        marking: { correctPoints: test.correct_points, wrongPoints: test.wrong_points,
          pointsDivisor: test.points_divisor, maxMarks: Number(test.max_marks) },
        durationSeconds: test.duration_seconds,
      },
      serverNow: new Date().toISOString(),
      questions: sanitized,
      responses: saved ?? [],
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock session unavailable" }, { status: 503 });
  }
}
