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

    const key = serviceRoleKey || anonKey;
    const supabase = createClient(supabaseUrl, key);

    const attemptPayload: Record<string, unknown> = {
      user_id: userId,
      question_id: question_id,
      selected_option: selected_option,
      is_correct: is_correct,
      time_taken: typeof time_taken === "number" ? Math.max(0, Math.round(time_taken)) : 0,
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
      // If error was due to new columns (e.g. session_id/mode) not yet in DB, retry with core schema
      if (error.message.includes("session_id") || error.message.includes("mode")) {
        const corePayload = {
          user_id: userId,
          question_id: question_id,
          selected_option: selected_option,
          is_correct: is_correct,
          time_taken: typeof time_taken === "number" ? Math.max(0, Math.round(time_taken)) : 0,
        };
        const { data: retryData, error: retryError } = await supabase
          .from("user_attempts")
          .insert(corePayload)
          .select()
          .single();

        if (retryError) {
          console.error("Failed to insert core user attempt:", retryError);
          return NextResponse.json({ error: retryError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, attempt: retryData, persisted: true });
      }

      console.error("Failed to insert user attempt:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, attempt: data, persisted: true });
  } catch (err: any) {
    console.error("Attempt API error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
