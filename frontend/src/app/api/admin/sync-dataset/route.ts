
import { errorMessage } from "@/lib/error-message";
import { requireBackendUrl } from "@/lib/backend-config";
import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";



export async function POST(req: Request) {
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
    const dryRun = searchParams.get("dry_run") === "true";

    // Forward the verified administrator's session. Do not activate a legacy
    // browser-exposed shared key or send the database service key to FastAPI.
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return NextResponse.json({ error: "Administrator session expired" }, { status: 401 });

    const targetUrl = new URL(`${requireBackendUrl()}/admin/sync-dataset`);
    targetUrl.searchParams.set("worksheet_name", worksheet);
    targetUrl.searchParams.set("dry_run", dryRun ? "true" : "false");
    if (sheetId) targetUrl.searchParams.set("sheet_id", sheetId);

    // Timeout: 60s for full sync
    const signal = AbortSignal.timeout(60000);

    const res = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data.detail?.message ||
            data.detail ||
            data.error ||
            "Dataset sync failed on backend.",
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.name === "AbortError"
            ? "Sync request timed out after 60 seconds."
            : errorMessage(error, "Internal server error during dataset sync."),
      },
      { status: 500 }
    );
  }
}

