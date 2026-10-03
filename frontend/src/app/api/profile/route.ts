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
    target_exams: (examsData || []).map((item: { exam: string }) => item.exam),
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Please log in again to save your setup." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
  }

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("id, full_name, target_year, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();
  if (readError || !existing) {
    return NextResponse.json({ error: "Your profile could not be loaded. Please retry or contact support." }, { status: 500 });
  }

  const fullName = body.full_name === undefined ? existing.full_name : body.full_name;
  const targetYear = body.target_year === undefined ? existing.target_year : Number(body.target_year);
  const exams = body.target_exams;
  const allowedExams = ["CDS", "CAPF-AC", "NDA", "AFCAT", "UPSC-CSE"];
  if (typeof fullName !== "string" || !fullName.trim() ||
      !Number.isInteger(targetYear) || targetYear < 2026 || targetYear > 2032 ||
      (exams !== undefined && (!Array.isArray(exams) || exams.length === 0 ||
        exams.some((exam: unknown) => typeof exam !== "string" || !allowedExams.includes(exam))))) {
    return NextResponse.json({ error: "Enter your name, target exams, and a valid target year." }, { status: 400 });
  }

  // Use the same canonical store as the dashboard. Profiles are created by the
  // signup trigger; authenticated users have UPDATE, but intentionally no INSERT policy.
  // An upsert requires INSERT permission even when the profile already exists.
  if (exams !== undefined) {
    const { error: deleteError } = await supabase.from("user_exam_preferences")
      .delete().eq("user_id", user.id);
    if (deleteError) {
      return NextResponse.json({ error: "Could not save your exam preferences. Please retry." }, { status: 500 });
    }
    const { error: insertError } = await supabase.from("user_exam_preferences")
      .insert([...new Set<string>(exams)].map((exam) => ({ user_id: user.id, exam })));
    if (insertError) {
      return NextResponse.json({ error: "Could not save your exam preferences. Please retry." }, { status: 500 });
    }
  }

  const { data: savedExams, error: examError } = await supabase.from("user_exam_preferences")
    .select("exam").eq("user_id", user.id);
  if (examError || !savedExams?.length ||
      (exams !== undefined && (savedExams.length !== new Set(exams).size ||
        savedExams.some((row) => !exams.includes(row.exam))))) {
    return NextResponse.json({ error: "Your exam preferences were not saved. Please retry." }, { status: 500 });
  }

  // Mark setup complete only after preferences are saved. Select the actual row
  // back so a rejected/zero-row update can never return a fabricated success.
  const { data: saved, error: saveError } = await supabase.from("profiles")
    .update({ full_name: fullName.trim(), target_year: targetYear, onboarding_completed: true })
    .eq("id", user.id)
    .select("id, full_name, target_year, onboarding_completed")
    .single();
  if (saveError || !saved?.onboarding_completed) {
    return NextResponse.json({ error: "Your setup was not saved. Please retry." }, { status: 500 });
  }

  return NextResponse.json({ ...saved, target_exams: savedExams.map((row) => row.exam) });
}
