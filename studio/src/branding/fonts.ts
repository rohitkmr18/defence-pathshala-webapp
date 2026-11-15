import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const faces: [string, string, string][] = [
  ["Geist", "fonts/Geist-Black.woff2", "900"],
  ["Geist", "fonts/Geist-Bold.woff2", "700"],
  ["Geist", "fonts/Geist-SemiBold.woff2", "600"],
  ["Geist", "fonts/Geist-Medium.woff2", "500"],
  ["Geist Mono", "fonts/GeistMono-Medium.woff2", "500"],
  ["Inter", "fonts/Inter-ExtraBold.woff2", "800"],
  ["Inter", "fonts/Inter-Medium.woff2", "500"],
];
let loaded: Promise<unknown> | null = null;
/** Registers brand fonts; Remotion's loadFont blocks rendering until ready. */
export const ensureFonts = () => {
  if (!loaded) {
    loaded = Promise.all(faces.map(([family, file, weight]) => loadFont({ family, url: staticFile(file), weight })));
  }
  return loaded;
};
ensureFonts();
