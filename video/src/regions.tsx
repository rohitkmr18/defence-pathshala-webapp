import type { ColorKey, PlaceId, RegionId } from "./timeline";

export const REGIONS: RegionId[] = ["india", "pok", "aksai", "shaksgam"];

// Fill colours sampled from the DP base map
export const COLORS: Record<ColorKey, string> = {
  claim: "#fad2f6",
  pak: "#c9d1fe",
  china: "#e0fabd",
  flash: "#ffd240",
};

// Marker positions in IMAGE space. Srinagar/Leh/Jammu are read off the DP artwork;
// Muzaffarabad and Baramulla are placed from their real lat/long relative to Srinagar
// (approximate — this is an illustrative map, not a survey).
export const PLACES: Record<PlaceId, { x: number; y: number; label: string; dx: number; dy: number; anchor: "start" | "end" }> = {
  srinagar: { x: 282, y: 913, label: "Srinagar", dx: 20, dy: 10, anchor: "start" },
  muzaffarabad: { x: 150, y: 875, label: "Muzaffarabad", dx: -20, dy: -22, anchor: "start" },
  baramulla: { x: 234, y: 898, label: "Baramulla", dx: -70, dy: 56, anchor: "start" },
  leh: { x: 620, y: 888, label: "Leh", dx: 14, dy: -10, anchor: "start" },
  jammu: { x: 241, y: 1087, label: "Jammu", dx: 14, dy: 8, anchor: "start" },
  delhi: { x: 520, y: 1480, label: "Delhi se", dx: -14, dy: 8, anchor: "end" },
};
