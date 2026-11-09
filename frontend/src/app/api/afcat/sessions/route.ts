import { NextRequest, NextResponse } from "next/server";
import {
  afcatStagingAdmin,
  afcatStagingUser,
} from "@/lib/afcat/staging-server";
import { afcatMockLabel } from "@/lib/afcat/mock-labels";

export const dynamic = "force-dynamic";

/** The signed-in learner's AFCAT attempts, newest first, so saved results are always reachable. */
export async function GET() {
  try {
    const user = await afcatStagingUser();
    if (!user)
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const db = afcatStagingAdmin();
    const { data: sessions, error } = await db
      .from("afcat_sessions")
      .select("id,test_id,status,started_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    const rows = sessions ?? [];
    if (!rows.length)
      return NextResponse.json(
        { attempts: [] },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    const [testsRes, resultsRes] = await Promise.all([
      db
        .from("afcat_tests")
        .select("id,code,title")
        .in("id", [...new Set(rows.map((r) => r.test_id))]),
      db
        .from("afcat_session_results")
        .select("session_id,score,max_marks")
        .eq("user_id", user.id)
        .in("session_id", rows.map((r) => r.id)),
    ]);
    if (testsRes.error) throw testsRes.error;
    if (resultsRes.error) throw resultsRes.error;
    const tests = new Map((testsRes.data ?? []).map((t) => [t.id, t]));
    const results = new Map((resultsRes.data ?? []).map((r) => [r.session_id, r]));
    const attempts = rows.flatMap((r) => {
      const test = tests.get(r.test_id);
      if (!test) return [];
      const result = results.get(r.id);
      return [
        {
          id: r.id,
          testId: r.test_id,
          code: test.code,
          title: afcatMockLabel(test.code, test.title),
          status: r.status,
          startedAt: r.started_at,
          score: result?.score ?? null,
          maxMarks: result?.max_marks ?? null,
        },
      ];
    });
    return NextResponse.json(
      { attempts },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load your attempts" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await afcatStagingUser();
    if (!user)
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("testId" in body) ||
      typeof body.testId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(body.testId)
    ) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }
    const db = afcatStagingAdmin();
    const { data: test, error: testError } = await db
      .from("afcat_tests")
      .select("id,status,release_version")
      .eq("id", body.testId)
      .eq("status", "PUBLISHED")
      .maybeSingle();
    if (testError) throw testError;
    if (!test)
      return NextResponse.json({ error: "Test unavailable" }, { status: 404 });
    // Reuse an in-progress test attempt instead of creating a duplicate on refresh.
    // The partial unique index serializes concurrent starts; recover its winning row below.
    const { data: existing, error: lookupError } = await db
      .from("afcat_sessions")
      .select("id,status,started_at")
      .eq("user_id", user.id)
      .eq("test_id", test.id)
      .eq("status", "IN_PROGRESS")
      .order("started_at", { ascending: false })
      .limit(1);
    if (lookupError) throw lookupError;
    if (existing?.length) {
      return NextResponse.json(
        { sessionId: existing[0].id, resumed: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    const { data: created, error } = await db
      .from("afcat_sessions")
      .insert({
        user_id: user.id,
        test_id: test.id,
        test_release_version: test.release_version,
      })
      .select("id")
      .single();
    if (error?.code === "23505") {
      const { data: winner, error: winnerError } = await db
        .from("afcat_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("test_id", test.id)
        .eq("status", "IN_PROGRESS")
        .single();
      if (winnerError) throw winnerError;
      return NextResponse.json(
        { sessionId: winner.id, resumed: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error) throw error;
    return NextResponse.json(
      { sessionId: created.id, resumed: false },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to start AFCAT test" },
      { status: 503 },
    );
  }
}
