
import { errorMessage } from "@/lib/error-message";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const supabaseUserClient = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Read-only
          }
        },
      },
    });
    const {
      data: { user },
      error,
    } = await supabaseUserClient.auth.getUser();
    if (error && error.name !== "AuthSessionMissingError") throw error;
    return user?.id || null;
  } catch {
    throw new Error("Could not verify your account. Sign in again to save progress.");
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({
        activeSession: null,
        recentSessions: [],
        totalAttempts: 0,
        accuracy: 0,
        mistakeCount: 0,
      });
    }

    if (!serviceRoleKey) return NextResponse.json({ error: "Session persistence unavailable" }, { status: 503 });
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const requestedSessionId = request.nextUrl.searchParams.get("session_id");
    if (requestedSessionId) {
      const includeCompleted = request.nextUrl.searchParams.get("include_completed") === "true";
      let query = supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("id", requestedSessionId);
      if (!includeCompleted) query = query.eq("is_completed", false);
      const { data, error } = await query.maybeSingle();
      if (error) return NextResponse.json({ error: "Saved session unavailable" }, { status: 503 });
      if (!data) {
        return NextResponse.json({ error: "Saved session unavailable" }, { status: 404 });
      }
      return NextResponse.json({ activeSession: data });
    }

    // Independent reads run together rather than adding three round-trip waits.
    const [attemptResult, activeResult, recentResult] = await Promise.all([
      supabase.from("user_attempts")
        .select("id, question_id, is_correct, time_taken, attempted_at")
        .eq("user_id", userId).order("attempted_at", { ascending: false }).limit(200),
      supabase.from("practice_sessions").select("*")
        .eq("user_id", userId).eq("is_completed", false)
        .order("updated_at", { ascending: false }).limit(1),
      supabase.from("practice_sessions").select("*")
        .eq("user_id", userId).order("updated_at", { ascending: false }).limit(10),
    ]);
    if (attemptResult.error || activeResult.error || recentResult.error) return NextResponse.json({ error: "Learning history unavailable" }, { status: 503 });
    const attempts = attemptResult.data || [];
    const totalAttempts = attempts.length;
    const correctCount = attempts.filter((a) => a.is_correct).length;
    const incorrectAttempts = attempts.filter((a) => !a.is_correct);
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    const mistakeCount = incorrectAttempts.length;
    const activeSession = activeResult.data?.[0] || null;
    const recentSessions = recentResult.data || [];

    return NextResponse.json({
      activeSession,
      recentSessions,
      totalAttempts,
      accuracy,
      mistakeCount,
      mistakeQuestionIds: Array.from(new Set(incorrectAttempts.map((a) => a.question_id))).slice(0, 50),
    });
  } catch (err: unknown) {
    console.error("Session GET error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const {
      creation_id,
      title,
      mode = "instant",
      filters = {},
      question_ids = [],
      total_questions = 0,
    } = body;

    if (!["instant", "attempt", "full_paper"].includes(mode) || !Array.isArray(question_ids) || !question_ids.length || question_ids.length > 150) {
      return NextResponse.json({ error: "Invalid practice question set" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: true, guest: true, id: `guest_${Date.now()}` });
    }


    const key = serviceRoleKey;
    if (!key) return NextResponse.json({ error: "Session persistence unavailable" }, { status: 503 });
    const supabase = createClient(supabaseUrl, key);

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(creation_id || "")) {
      return NextResponse.json({ error: "Missing stable creation identity" }, { status: 400 });
    }

    const sessionPayload = {
      id: creation_id,
      user_id: userId,
      title: title || "Practice Session",
      mode: mode,
      filters: filters,
      question_ids: question_ids,
      current_index: 0,
      answers: {},
      is_completed: false,
      total_questions: total_questions || question_ids.length,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: insertError } = await supabase
        .from("practice_sessions")
        .upsert(sessionPayload, { onConflict: "id", ignoreDuplicates: true });
      if (insertError) return NextResponse.json({ error: "Session persistence failed" }, { status: 503 });
      const { data, error } = await supabase.from("practice_sessions").select("*")
        .eq("id", creation_id).eq("user_id", userId).single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: "Session persistence failed" }, { status: 503 });
      }
      return NextResponse.json({ success: true, session: data });
    } catch {
      return NextResponse.json({ success: false, error: "Session persistence failed" }, { status: 503 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err, "Internal Server Error") }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();
    const {
      session_id,
      current_index,
      answers,
      is_completed,
      correct_count,
      incorrect_count,
      time_spent_seconds,
      filters,
    } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Sign in again to save progress" }, { status: 401 });
    }

    const key = serviceRoleKey;
    if (!key) return NextResponse.json({ error: "Session persistence unavailable" }, { status: 503 });
    const supabase = createClient(supabaseUrl, key);

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (current_index !== undefined) updatePayload.current_index = current_index;
    if (answers !== undefined) updatePayload.answers = answers;
    if (is_completed !== undefined) {
      updatePayload.is_completed = is_completed;
      if (is_completed) updatePayload.completed_at = new Date().toISOString();
    }
    if (correct_count !== undefined) updatePayload.correct_count = correct_count;
    if (incorrect_count !== undefined) updatePayload.incorrect_count = incorrect_count;
    if (time_spent_seconds !== undefined) updatePayload.time_spent_seconds = time_spent_seconds;
    if (filters !== undefined) updatePayload.filters = filters;

    try {
      const { data, error } = await supabase
        .from("practice_sessions")
        .update(updatePayload)
        .eq("id", session_id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: "Session persistence failed" }, { status: 503 });
      }
      return NextResponse.json({ success: true, session: data });
    } catch {
      return NextResponse.json({ success: false, error: "Session persistence failed" }, { status: 503 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err, "Internal Server Error") }, { status: 500 });
  }
}
