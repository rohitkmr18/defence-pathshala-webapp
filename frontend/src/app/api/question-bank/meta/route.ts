import { NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";

export async function GET() {
  const response = await backendGET(
    "/analytics/question-bank/meta"
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}