import { NextRequest, NextResponse } from "next/server";
import { getQuestionBankMeta } from "@/lib/question-bank";

export async function GET(request: NextRequest) {
  const data = await getQuestionBankMeta(request.nextUrl.searchParams.get("paper"));
  return NextResponse.json(data, { status: 200 });
}
