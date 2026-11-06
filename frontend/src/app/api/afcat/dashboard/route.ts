import { NextResponse } from "next/server";
import { afcatMockLabel } from "@/lib/afcat/mock-labels";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
import {
  summarizeAfcatSections,
  summarizeAfcatTopics,
  type AfcatKey,
  type AfcatReviewItem,
  type AfcatSection,
} from "@/lib/afcat/results-analytics";

export const dynamic = "force-dynamic";

/**
 * Learner's AFCAT history across every submitted mock: scores, trend, section accuracy
 * and weakest topics. Answer keys are only read for SUBMITTED/EXPIRED sessions.
 */
export async function GET() {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const db = afcatStagingAdmin();

    const { data: sessions, error: se } = await db.from("afcat_sessions")
      .select("id,test_id,status,elapsed_seconds,started_at,finished_at")
      .eq("user_id", user.id).order("started_at", { ascending: false }).limit(50);
    if (se) throw se;
    const all = sessions ?? [];
    const done = all.filter((s) => s.status === "SUBMITTED" || s.status === "EXPIRED");
    const inProgress = all.find((s) => s.status === "IN_PROGRESS") ?? null;

    const testIds = [...new Set(all.map((s) => s.test_id))];
    const { data: tests, error: te } = testIds.length
      ? await db.from("afcat_tests").select("id,code,title,max_marks,duration_seconds").in("id", testIds)
      : { data: [], error: null };
    if (te) throw te;
    const testById = new Map((tests ?? []).map((t) => [t.id, t]));

    const doneIds = done.map((s) => s.id);
    const { data: results, error: re } = doneIds.length
      ? await db.from("afcat_session_results")
        .select("session_id,correct_count,incorrect_count,unanswered_count,score,max_marks,completed_at")
        .in("session_id", doneIds).eq("user_id", user.id)
      : { data: [], error: null };
    if (re) throw re;
    const resultBySession = new Map((results ?? []).map((r) => [r.session_id, r]));

    // Section / topic accuracy across all submitted attempts.
    const { data: items, error: ie } = doneIds.length
      ? await db.from("afcat_test_items").select("test_id,question_id,position").in("test_id", [...new Set(done.map((s) => s.test_id))])
      : { data: [], error: null };
    if (ie) throw ie;
    const questionIds = [...new Set((items ?? []).map((i) => i.question_id))];
    const { data: keys, error: ke } = questionIds.length
      ? await db.from("afcat_questions").select("id,section,topic,subtopic,difficulty,correct_option").in("id", questionIds)
      : { data: [], error: null };
    if (ke) throw ke;
    const { data: responses, error: ae } = doneIds.length
      ? await db.from("afcat_responses").select("session_id,question_id,selected_option,time_spent_seconds")
        .in("session_id", doneIds).eq("user_id", user.id)
      : { data: [], error: null };
    if (ae) throw ae;

    const keyById = new Map((keys ?? []).map((k) => [k.id, k]));
    const responseKey = (sessionId: string, questionId: string) => `${sessionId}:${questionId}`;
    const responseMap = new Map((responses ?? []).map((r) => [responseKey(r.session_id, r.question_id), r]));
    const review: AfcatReviewItem[] = [];
    for (const session of done) {
      for (const item of (items ?? []).filter((i) => i.test_id === session.test_id)) {
        const key = keyById.get(item.question_id);
        if (!key?.section || !key.correct_option) continue;
        const response = responseMap.get(responseKey(session.id, item.question_id));
        review.push({
          questionId: item.question_id, position: item.position,
          section: key.section as AfcatSection, topic: key.topic, subtopic: key.subtopic,
          difficulty: key.difficulty as AfcatReviewItem["difficulty"],
          selected: (response?.selected_option as AfcatKey | null) ?? null,
          correct: key.correct_option as AfcatKey, explanation: null,
          timeSpentSeconds: response?.time_spent_seconds ?? 0,
        });
      }
    }

    const attempts = done.map((s) => {
      const r = resultBySession.get(s.id);
      const t = testById.get(s.test_id);
      return {
        sessionId: s.id, title: t ? afcatMockLabel(t.code, t.title) : "AFCAT mock", status: s.status,
        score: r?.score ?? null, maxMarks: r?.max_marks ?? t?.max_marks ?? 300,
        correct: r?.correct_count ?? 0, incorrect: r?.incorrect_count ?? 0, unanswered: r?.unanswered_count ?? 0,
        timeSeconds: s.elapsed_seconds ?? 0, completedAt: r?.completed_at ?? s.finished_at,
      };
    });
    const scored = attempts.filter((a) => a.score !== null);
    const topics = summarizeAfcatTopics(review).filter((t) => t.total >= 2)
      .sort((a, b) => b.marksLost - a.marksLost).slice(0, 6);

    return NextResponse.json({
      attempts,
      inProgress: inProgress ? { sessionId: inProgress.id, title: (() => { const t = testById.get(inProgress.test_id); return t ? afcatMockLabel(t.code, t.title) : "AFCAT mock"; })() } : null,
      bestScore: scored.length ? Math.max(...scored.map((a) => a.score as number)) : null,
      averageScore: scored.length ? Math.round(scored.reduce((s, a) => s + (a.score as number), 0) / scored.length) : null,
      sections: review.length ? summarizeAfcatSections(review) : [],
      weakTopics: topics,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT dashboard unavailable" }, { status: 503 });
  }
}
