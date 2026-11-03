import { NextRequest, NextResponse } from "next/server";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
import { analyzeAfcatAttempt, type AfcatReviewItem, type AfcatSection } from "@/lib/afcat/results-analytics";
import { sanitizeAfcatQuestion } from "@/lib/afcat/serialize";
import { AFCAT_ASSET_COLUMNS, groupAfcatAssets, type AfcatAssetRow } from "@/lib/afcat/assets";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
const explanationText = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value) &&
  typeof (value as Record<string, unknown>).text === "string" ? (value as { text: string }).text : null;

export async function GET(_req: NextRequest, context: Context) {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = afcatStagingAdmin();
    const { data: s, error: se } = await db.from("afcat_sessions")
      .select("id,user_id,test_id,status").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (se) throw se;
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Answer keys and explanations are released only after authoritative submission or expiry.
    if (!["SUBMITTED","EXPIRED"].includes(s.status))
      return NextResponse.json({ error: "Submit test before viewing results" }, { status: 409 });
    const { data: result, error: re } = await db.from("afcat_session_results")
      .select("correct_count,incorrect_count,unanswered_count,score,max_marks,completed_at")
      .eq("session_id", id).eq("user_id", user.id).maybeSingle();
    if (re) throw re;
    if (!result) return NextResponse.json({ error: "Result not ready" }, { status: 409 });
    const { data: items, error: ie } = await db.from("afcat_test_items")
      .select("question_id,position").eq("test_id", s.test_id).order("position");
    if (ie) throw ie;
    const ids = (items ?? []).map(x => x.question_id);
    const { data: keys, error: ke } = await db.from("afcat_questions")
      .select("id,section,topic,subtopic,difficulty,stem,options,correct_option,explanation").in("id", ids);
    if (ke) throw ke;
    const { data: responses, error: ae } = await db.from("afcat_responses")
      .select("question_id,selected_option,marked_for_review,time_spent_seconds").eq("session_id", id).eq("user_id", user.id);
    if (ae) throw ae;
    const { data: assetRows, error: ase } = await db.from("afcat_question_assets").select(AFCAT_ASSET_COLUMNS).in("question_id", ids);
    if (ase) throw ase;
    const assetsByQuestion = groupAfcatAssets((assetRows ?? []) as AfcatAssetRow[]);
    const keyMap = new Map((keys ?? []).map(x => [x.id, x]));
    const answerMap = new Map((responses ?? []).map(x => [x.question_id, x]));
    const review = (items ?? []).map(item => {
      const key = keyMap.get(item.question_id);
      const response = answerMap.get(item.question_id);
      let question = null;
      try {
        question = key ? sanitizeAfcatQuestion(item.question_id, item.position, key.stem, key.options, assetsByQuestion.get(item.question_id)) : null;
      } catch {
        question = null;
      }
      return {
        questionId: item.question_id, position: item.position,
        section: key?.section as AfcatSection,
        topic: key?.topic ?? null, subtopic: key?.subtopic ?? null, difficulty: key?.difficulty ?? null,
        selected: response?.selected_option ?? null,
        correct: key?.correct_option ?? null,
        markedForReview: response?.marked_for_review ?? false,
        timeSpentSeconds: response?.time_spent_seconds ?? 0,
        explanation: explanationText(key?.explanation),
        question,
      };
    });
    if (review.some(x => !x.correct || !x.section || !x.question))
      return NextResponse.json({ error: "Result content incomplete" }, { status: 409 });
    const analysis = analyzeAfcatAttempt(review as AfcatReviewItem[]);
    return NextResponse.json({ status: s.status, summary: result, sections: analysis.sections, analysis, review },
      { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT result unavailable" }, { status: 503 });
  }
}
