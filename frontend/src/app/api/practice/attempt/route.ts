
import { errorMessage } from "@/lib/error-message";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      question_id,
      selected_option,
      is_correct,
      time_taken,
      session_id,
      mode,
    } = body;

    if (!question_id || !selected_option || typeof is_correct !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields (question_id, selected_option, is_correct)" },
        { status: 400 }
      );
    }

    // Resolve authenticated user if available
    let userId: string | null = null;
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
              // Read-only in route handler
            }
          },
        },
      });
      const {
        data: { user },
      } = await supabaseUserClient.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Unauthenticated / guest mode
    }

    if (!userId) {
      // Return 200 OK for guest users so client-side localStorage fallback records attempt seamlessly
      return NextResponse.json(
        { success: true, persisted: false, guest: true },
        { status: 200 }
      );
    }

    const key = serviceRoleKey;
    if (!key) return NextResponse.json({ error: "Attempt persistence unavailable" }, { status: 503 });
    const supabase = createClient(supabaseUrl, key);

    const { data: question, error: questionError } = await supabase
      .from("v_dp_question_intelligence_v2")
      .select("id, final_opt, official_opt")
      .eq("id", question_id).maybeSingle();
    if (questionError || !question) {
      return NextResponse.json({ error: "Question is not in the canonical release" }, { status: 400 });
    }
    const selected = String(selected_option).trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(selected)) {
      return NextResponse.json({ error: "Invalid selected option" }, { status: 400 });
    }
    const authoritativeAnswer = String(question.final_opt || "").trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(authoritativeAnswer)) {
      return NextResponse.json({ error: "Canonical answer unavailable" }, { status: 409 });
    }
    if (session_id) {
      const { data: ownedSession } = await supabase.from("practice_sessions")
        .select("id").eq("id", session_id).eq("user_id", userId).maybeSingle();
      if (!ownedSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const scoredCorrect = selected === authoritativeAnswer;
    const attemptPayload: Record<string, unknown> = {
      user_id: userId,
      question_id: question_id,
      selected_option: selected,
      is_correct: scoredCorrect,
      time_taken: typeof time_taken === "number" && Number.isFinite(time_taken) ? Math.max(0, Math.round(time_taken)) : 0,
    };

    if (session_id) {
      attemptPayload.session_id = session_id;
    }
    if (mode) {
      attemptPayload.mode = mode;
    }

    const { data, error } = await supabase
      .from("user_attempts")
      .insert(attemptPayload)
      .select()
      .single();

    if (error) {
      console.error("Failed to insert user attempt:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, attempt: data, persisted: true });
  } catch (err: unknown) {
    console.error("Attempt API error:", err);
    return NextResponse.json({ error: errorMessage(err, "Internal Server Error") }, { status: 500 });
  }
}
