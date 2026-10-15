import "server-only";
import { createHash } from "node:crypto";
import snapshot from "@/content/monthly/2026-10-sample.json";

export const SAMPLE_CONTENT_HASH = "7cb1c2c344a5406af1f352d11e65f25736afadfa788a20525159a3acc5ef4377";
const canonical = (value: unknown) => JSON.stringify(value, (_key, item) =>
  item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

// A digest checks integrity, not authorization. The only public payload is this
// repository-reviewed single-story allowlist; request parameters cannot select files.
export function getPublicMonthlySnapshot() {
  const core = Object.fromEntries(Object.entries(snapshot).filter(([key]) =>
    !["content_hash", "status", "approval_metadata", "release_metadata", "generated_artifacts"].includes(key)));
  if (snapshot.kind !== "SAMPLE" || snapshot.status !== "VALIDATED" || snapshot.edition_id !== "2026-10"
    || snapshot.edition_version !== 1 || snapshot.stories.length !== 1
    || snapshot.stories[0].source_id !== "bcadb490-b39a-4f11-befd-fa8e15bf480b"
    || snapshot.content_hash !== SAMPLE_CONTENT_HASH
    || createHash("sha256").update(canonical(core)).digest("hex") !== SAMPLE_CONTENT_HASH) throw new Error("Public sample integrity check failed");
  return snapshot;
}
