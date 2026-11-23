// !! SCHEMATIC PLACEHOLDER GEOMETRY (1000x1000 map space) !!
// These shapes are NOT the real boundary. Before publishing, replace each `d` with the
// path traced from the official Survey of India outline (see public/maps/README.md).
// Keep the ids so the timeline keeps working.
import type { RegionId } from "./timeline";

export const REGION_PATHS: Record<RegionId, string> = {
  india: "M 330 520 L 380 430 L 470 400 L 560 430 L 640 520 L 600 640 L 500 700 L 400 650 Z",
  pok: "M 180 430 L 260 360 L 380 300 L 470 330 L 470 400 L 380 430 L 330 520 L 240 540 Z",
  aksai: "M 640 520 L 600 430 L 700 400 L 820 470 L 800 580 L 700 610 Z",
  shaksgam: "M 470 330 L 560 290 L 620 340 L 560 430 L 470 400 Z",
};

export const REGION_COLORS: Record<RegionId, string> = {
  india: "#f2c230",
  pok: "#35b36b",
  aksai: "#e8473f",
  shaksgam: "#e8473f",
};

// Approximate marker positions on the schematic (re-place after swapping the map).
export const PLACES = {
  muzaffarabad: { x: 330, y: 450, label: "मुज़फ़्फ़राबाद" },
  baramulla: { x: 400, y: 440, label: "बारामूला" },
  srinagar: { x: 455, y: 470, label: "श्रीनगर" },
  delhi: { x: 560, y: 900, label: "दिल्ली" },
};

export const LOC_PATH = "M 330 520 L 380 430 L 470 400";
