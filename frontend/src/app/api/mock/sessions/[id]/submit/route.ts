import { NextRequest, NextResponse } from "next/server";
import { mockAdmin, mockUser } from "@/lib/mock/server";
import { isMockUuid } from "@/lib/mock/engine";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, context: Context) {
  try {
    const user = await mockUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!isMockUuid(id)) return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = mockAdmin();
    // Scoring happens only inside the database function, using the marking stored on the test row.
    const { data, error } = await db.rpc("mock_finalize_session", { p_session_id: id, p_user_id: user.id });
    if (error) throw error;
    if (!data || data.length !== 1) throw new Error("No authoritative result");
    return NextResponse.json({ result: data[0] }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Mock submission unavailable" }, { status: 503 });
  }
}
