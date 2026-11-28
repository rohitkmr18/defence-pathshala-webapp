import { createHash } from "node:crypto";
import { validateEditorialEdition } from "./editorial-validation";

type Identity = { actor: string; runId: string; runAttempt: string };
type PublishResult = { id?: string; errorCode?: string };
type Dependencies = {
  verify: (token: string) => Promise<Identity>;
  ready: () => boolean;
  production: boolean;
  publish: (payload: Record<string, unknown>) => Promise<PublishResult>;
  publishDraft?: (date: string, sha256: string) => Promise<PublishResult>;
  connectivity: () => Promise<boolean>;
  audit: (record: Record<string, unknown>) => void;
};
const response = (status: number, data: Record<string, unknown>) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function handlePublishingRequest(req: Request, deps: Dependencies) {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return response(401, { error: "Unauthorized" });
  let identity: Identity;
  try { identity = await deps.verify(authorization.slice(7)); }
  catch { return response(401, { error: "Unauthorized" }); }
  let raw: string;
  try {
    // Bound the stream before accumulating it; Content-Length may be absent or false.
    const reader = req.body?.getReader();
    if (!reader) return response(400, { error: "Missing request body" });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 60000) { await reader.cancel(); return response(413, { error: "Payload too large" }); }
      chunks.push(value);
    }
    raw = Buffer.concat(chunks).toString("utf8");
  } catch { return response(400, { error: "Invalid request body" }); }
  const audit = { ...identity, payloadHash: createHash("sha256").update(raw).digest("hex"), requestedAt: new Date().toISOString() };
  const finish = (status: number, result: Record<string, unknown>) => {
    deps.audit({ ...audit, status, ...result });
    return response(status, { ...result, audit });
  };
  let envelope;
  try { envelope = JSON.parse(raw); } catch { return finish(400, { error: "Invalid JSON" }); }
  if (!envelope || ![1, 2].includes(envelope.schemaVersion) || envelope.runId !== identity.runId
      || !Number.isSafeInteger(envelope.issueNumber) || envelope.issueNumber < 1) return finish(400, { error: "Invalid publishing envelope" });
  if (!deps.ready()) return finish(503, { error: "Atomic publishing is not configured" });
  if (envelope.schemaVersion === 1 && envelope.operation === "connectivity_check") {
    try { return finish(await deps.connectivity() ? 200 : 503, { operation: "connectivity_check", writes: 0 }); }
    catch { return finish(503, { error: "Publisher connectivity unavailable", writes: 0 }); }
  }
  if (envelope.operation !== "publish" || envelope.approved !== true) return finish(403, { error: "Explicit editorial approval required" });
  if (!deps.production) return finish(403, { error: "Publication is disabled outside production" });
  let date: string;
  let publish: () => Promise<PublishResult>;
  if (envelope.schemaVersion === 2) {
    const { draftId, sha256 } = envelope;
    if (typeof draftId !== "string" || !/^\d{4}-\d{2}-\d{2}-[a-f0-9]{64}$/.test(draftId)
        || draftId.slice(11) !== sha256 || Object.keys(envelope).length !== 7) {
      return finish(422, { error: "Exact founder draft approval required" });
    }
    const publishDraft = deps.publishDraft;
    if (!publishDraft) return finish(503, { error: "Editorial draft publishing is not configured" });
    date = draftId.slice(0, 10);
    publish = () => publishDraft(date, sha256);
  } else {
    try { validateEditorialEdition(envelope.edition); }
    catch (e) { return finish(422, { error: e instanceof Error ? e.message : "Invalid edition" }); }
    date = envelope.edition.date;
    publish = () => deps.publish(envelope.edition);
  }
  deps.audit({ ...audit, issueNumber: envelope.issueNumber, date, status: "publication_requested" });
  try {
    const result = await publish();
    if (result.errorCode === "draft_approval") return finish(409, { error: "Missing, stale or mismatched draft approval" });
    if (result.errorCode) return finish(result.errorCode === "23505" ? 409 : 422, { error: result.errorCode === "23505" ? "Edition or story already exists" : "Atomic publication rejected" });
    if (!result.id || !/^[a-f0-9-]{36}$/i.test(result.id)) return finish(502, { error: "Publication outcome requires independent verification" });
    return finish(200, { success: true, postId: result.id, date, issueNumber: envelope.issueNumber });
  } catch { return finish(502, { error: "Publication outcome requires independent verification" }); }
}
