import { NextRequest, NextResponse } from "next/server";
import { mockAdmin, mockUser } from "@/lib/mock/server";
import { isMockUuid, mockMarks, type MockOption } from "@/lib/mock/engine";
import { mockExplanationText, sanitizeMockQuestion } from "@/lib/mock/serialize";
import { analyzeMock, mockOutcome } from "@/lib/mock/results";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: Context) {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!isMockUuid(id)) return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = mockAdmin();
    const { data: s, error: se } = await db.from("mock_sessions")
      .select("id,user_id,test_id,status,started_at").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (se) throw se;
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Answer keys and explanations are released only after authoritative submission or expiry.
    if (!["SUBMITTED", "EXPIRED"].includes(s.status))
      return NextResponse.json({ error: "Submit test before viewing results" }, { status: 409 });
    const { data: result, error: re } = await db.from("mock_session_results")
      .select("correct_count,incorrect_count,unanswered_count,score,max_marks,completed_at")
      .eq("session_id", id).eq("user_id", user.id).maybeSingle();
    if (re) throw re;
    if (!result) return NextResponse.json({ error: "Result not ready" }, { status: 409 });
    const { data: test, error: te } = await db.from("mock_tests")
      .select("code,title,correct_points,wrong_points,points_divisor,blueprint").eq("id", s.test_id).single();
    if (te) throw te;
    const { data: items, error: ie } = await db.from("mock_test_items")
      .select("question_id,position").eq("test_id", s.test_id).order("position");
    if (ie) throw ie;
    const ids = (items ?? []).map((x) => x.question_id);
    const { data: keys, error: ke } = await db.from("mock_questions")
      .select("id,subject,topic,difficulty,stem,options,correct_option,explanation").in("id", ids);
    if (ke) throw ke;
    const { data: responses, error: ae } = await db.from("mock_responses")
      .select("question_id,selected_option,marked_for_review,time_spent_seconds")
      .eq("session_id", id).eq("user_id", user.id);
    if (ae) throw ae;
    const keyMap = new Map((keys ?? []).map((x) => [x.id, x]));
    const answerMap = new Map((responses ?? []).map((x) => [x.question_id, x]));
    const marking = { correctPoints: test.correct_points, wrongPoints: test.wrong_points, pointsDivisor: test.points_divisor };
    const review = (items ?? []).map((item) => {
      const key = keyMap.get(item.question_id);
      const response = answerMap.get(item.question_id);
      let question = null;
      try { question = key ? sanitizeMockQuestion(item.question_id, item.position, key.subject, key.stem, key.options) : null; }
      catch { question = null; }
      const selected = (response?.selected_option ?? null) as MockOption | null;
      const correct = (key?.correct_option ?? null) as MockOption | null;
      const outcome = correct ? mockOutcome({ selected, correct }) : null;
      return {
        questionId: item.question_id, position: item.position,
        subject: key?.subject ?? null, topic: key?.topic ?? null, difficulty: key?.difficulty ?? null,
        selected, correct, outcome,
        marks: outcome === "CORRECT" ? mockMarks(1, 0, marking) : outcome === "INCORRECT" ? mockMarks(0, 1, marking) : 0,
        markedForReview: response?.marked_for_review ?? false,
        timeSpentSeconds: response?.time_spent_seconds ?? 0,
        explanation: mockExplanationText(key?.explanation),
        question,
      };
    });
    if (review.some((x) => !x.correct || !x.subject || !x.difficulty || !x.question))
      return NextResponse.json({ error: "Result content incomplete" }, { status: 409 });
    const analysis = analyzeMock(
      review.map((r) => ({ subject: r.subject as string, difficulty: r.difficulty as string, selected: r.selected, correct: r.correct as MockOption })),
      Object.keys((test.blueprint ?? {}) as Record<string, number>),
    );
    const attempted = result.correct_count + result.incorrect_count;
    return NextResponse.json({
      status: s.status, code: test.code, title: test.title, startedAt: s.started_at, completedAt: result.completed_at,
      summary: {
        ...result, score: Number(result.score), max_marks: Number(result.max_marks), attempted,
        accuracyPercent: attempted ? Math.round((result.correct_count / attempted) * 10000) / 100 : 0,
      },
      marking, analysis, review,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock result unavailable" }, { status: 503 });
  }
}
