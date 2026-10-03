import { getBackendUrl } from "@/lib/backend-config";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function GET() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) return NextResponse.json({ error: "Analytics backend unavailable" }, { status: 503 });
  const response = await fetch(`${backendUrl}/analytics/overview`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}