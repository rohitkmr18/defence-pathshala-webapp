import { NextRequest, NextResponse } from "next/server";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
import { isAfcatExpired } from "@/lib/afcat/engine";
import { sanitizeAfcatQuestion } from "@/lib/afcat/serialize";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = afcatStagingAdmin();
    const { data: session, error: sessionError } = await db.from("afcat_sessions")
      .select("id,user_id,test_id,status,started_at,test_release_version,current_position")
      .eq("id", id).eq("user_id", user.id).maybeSingle();
    if (sessionError) throw sessionError;
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const { data: test, error: testError } = await db.from("afcat_tests")
      .select("id,title,kind,section,duration_seconds,expected_questions,release_version")
      .eq("id", session.test_id).single();
    if (testError) throw testError;
    const { data: items, error: itemError } = await db.from("afcat_test_items")
      .select("question_id,position,question_content_version").eq("test_id", session.test_id).order("position");
    if (itemError) throw itemError;
    const ids = (items ?? []).map(item => item.question_id);
    if (ids.length !== test.expected_questions || ids.length !== new Set(ids).size) {
      return NextResponse.json({ error: "Test content incomplete" }, { status: 409 });
    }
    const { data: questions, error: questionError } = await db.from("afcat_questions")
      .select("id,stem,options,content_version,editorial_status").in("id", ids);
    if (questionError) throw questionError;
    const byId = new Map((questions ?? []).map(q => [q.id, q]));
    const sanitized = (items ?? []).map(item => {
      const q = byId.get(item.question_id);
      if (!q || q.editorial_status !== "APPROVED" || q.content_version !== item.question_content_version)
        return null;
      try { return sanitizeAfcatQuestion(item.question_id, item.position, q.stem, q.options); }
      catch { return null; }
    });
    if (sanitized.some(q => !q)) return NextResponse.json({ error: "Test version mismatch" }, { status: 409 });
    const { data: saved, error: responseError } = await db.from("afcat_responses")
      .select("question_id,selected_option,marked_for_review").eq("session_id", session.id).eq("user_id", user.id);
    if (responseError) throw responseError;
    return NextResponse.json({
      session: { id: session.id, status: session.status, startedAt: session.started_at,
        deadline: new Date(Date.parse(session.started_at) + test.duration_seconds * 1000).toISOString(),
        expired: isAfcatExpired(session.started_at, test.duration_seconds),
        title: test.title, currentPosition: session.current_position },
      questions: sanitized,
      responses: saved ?? [],
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT staging session unavailable" }, { status: 503 });
  }
}
