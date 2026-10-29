import { NextRequest, NextResponse } from "next/server";
import {
  afcatStagingAdmin,
  afcatStagingUser,
} from "@/lib/afcat/staging-server";

export const dynamic = "force-dynamic";
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
      { error: "Unable to start AFCAT staging test" },
      { status: 503 },
    );
  }
}
