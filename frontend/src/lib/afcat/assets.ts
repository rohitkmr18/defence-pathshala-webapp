import { createHash } from "node:crypto";
import type { AfcatAsset, AfcatChoice } from "@/lib/afcat/visual-types";
import { AFCAT_BUNDLED_ASSETS } from "@/lib/afcat/assets/fm01";

export type AfcatAssetRow = {
  id: string; question_id: string; placement: string; storage_path: string;
  mime_type: string; alt_text: string; sha256: string; reviewed: boolean;
};
export type AfcatQuestionAssets = { stem: AfcatAsset[]; options: Partial<Record<AfcatChoice["key"], AfcatAsset[]>> };

export const AFCAT_ASSET_COLUMNS = "id,question_id,placement,storage_path,mime_type,alt_text,sha256,reviewed";
export const afcatAssetUrl = (id: string) => `/api/afcat/assets/${id}`;

/** Returns the verified bytes for a reviewed asset, or null if missing or tampered. */
export function readAfcatAssetBytes(row: Pick<AfcatAssetRow, "storage_path" | "sha256">): string | null {
  const svg = AFCAT_BUNDLED_ASSETS[row.storage_path];
  if (typeof svg !== "string") return null;
  return createHash("sha256").update(svg, "utf8").digest("hex") === row.sha256 ? svg : null;
}

function size(svg: string) {
  const m = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : {};
}

/** Group learner-visible (reviewed, non-explanation) assets by question. */
export function groupAfcatAssets(rows: readonly AfcatAssetRow[]): Map<string, AfcatQuestionAssets> {
  const out = new Map<string, AfcatQuestionAssets>();
  for (const row of rows) {
    if (!row.reviewed || row.mime_type !== "image/svg+xml") continue;
    const svg = readAfcatAssetBytes(row);
    if (!svg) continue;
    const asset: AfcatAsset = { url: afcatAssetUrl(row.id), alt: row.alt_text, mimeType: "image/svg+xml", ...size(svg) };
    const entry = out.get(row.question_id) ?? { stem: [], options: {} };
    if (row.placement === "STEM") entry.stem.push(asset);
    else if (/^OPTION_[ABCD]$/.test(row.placement)) {
      const key = row.placement.slice(-1) as AfcatChoice["key"];
      entry.options[key] = [...(entry.options[key] ?? []), asset];
    } else continue;
    out.set(row.question_id, entry);
  }
  return out;
}
