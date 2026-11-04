import { NextRequest, NextResponse } from "next/server";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export async function POST(_req: NextRequest, context: Context) {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const db = afcatStagingAdmin();
    const { data, error } = await db.rpc("afcat_finalize_session",
      { p_session_id: id, p_user_id: user.id });
    if (error) throw error;
    if (!data || data.length !== 1) throw new Error("No authoritative result");
    return NextResponse.json({ result: data[0] }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "AFCAT submission unavailable" }, { status: 503 });
  }
}
