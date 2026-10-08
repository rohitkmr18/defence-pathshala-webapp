import { NextResponse } from "next/server";

/**
 * Fail closed until Current Affairs ingestion uses a single database transaction.
 *
 * The previous implementation upserted an edition, deleted existing stories,
 * and inserted stories/MCQs through separate requests. A failure could leave
 * published content incomplete or delete a previously published edition.
 *
 * Do not restore writes here without an atomic, insert-only database RPC,
 * duplicate protection, validated content statuses and release tests.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Current Affairs ingestion is temporarily disabled pending atomic publication hardening.",
      code: "CURRENT_AFFAIRS_INGEST_DISABLED",
    },
    { status: 503 },
  );
}
