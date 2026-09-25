import { NextRequest, NextResponse } from "next/server";
import { backendGET } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const response = await backendGET(
    `/analytics/question-bank${request.nextUrl.search}`
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}