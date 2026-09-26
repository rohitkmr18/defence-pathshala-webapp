import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${BACKEND_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
      });
    }
  } catch {
    // Backend offline / fetch failed — fallback to Supabase
  }

  // Supabase fallback
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, full_name, target_year, onboarding_completed")
    .eq("id", session.user.id)
    .maybeSingle();

  const { data: examsData } = await supabase
    .from("user_exam_preferences")
    .select("exam")
    .eq("user_id", session.user.id);

  return NextResponse.json({
    id: profileRow?.id || session.user.id,
    full_name: profileRow?.full_name || session.user.email?.split("@")[0] || "Aspirant",
    target_year: profileRow?.target_year || null,
    onboarding_completed: profileRow?.onboarding_completed ?? false,
    target_exams: (examsData || []).map((item: any) => item.exam),
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${BACKEND_URL}/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
      });
    }
  } catch {
    // Backend offline — update directly in Supabase
  }

  // Direct Supabase fallback
  const { full_name, target_year, target_exams } = body;

  await supabase
    .from("profiles")
    .upsert({
      id: session.user.id,
      full_name: full_name ?? null,
      target_year: target_year ?? null,
      onboarding_completed: true,
    });

  if (Array.isArray(target_exams)) {
    await supabase
      .from("user_exam_preferences")
      .delete()
      .eq("user_id", session.user.id);

    if (target_exams.length > 0) {
      await supabase.from("user_exam_preferences").insert(
        target_exams.map((exam: string) => ({
          user_id: session.user.id,
          exam,
        }))
      );
    }
  }

  return NextResponse.json({
    id: session.user.id,
    full_name,
    target_year,
    onboarding_completed: true,
    target_exams: target_exams || [],
  });
}