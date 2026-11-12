// Copies licensed fonts and the user-supplied official logo into public/.
// Originals are never modified. Run: npm run prepare:assets
import { cpSync, mkdirSync, existsSync } from "node:fs";
const copies = [
  ["node_modules/geist/dist/fonts/geist-sans/Geist-Black.woff2", "public/fonts/Geist-Black.woff2"],
  ["node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2", "public/fonts/Geist-Bold.woff2"],
  ["node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", "public/fonts/Geist-SemiBold.woff2"],
  ["node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2", "public/fonts/Geist-Medium.woff2"],
  ["node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2", "public/fonts/GeistMono-Medium.woff2"],
  ["node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2", "public/fonts/Inter-ExtraBold.woff2"],
  ["node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", "public/fonts/Inter-Medium.woff2"],
  ["assets/logo/dp_logo_original.png", "public/brand/dp_logo.png"],
];
for (const [from, to] of copies) {
  if (!existsSync(from)) { console.warn("missing", from); continue; }
  mkdirSync(to.split("/").slice(0, -1).join("/"), { recursive: true });
  cpSync(from, to);
  console.log("copied", to);
}
