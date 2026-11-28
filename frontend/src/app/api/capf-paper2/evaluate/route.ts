import { NextRequest, NextResponse } from "next/server";
import {
  CAPF_P2_RUBRIC_VERSION,
  countWords,
  findTarget,
  istDayStart,
  normaliseEvaluation,
  validateImages,
  validateTypedAnswer,
  type ImageInput,
} from "@/lib/capf-p2-evaluator";
import { callClaude, capfP2Admin, capfP2DailyLimit, capfP2Model, capfP2User, EvaluatorUnavailable } from "@/lib/capf-p2-server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;
const NO_STORE = { "Cache-Control": "no-store" };

function fail(status: number, error: string, code?: string) {
  return NextResponse.json({ error, code }, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  const user = await capfP2User().catch(() => null);
  if (!user) return fail(401, "Sign in to get your answer evaluated.", "SIGN_IN");

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return fail(400, "Invalid request.");
  }

  const target = findTarget(body.year, body.question, body.part);
  if (!target) return fail(400, "Unknown question.");
  const mode = body.mode === "photo" ? "photo" : body.mode === "typed" ? "typed" : null;
  if (!mode) return fail(400, "Choose typed or photo answer.");

  const answerText = mode === "typed" ? String(body.answer ?? "") : undefined;
  const images = mode === "photo" ? (body.images as ImageInput[]) : undefined;
  const invalid = mode === "typed" ? validateTypedAnswer(answerText) : validateImages(images);
  if (invalid) return fail(400, invalid);
  const typedWordCount = mode === "typed" ? countWords(answerText!) : null;

  let db: ReturnType<typeof capfP2Admin>;
  try {
    db = capfP2Admin();
  } catch {
    return fail(503, "The evaluator is not available right now.", "UNAVAILABLE");
  }

  const limit = capfP2DailyLimit();
  const { data: evaluationId, error: reserveError } = await db.rpc("capf_p2_reserve_evaluation", {
    p_user: user.id, p_year: target.year, p_question: target.question, p_part: target.part,
    p_mode: mode, p_rubric: CAPF_P2_RUBRIC_VERSION, p_limit: limit, p_day_start: istDayStart(),
  });
  if (reserveError) {
    if (reserveError.message?.includes("CAPF_P2_DAILY_LIMIT")) {
      return fail(429, `You have used today's ${limit} free evaluations. Come back tomorrow.`, "DAILY_LIMIT");
    }
    return fail(503, "The evaluator is not available right now.", "UNAVAILABLE");
  }

  try {
    const claude = await callClaude(target, { mode, answerText, wordCount: typedWordCount, images });
    const evaluation = normaliseEvaluation(claude.input, target.question, { typedWordCount });
    const { error: saveError } = await db.from("capf_p2_evaluations").update({
      status: "COMPLETED",
      answer_text: mode === "typed" ? answerText : evaluation.transcription,
      word_count: evaluation.wordCount,
      result: evaluation,
      total_score: evaluation.total,
      model: capfP2Model(),
      input_tokens: claude.inputTokens,
      output_tokens: claude.outputTokens,
      completed_at: new Date().toISOString(),
    }).eq("id", evaluationId).eq("user_id", user.id);
    if (saveError) throw saveError;
    return NextResponse.json({ id: evaluationId, evaluation }, { headers: NO_STORE });
  } catch (error) {
    // Failed attempts do not count towards the daily limit.
    await db.from("capf_p2_evaluations").update({ status: "FAILED" }).eq("id", evaluationId).eq("user_id", user.id);
    if (error instanceof EvaluatorUnavailable) return fail(503, "The evaluator is not available right now.", "UNAVAILABLE");
    return fail(502, "We could not evaluate this answer. Please try again; this attempt was not counted.", "EVALUATION_FAILED");
  }
}
