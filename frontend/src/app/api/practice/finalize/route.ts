import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const client = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Read-only cookie context.
        }
      },
    },
  });
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") throw error;
  return user?.id || null;
}

function deterministicAttemptId(userId: string, sessionId: string, questionId: string) {
  const digest = createHash("sha256")
    .update(`${userId}:${sessionId}:${questionId}`)
    .digest("hex");
  return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-5${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Sign in again to submit this session" }, { status: 401 });
    }
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Final submission unavailable" }, { status: 503 });
    }

    const body = await request.json();
    const sessionId = String(body.session_id || "");
    const answers =
      body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
        ? (body.answers as Record<string, unknown>)
        : {};
    const questionTimes =
      body.question_times && typeof body.question_times === "object" && !Array.isArray(body.question_times)
        ? (body.question_times as Record<string, unknown>)
        : {};

    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session identity" }, { status: 400 });
    }

    const answerEntries = Object.entries(answers);
    if (answerEntries.length > 150) {
      return NextResponse.json({ error: "Invalid answer set" }, { status: 400 });
    }
    for (const [, option] of answerEntries) {
      if (!["A", "B", "C", "D"].includes(String(option).trim().toUpperCase())) {
        return NextResponse.json({ error: "Invalid selected option" }, { status: 400 });
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const questionIds = answerEntries.map(([id]) => id);

    const [sessionResult, questionsResult] = await Promise.all([
      supabase
        .from("practice_sessions")
        .select("id,user_id,question_ids,filters,mode,total_questions")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .maybeSingle(),
      questionIds.length
        ? supabase
            .from("v_dp_question_intelligence_v2")
            .select("id,final_opt")
            .in("id", questionIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (sessionResult.error || !sessionResult.data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (questionsResult.error) {
      return NextResponse.json({ error: "Could not validate final answers" }, { status: 503 });
    }

    const ownedSession = sessionResult.data;
    const allowed = new Set<string>(ownedSession.question_ids || []);
    if (questionIds.some((id) => !allowed.has(id))) {
      return NextResponse.json({ error: "Answer set contains a question outside this session" }, { status: 400 });
    }

    const canonical = new Map(
      (questionsResult.data || []).map((q) => [q.id, String(q.final_opt || "").trim().toUpperCase()])
    );
    if (canonical.size !== questionIds.length || [...canonical.values()].some((key) => !["A", "B", "C", "D"].includes(key))) {
      return NextResponse.json({ error: "Canonical answer unavailable for one or more questions" }, { status: 409 });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    const attemptRows = answerEntries.map(([questionId, rawOption]) => {
      const selected = String(rawOption).trim().toUpperCase();
      const isCorrect = selected === canonical.get(questionId);
      if (isCorrect) correctCount += 1;
      else incorrectCount += 1;
      const rawTime = Number(questionTimes[questionId] || 0);
      return {
        id: deterministicAttemptId(userId, sessionId, questionId),
        user_id: userId,
        question_id: questionId,
        selected_option: selected,
        is_correct: isCorrect,
        time_taken: Number.isFinite(rawTime) ? Math.max(0, Math.round(rawTime)) : 0,
        session_id: sessionId,
        mode: ownedSession.mode || body.mode || "instant",
      };
    });

    if (attemptRows.length) {
      const { error: attemptError } = await supabase
        .from("user_attempts")
        .upsert(attemptRows, { onConflict: "id" });
      if (attemptError) {
        console.error("Batch attempt finalization failed:", attemptError);
        return NextResponse.json({ error: "Final answers could not be saved" }, { status: 503 });
      }
    }

    const spent = Number(body.time_spent_seconds || 0);
    const currentIndex = Number(body.current_index);
    const filters = {
      ...(ownedSession.filters || {}),
      progress: {
        ...((ownedSession.filters || {}).progress || {}),
        question_times: questionTimes,
      },
    };
    const { data: completed, error: completionError } = await supabase
      .from("practice_sessions")
      .update({
        answers,
        is_completed: true,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        time_spent_seconds: Number.isFinite(spent) ? Math.max(0, Math.round(spent)) : 0,
        current_index: Number.isFinite(currentIndex)
          ? Math.max(0, Math.min(Math.round(currentIndex), Math.max(0, (ownedSession.total_questions || 1) - 1)))
          : Math.max(0, (ownedSession.total_questions || 1) - 1),
        filters,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("user_id", userId)
      .select("id,is_completed,correct_count,incorrect_count,time_spent_seconds")
      .single();

    if (completionError || !completed) {
      console.error("Session completion finalization failed:", completionError);
      return NextResponse.json({ error: "Session completion could not be saved" }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      persisted: true,
      session: completed,
      attempts_persisted: attemptRows.length,
    });
  } catch (error) {
    console.error("Practice finalization error:", error);
    return NextResponse.json({ error: "Final submission failed" }, { status: 500 });
  }
}
