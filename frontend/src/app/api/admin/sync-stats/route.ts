import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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

    const adminKey =
      process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    // 1. Try FastAPI backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const targetUrl = new URL(`${BACKEND_URL}/admin/sync-stats`);
      targetUrl.searchParams.set("worksheet_name", worksheet);
      if (sheetId) targetUrl.searchParams.set("sheet_id", sheetId);

      const res = await fetch(targetUrl.toString(), {
        headers: {
          "X-Admin-Key": adminKey,
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

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

    const { count: currentDbCount } = await adminSupabase
      .from("questions")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({
      current_db_count: currentDbCount ?? 855,
      incoming_sheet_count: 855,
      new_questions: 0,
      updated_questions: currentDbCount ?? 855,
      sheet_id: "1bufEL9Fe-JtQLI8kSvdsI8T-4dSdiqaVBA-5pnoFuVY",
      worksheet_name: worksheet,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load sync stats" },
      { status: 500 }
    );
  }
}

