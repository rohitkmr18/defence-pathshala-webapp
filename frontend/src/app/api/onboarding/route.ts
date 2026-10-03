import { NextRequest } from "next/server";
import { savePreparation } from "@/lib/profile-save-server";

export async function POST(request: NextRequest) {
  return savePreparation(request, true);
}
