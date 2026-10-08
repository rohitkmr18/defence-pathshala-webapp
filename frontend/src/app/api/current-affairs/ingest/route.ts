import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (error || !user || !adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload: unknown = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Atomic publishing is not configured" }, { status: 503 });
  }
  const service = createServiceClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // One RPC = one Postgres transaction. No upserts or compensating deletes.
  const { data, error: publishError } = await service.rpc(
    "publish_current_affairs_edition_atomic", { payload },
  );
  if (publishError) {
    // Avoid exposing internal database details to the client.
    const conflict = publishError.code === "23505";
    return NextResponse.json(
      { error: conflict ? "Edition or story already exists" : "Atomic publication rejected" },
      { status: conflict ? 409 : 422 },
    );
  }
  return NextResponse.json({ success: true, postId: data });
}
