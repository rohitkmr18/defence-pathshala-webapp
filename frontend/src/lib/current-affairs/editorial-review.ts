import { createHash } from "node:crypto";

type Draft = { sha256: string; package: string };
type Dependencies = {
  isFounder: () => Promise<boolean>;
  read: (day: string) => Promise<Draft | null>;
};

export async function handleEditorialReview(request: Request, deps: Dependencies) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    "Cross-Origin-Resource-Policy": "same-origin" };
  const respond = (status: number, body: object) => Response.json(body, { status, headers });
  try {
    if (!await deps.isFounder()) return respond(401, { error: "Unauthorized" });
    const date = new URL(request.url).searchParams.get("date");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
      return respond(400, { error: "Expected an edition date" });
    }
    const draft = await deps.read(date);
    if (!draft) return respond(404, { error: "Review is not ready" });
    const sha256 = createHash("sha256").update(draft.package, "utf8").digest("hex");
    if (sha256 !== draft.sha256) return respond(503, { error: "Review integrity check failed" });
    return respond(200, { draftId: `${date}-${sha256}`, sha256, snapshot: draft.package });
  } catch {
    return respond(503, { error: "Review unavailable" });
  }
}
