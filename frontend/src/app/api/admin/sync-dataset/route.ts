import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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

    const adminKey =
      process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const targetUrl = new URL(`${BACKEND_URL}/admin/sync-dataset`);
    targetUrl.searchParams.set("worksheet_name", worksheet);
    targetUrl.searchParams.set("dry_run", dryRun ? "true" : "false");
    if (sheetId) targetUrl.searchParams.set("sheet_id", sheetId);

    // Timeout: 60s for full sync
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "X-Admin-Key": adminKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

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
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.name === "AbortError"
            ? "Sync request timed out after 60 seconds."
            : error?.message || "Internal server error during dataset sync.",
      },
      { status: 500 }
    );
  }
}

