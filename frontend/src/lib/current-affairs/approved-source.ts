import { createHash } from "node:crypto";

const semanticJson = (value: unknown): string => JSON.stringify(value, (_key, item) =>
  item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

export function validateApprovedSource(edition: Record<string, unknown>) {
  const { approvedEditorial, ...fields } = edition;
  const approval = approvedEditorial as { version?: number; source?: string; sha256?: string } | undefined;
  if (approval?.version !== 1 || typeof approval.source !== "string"
      || createHash("sha256").update(approval.source, "utf8").digest("hex") !== approval.sha256) {
    throw new Error("Complete approved editorial source and matching SHA-256 required");
  }
  let source: unknown;
  try { source = JSON.parse(approval.source); } catch { throw new Error("Invalid approved source JSON"); }
  if (JSON.stringify(source) !== approval.source) throw new Error("Approved source must be canonical JSON without duplicate keys");
  if (semanticJson(source) !== semanticJson(fields)) throw new Error("Editorial fields differ from approved source");
}

export const PYQ_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;
