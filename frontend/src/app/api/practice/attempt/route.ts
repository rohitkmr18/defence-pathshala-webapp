
import { errorMessage } from "@/lib/error-message";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { learningContext } from "@/lib/analytics/context";
import { isContentEligible, CONTENT_UNAVAILABLE_MESSAGE } from "@/lib/content-quality";
import { createHash } from "node:crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      question_id,
      content_version,
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
        error,
      } = await supabaseUserClient.auth.getUser();
      if (error && error.name !== "AuthSessionMissingError") throw error;
      if (user) {
        userId = user.id;
      }
    } catch {
      return NextResponse.json({ error: "Could not verify your account" }, { status: 503 });
    }

    if (!userId) {
      if (session_id) return NextResponse.json({ error: "Sign in again to save your attempt" }, { status: 401 });
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
      .select("id, final_opt, official_opt, question, opt_a, opt_b, opt_c, opt_d, content_status, content_eligible, content_version, exam, year, cycle, subject, topic, concept, taxonomy_subject, taxonomy_topic, taxonomy_concept")
      .eq("id", question_id).maybeSingle();
    if (questionError || !question) {
      return NextResponse.json({ error: "Question is not in the canonical release" }, { status: 400 });
    }
    if (!isContentEligible(question)) return NextResponse.json({ error: CONTENT_UNAVAILABLE_MESSAGE, code: "CONTENT_WITHHELD" }, { status: 409 });
    if (!Number.isInteger(content_version) || content_version !== question.content_version) {
      return NextResponse.json({ error: "This question was corrected. Reload it before answering.", code: "CONTENT_VERSION_CHANGED" }, { status: 409 });
    }
    const selected = String(selected_option).trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(selected)) {
      return NextResponse.json({ error: "Invalid selected option" }, { status: 400 });
    }
    const authoritativeAnswer = String(question.final_opt || "").trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(authoritativeAnswer)) {
      return NextResponse.json({ error: "Canonical answer unavailable" }, { status: 409 });
    }
    let sessionFilters = {};
    let sessionMode = mode;
    if (session_id) {
      const { data: ownedSession, error: sessionError } = await supabase.from("practice_sessions")
        .select("id, question_ids, filters, mode").eq("id", session_id).eq("user_id", userId).maybeSingle();
      if (sessionError) return NextResponse.json({ error: "Session lookup failed" }, { status: 503 });
      if (!ownedSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
      if (!ownedSession.question_ids.includes(question_id)) return NextResponse.json({ error: "Question is outside this session" }, { status: 400 });
      sessionFilters = ownedSession.filters || {};
      sessionMode = ownedSession.mode;
    }
    const scoredCorrect = selected === authoritativeAnswer;
    const attemptPayload: Record<string, unknown> = {
      user_id: userId,
      question_id: question_id,
      selected_option: selected,
      is_correct: scoredCorrect,
      content_version: question.content_version,
      time_taken: typeof time_taken === "number" && Number.isFinite(time_taken) ? Math.max(0, Math.round(time_taken)) : 0,
    };

    if (session_id) {
      attemptPayload.session_id = session_id;
      // Existing UUID primary key makes retry safe even after a lost response/reload.
      const digest = createHash("sha256").update(`${userId}:${session_id}:${question_id}`).digest("hex");
      attemptPayload.id = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-5${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
    }
    if (mode) {
      attemptPayload.mode = mode;
    }

    const { data: inserted, error } = await supabase
      .from("user_attempts")
      .upsert(attemptPayload, { onConflict: "id", ignoreDuplicates: true })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Failed to insert user attempt:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // A replay returns the original durable attempt instead of rewriting its timestamp/truth.
    const existing = !inserted && attemptPayload.id
      ? await supabase.from("user_attempts").select("*").eq("id", attemptPayload.id).eq("user_id", userId).single()
      : null;
    const data = inserted || existing?.data;
    if (!data || existing?.error) return NextResponse.json({ error: "Attempt confirmation failed" }, { status: 503 });

    // Post-write durable history defines resolution. Concurrent/later correct writes cannot
    // both be the latest correct attempt immediately preceded by an incorrect attempt.
    const { data: history, error: historyError } = await supabase.from("user_attempts")
      .select("id, is_correct, attempted_at").eq("user_id", userId).eq("question_id", question_id)
      .order("attempted_at", { ascending: false }).order("id", { ascending: false }).limit(2);
    const resolved = !historyError && data.is_correct === true && history?.[0]?.id === data.id && history?.[1]?.is_correct === false;
    const resolution = resolved ? {
      ...learningContext({ ...sessionFilters, mode: sessionMode }, question),
      attempt_id: data.id,
      question_id,
      practice_session_id: session_id,
    } : undefined;
    return NextResponse.json({ success: true, attempt: data, persisted: true, resolved: Boolean(resolved), resolution });
  } catch (err: unknown) {
    console.error("Attempt API error:", err);
    return NextResponse.json({ error: errorMessage(err, "Internal Server Error") }, { status: 500 });
  }
}
