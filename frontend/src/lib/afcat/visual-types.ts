/**
 * AFCAT visual content contract. Asset URLs are supplied by a trusted API only.
 * Never embed raw uploaded SVG markup into HTML.
 */
export type AfcatAsset = {
  url: string;
  alt: string;
  mimeType: "image/svg+xml" | "image/png" | "image/webp";
  width?: number;
  height?: number;
};

export type AfcatContent = {
  text?: string;
  assets?: AfcatAsset[];
};

export type AfcatChoice = {
  key: "A" | "B" | "C" | "D";
  content: AfcatContent;
};

export type AfcatDisplayQuestion = {
  id: string;
  number: number;
  stem: AfcatContent;
  options: [AfcatChoice, AfcatChoice, AfcatChoice, AfcatChoice];
};

/** URLs must be root-relative or secure HTTPS and must never contain script schemes. */
export function isSafeAfcatAssetUrl(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}
