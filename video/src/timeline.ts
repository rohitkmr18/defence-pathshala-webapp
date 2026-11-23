// Single source of truth for the reel. Edit durations here to match the final VO.
// Times are seconds, local to the scene. Map coordinates are in IMAGE space
// (941 x 1672, the DP base map in src_assets/2.png).

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const MAP_W = 941;
export const MAP_H = 1672;

/** VO = the recorded take (public/vo/vo-raw.mp3) with long pauses trimmed + 1.15x tempo, see scripts/prep_vo.sh */
export const HAS_VO = true;
export const VO_FILE = "vo/vo.mp3";
/** Optional music bed at public/audio/bed.mp3 */
export const HAS_MUSIC = false;
export const MUSIC_FILE = "audio/bed.mp3";

export type RegionId = "india" | "pok" | "aksai" | "shaksgam";
export type ColorKey = "claim" | "pak" | "china" | "flash";
export type PlaceId = "srinagar" | "muzaffarabad" | "baramulla" | "leh" | "jammu" | "delhi";
export type Cam = { x: number; y: number; s: number }; // map-space centre + zoom

export type Card = {
  text: string;
  at: number;
  slot?: "top" | "mid" | "low";
  tone?: "plain" | "blue" | "red" | "green";
};

export type Arrow = {
  d: string; // SVG path in map space
  at: number;
  dur: number;
  color: string;
  dashed?: boolean;
};

export type Paint = { region: RegionId; to: ColorKey; at: number };

export type Scene = {
  id: string;
  dur: number;
  camFrom: Cam;
  camTo: Cam;
  /** starting colour per region (default "claim": the whole state shown as India's claim) */
  init?: Partial<Record<RegionId, ColorKey>>;
  paint?: Paint[];
  arrows?: Arrow[];
  places?: PlaceId[];
  cards: Card[];
  dates?: { label: string; at: number }[];
  photo?: { caption: string; at: number; file?: string; side?: "left" | "right"; h?: number };
  badge?: { text: string; at: number; tone: "blue" | "red" };
  /** "draw" = LoC wipes in at `at`; "full" = already visible */
  loc?: { mode: "draw"; at: number } | { mode: "full" };
  crown?: number;
  /** plane flying along a quadratic bezier */
  plane?: { from: [number, number]; ctrl: [number, number]; to: [number, number]; at: number; dur: number };
  /** flags/pins */
  pins?: { flag: string; x: number; y: number; at: number }[];
  flagsArrow?: { from: string; to: string; at: number };
  cta?: number;
  legend?: boolean;
};

const OUT_SPLIT: Partial<Record<RegionId, ColorKey>> = { pok: "pak", shaksgam: "pak", aksai: "china" };

// Scene timings follow the recorded VO (scene starts: 0, 9.65, 18.82, 35.43, 45.77, 58.04, 69.19, 75.81 s).
// In-scene beats are placed from sentence boundaries found in the audio (approx. +/-0.5 s);
// re-check them after any new recording.
export const SCENES: Scene[] = [
  {
    id: "hook",
    dur: 9.65,
    camFrom: { x: 470, y: 836, s: 1.0 },
    camTo: { x: 470, y: 836, s: 1.14 },
    paint: [
      { region: "pok", to: "pak", at: 3.7 },
      { region: "shaksgam", to: "china", at: 5.4 },
      { region: "aksai", to: "china", at: 5.4 },
    ],
    cards: [
      { text: "India ke map mein poora J&K", at: 0.2, slot: "top" },
      { text: "Lekin zameen par kuch aur", at: 3.6, slot: "mid" },
      { text: "Ye hua kaise?", at: 7.2, slot: "low", tone: "blue" },
    ],
  },
  {
    id: "1947",
    dur: 9.17,
    camFrom: { x: 470, y: 860, s: 1.1 },
    camTo: { x: 420, y: 900, s: 1.3 },
    crown: 1.4,
    cards: [
      { text: "1947 · J&K Riyasat", at: 0.2, slot: "top" },
      { text: "Maharaja Hari Singh", at: 2.5, slot: "mid" },
      { text: "Na India, na Pakistan", at: 4.4, slot: "low", tone: "blue" },
    ],
    photo: { caption: "Maharaja Hari Singh", at: 2.4, file: "photos/hari-singh.jpg" },
  },
  {
    id: "invasion",
    dur: 16.61,
    camFrom: { x: 190, y: 880, s: 1.8 },
    camTo: { x: 230, y: 890, s: 2.2 },
    places: ["muzaffarabad", "baramulla", "srinagar"],
    arrows: [
      { d: "M 10 835 L 150 875", at: 3.0, dur: 1.8, color: "#e53935" },
      { d: "M 150 875 L 234 898", at: 5.2, dur: 1.4, color: "#e53935" },
      { d: "M 234 898 L 280 910", at: 6.8, dur: 1.2, color: "#e53935" },
    ],
    dates: [
      { label: "22 Oct 1947", at: 0.3 },
      { label: "26 Oct 1947", at: 10.6 },
    ],
    photo: { caption: "Maharaja Hari Singh · 26 Oct 1947", at: 11.4, file: "photos/accession-crop.jpg", h: 260 },
    cards: [
      { text: "Kabayli hamlawar", at: 2.4, slot: "mid", tone: "red" },
      { text: "Instrument of Accession sign", at: 11.6, slot: "low", tone: "blue" },
    ],
  },
  {
    id: "army",
    dur: 10.34,
    camFrom: { x: 380, y: 1020, s: 1.15 },
    camTo: { x: 320, y: 990, s: 1.5 },
    places: ["srinagar", "delhi"],
    arrows: [{ d: "M 520 1480 Q 420 1230 290 925", at: 1.4, dur: 3.0, color: "#1b2a4a", dashed: true }],
    plane: { from: [520, 1480], ctrl: [420, 1230], to: [290, 925], at: 1.4, dur: 3.0 },
    dates: [{ label: "27 Oct 1947", at: 0.5 }],
    photo: { caption: "Indian troops · Srinagar, 1947", at: 4.4, file: "photos/army-srinagar-1947.jpg", h: 300 },
    badge: { text: "Ceasefire · 1 Jan 1949", at: 8.4, tone: "blue" },
    cards: [
      { text: "Army plane se Srinagar", at: 1.4, slot: "mid" },
      { text: "United Nations", at: 6.4, slot: "low" },
    ],
  },
  {
    id: "loc",
    dur: 12.27,
    camFrom: { x: 360, y: 880, s: 1.4 },
    camTo: { x: 400, y: 840, s: 1.6 },
    loc: { mode: "draw", at: 1.0 },
    paint: [
      { region: "pok", to: "pak", at: 8.6 },
      { region: "shaksgam", to: "pak", at: 8.6 },
    ],
    cards: [
      { text: "Army jahan ruki, wahin border", at: 1.8, slot: "top" },
      { text: "1972 · Line of Control (LoC)", at: 4.8, slot: "mid", tone: "blue" },
      { text: "PoK · Gilgit-Baltistan", at: 8.8, slot: "low", tone: "green" },
    ],
  },
  {
    id: "aksai",
    dur: 11.15,
    camFrom: { x: 560, y: 900, s: 1.25 },
    camTo: { x: 760, y: 770, s: 1.85 },
    init: { pok: "pak", shaksgam: "pak" },
    loc: { mode: "full" },
    paint: [{ region: "aksai", to: "china", at: 9.0 }],
    arrows: [{ d: "M 800 625 L 770 760 L 815 865", at: 5.2, dur: 2.6, color: "#f59e0b", dashed: true }],
    dates: [
      { label: "1950s", at: 4.6 },
      { label: "1962", at: 8.3 },
    ],
    photo: { caption: "Xinjiang–Tibet highway (G219)", at: 2.9, side: "left", file: "photos/aksai-road-marker.jpg", h: 300 },
    cards: [
      { text: "East mein Ladakh · Aksai Chin", at: 0.3, slot: "top" },
      { text: "Chupke se road", at: 5.4, slot: "mid", tone: "red" },
      { text: "1962 War ke baad China ke control mein", at: 8.6, slot: "low", tone: "red" },
    ],
  },
  {
    id: "shaksgam",
    dur: 6.62,
    camFrom: { x: 490, y: 650, s: 1.5 },
    camTo: { x: 480, y: 630, s: 1.9 },
    init: { pok: "pak", shaksgam: "pak", aksai: "china" },
    loc: { mode: "full" },
    paint: [
      { region: "shaksgam", to: "flash", at: 2.2 },
      { region: "shaksgam", to: "china", at: 4.2 },
    ],
    flagsArrow: { from: "🇵🇰", to: "🇨🇳", at: 2.8 },
    dates: [{ label: "1963", at: 0.2 }],
    cards: [
      { text: "Shaksgam Valley", at: 2.4, slot: "mid", tone: "red" },
      { text: "Pakistan → China · India ise illegal maanta hai", at: 4.6, slot: "low" },
    ],
  },
  {
    id: "outro",
    dur: 15.0,
    camFrom: { x: 470, y: 836, s: 1.45 },
    camTo: { x: 470, y: 836, s: 1.0 },
    init: { ...OUT_SPLIT, shaksgam: "china" },
    loc: { mode: "full" },
    pins: [
      { flag: "🇵🇰", x: 260, y: 690, at: 0.5 },
      { flag: "🇨🇳", x: 780, y: 760, at: 1.1 },
      { flag: "🇮🇳", x: 430, y: 1010, at: 1.7 },
    ],
    legend: true,
    cards: [
      { text: "Ek riyasat, teen desh", at: 0.3, slot: "top" },
      { text: "1994 · Parliament resolution", at: 2.5, slot: "mid", tone: "blue" },
      { text: "NDA · CDS mein poocha jata hai", at: 8.9, slot: "low" },
    ],
    cta: 11.8,
  },
];

export const TOTAL_SECONDS = SCENES.reduce((a, s) => a + s.dur, 0);
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);
