
import { errorMessage } from "@/lib/error-message";
import { requireBackendUrl } from "@/lib/backend-config";
import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";



export async function GET(req: Request) {
  try {
    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin authorization required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const worksheet = searchParams.get("worksheet_name") || "questions";
    const sheetId = searchParams.get("sheet_id") || "";

    // Forward the verified administrator's session. Do not activate a legacy
    // browser-exposed shared key or send the database service key to FastAPI.
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return NextResponse.json({ error: "Administrator session expired" }, { status: 401 });

    // 1. Try FastAPI backend
    try {
      const signal = AbortSignal.timeout(15000);

      const targetUrl = new URL(`${requireBackendUrl()}/admin/sync-stats`);
      targetUrl.searchParams.set("worksheet_name", worksheet);
      if (sheetId) targetUrl.searchParams.set("sheet_id", sheetId);

      const res = await fetch(targetUrl.toString(), {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
        signal,
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend offline or timeout -> proceed to Supabase fallback
    }

    // 2. Supabase direct fallback using service role key (bypasses RLS for accurate admin count)
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const adminSupabase = createSupabaseClient(supabaseUrl, serviceKey);

    const { count: currentDbCount, error: countError } = await adminSupabase
      .from("questions")
      .select("id", { count: "exact", head: true });

    if (countError) throw countError;
    return NextResponse.json({
      backend_available: false,
      current_db_count: currentDbCount ?? 0,
      incoming_sheet_count: null,
      new_questions: null,
      updated_questions: null,
      sheet_id: sheetId || null,
      worksheet_name: worksheet,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: errorMessage(error, "Failed to load sync stats") },
      { status: 500 }
    );
  }
}

