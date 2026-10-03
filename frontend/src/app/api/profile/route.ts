import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readProfile } from "@/lib/profile-store";
import { savePreparation } from "@/lib/profile-save-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.status !== 401 && error.status !== 403 && error.name !== "AuthSessionMissingError") {
      throw new Error("Session unavailable");
    }
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await readProfile(supabase, user));
  } catch {
    return NextResponse.json({ error: "Your profile could not be loaded. Please retry." }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  return savePreparation(request, false);
}
