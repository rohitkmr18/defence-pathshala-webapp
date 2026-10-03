import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readProfile } from "@/lib/profile-store";

export async function savePreparation(request: NextRequest, setup: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.status !== 401 && authError.status !== 403 && authError.name !== "AuthSessionMissingError") {
      throw new Error("Session unavailable");
    }
    if (authError || !user) {
      return NextResponse.json({ error: "Please log in again to save your setup." }, { status: 401 });
    }
    let body;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Invalid setup details." }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body) ||
        Object.keys(body).some((key) => !["full_name", "target_year", "target_exams"].includes(key))) {
      return NextResponse.json({ error: "Invalid setup details." }, { status: 400 });
    }
    const existing = setup ? null : await readProfile(supabase, user);
    const fullName = body.full_name === undefined ? existing?.full_name ?? null : body.full_name;
    const rawYear = body.target_year === undefined ? existing?.target_year : body.target_year;
    const targetYear = rawYear == null || rawYear === "" ? null :
      (typeof rawYear === "number" || typeof rawYear === "string" ? Number(rawYear) : NaN);
    const exams = body.target_exams ?? existing?.target_exams;
    const allowedExams = setup ? ["CDS", "CAPF-AC"] : ["CDS", "CAPF-AC", "NDA", "AFCAT", "UPSC-CSE"];
    if ((fullName !== null && (typeof fullName !== "string" || fullName.trim().length > 200)) ||
        (targetYear !== null && (!Number.isInteger(targetYear) ||
          ((targetYear < 2026 || targetYear > 2032) && (setup || targetYear !== existing?.target_year)))) ||
        !Array.isArray(exams) || exams.length === 0 ||
        exams.some((exam: unknown) => typeof exam !== "string" || !allowedExams.includes(exam))) {
      return NextResponse.json({ error: "Choose CDS, CAPF AC, or both, and a valid optional target year." }, { status: 400 });
    }
    // One authenticated transaction owns all writes; no backend service-role fallback.
    const { data: result, error: saveError } = await supabase.rpc(setup ? "complete_onboarding" : "update_preparation_profile", {
      p_full_name: typeof fullName === "string" ? fullName.trim() || null : null,
      p_target_year: targetYear,
      p_target_exams: [...new Set<string>(exams)],
    });
    if (saveError || result?.id !== user.id || result?.onboarding_completed !== true ||
        !Array.isArray(result.target_exams)) throw new Error("Unverified setup");

    // Verify the committed state through the user's normal RLS-protected read path.
    // If a response/read is lost, retrying the RPC returns the already completed row.
    const persisted = await readProfile(supabase, user);
    if (!persisted.onboarding_completed || persisted.full_name !== result.full_name ||
        persisted.target_year !== result.target_year ||
        persisted.target_exams.length !== result.target_exams.length ||
        persisted.target_exams.some((exam) => !result.target_exams.includes(exam))) {
      throw new Error("Unverified setup");
    }
    return NextResponse.json(persisted);
  } catch {
    return NextResponse.json({ error: "Your setup could not be verified. Please retry. Your inputs are kept." }, { status: 503 });
  }
}
