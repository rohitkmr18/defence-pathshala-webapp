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
    } = await supabaseUserClient.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const key = serviceRoleKey || anonKey;
    const supabase = createClient(supabaseUrl, key);

    if (!userId) {
      return NextResponse.json({
        activeSession: null,
        recentSessions: [],
        totalAttempts: 0,
        accuracy: 0,
        mistakeCount: 0,
      });
    }

    const requestedSessionId = request.nextUrl.searchParams.get("session_id");
    if (requestedSessionId) {
      const { data, error } = await supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("id", requestedSessionId)
        .eq("is_completed", false)
        .maybeSingle();
      if (error || !data) {
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
      title,
      mode = "instant",
      filters = {},
      question_ids = [],
      total_questions = 0,
    } = body;

    const key = serviceRoleKey || anonKey;
    const supabase = createClient(supabaseUrl, key);

    if (!userId) {
      return NextResponse.json({ success: true, guest: true, id: `guest_${Date.now()}` });
    }

    const sessionPayload = {
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
      const { data, error } = await supabase
        .from("practice_sessions")
        .insert(sessionPayload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: true, fallback: true, id: `sess_${Date.now()}` });
      }
      return NextResponse.json({ success: true, session: data });
    } catch {
      return NextResponse.json({ success: true, fallback: true, id: `sess_${Date.now()}` });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
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
    } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: true, guest: true });
    }

    const key = serviceRoleKey || anonKey;
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

    try {
      const { data, error } = await supabase
        .from("practice_sessions")
        .update(updatePayload)
        .eq("id", session_id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: true, fallback: true });
      }
      return NextResponse.json({ success: true, session: data });
    } catch {
      return NextResponse.json({ success: true, fallback: true });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
  }
}
