import { NextRequest, NextResponse } from "next/server";
import { afcatStagingAdmin, afcatStagingUser } from "@/lib/afcat/staging-server";
import { AFCAT_ASSET_COLUMNS, readAfcatAssetBytes, type AfcatAssetRow } from "@/lib/afcat/assets";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

/** Serves a reviewed question figure only to a signed-in learner who holds a session on a test containing it. */
export async function GET(_req: NextRequest, context: Context) {
  try {
    const user = await afcatStagingUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { id } = await context.params;
    if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
      return NextResponse.json({ error: "Invalid asset" }, { status: 400 });
    const db = afcatStagingAdmin();
    const { data: asset, error } = await db.from("afcat_question_assets").select(AFCAT_ASSET_COLUMNS).eq("id", id).maybeSingle();
    if (error) throw error;
    const row = asset as AfcatAssetRow | null;
    if (!row || !row.reviewed || row.mime_type !== "image/svg+xml")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { data: items, error: ie } = await db.from("afcat_test_items").select("test_id").eq("question_id", row.question_id);
    if (ie) throw ie;
    const testIds = (items ?? []).map(x => x.test_id);
    const { data: sessions, error: se } = testIds.length
      ? await db.from("afcat_sessions").select("id,status").eq("user_id", user.id).in("test_id", testIds)
      : { data: [], error: null };
    if (se) throw se;
    const finished = (sessions ?? []).some(s => s.status !== "IN_PROGRESS");
    if (!(sessions ?? []).length || (row.placement === "EXPLANATION" && !finished))
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const svg = readAfcatAssetBytes(row);
    if (!svg) return NextResponse.json({ error: "Asset unavailable" }, { status: 503 });
    return new NextResponse(svg, { headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=3600",
    } });
  } catch {
    return NextResponse.json({ error: "Asset unavailable" }, { status: 503 });
  }
}
