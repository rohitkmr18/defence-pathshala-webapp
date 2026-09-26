import { NextResponse } from "next/server";
import { getQuestionBankMeta } from "@/lib/question-bank";

export async function GET() {
  const data = await getQuestionBankMeta();
  return NextResponse.json(data, { status: 200 });
}