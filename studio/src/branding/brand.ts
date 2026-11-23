/** Defence Pathshala brand tokens. The official logo file is used as-is. */
export const DP = {
  bg: "#020617",
  navy: "#0B1A3A",
  blue: "#2563EB",
  blueLight: "#60A5FA",
  red: "#EF4444",
  white: "#FFFFFF",
  muted: "#CBD5E1",
  // typography stacks (fonts loaded in fonts.ts)
  display: "'Geist', 'Inter', sans-serif",
  text: "'Inter', 'Geist', sans-serif",
  mono: "'Geist Mono', monospace",
  logo: "brand/dp_logo.png",
} as const;

export const FORMAT = { width: 1080, height: 1920, fps: 30 } as const;

/** Platform-safe areas (Instagram Reels / YouTube Shorts overlays). */
export const SAFE = {
  top: 150, // status bar + "Reels" header
  bottom: 1560, // username / caption / audio row begins below this
  left: 60,
  right: 1080 - 150, // like / comment / share column
  captionY: 1310, // caption block centre line
} as const;
