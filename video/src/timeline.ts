// Single source of truth for the reel. Edit durations here to match the final VO.
// All times are in seconds, local to the scene unless noted.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Flip to true after dropping the recording at public/vo/vo.wav */
export const HAS_VO = false;
export const VO_FILE = "vo/vo.wav";
/** Optional music bed at public/audio/bed.mp3 */
export const HAS_MUSIC = false;
export const MUSIC_FILE = "audio/bed.mp3";

export type RegionId = "india" | "pok" | "aksai" | "shaksgam";
export type Cam = { x: number; y: number; s: number }; // map-space centre + scale

export type Card = {
  text: string;
  at: number;
  /** vertical slot: top headline, mid caption, low lower-third */
  slot?: "top" | "mid" | "low";
  tone?: "plain" | "blue" | "red" | "green";
};

export type Arrow = {
  d: string; // SVG path in map space (1000x1000)
  at: number;
  dur: number;
  color: string;
  dashed?: boolean;
};

export type Scene = {
  id: string;
  dur: number;
  camFrom: Cam;
  camTo: Cam;
  /** region -> seconds when its colour fills in */
  fills: Partial<Record<RegionId, number>>;
  /** regions shown as the starting state with no animation */
  base?: RegionId[];
  arrows?: Arrow[];
  cards: Card[];
  /** flip-calendar cards */
  dates?: { label: string; at: number }[];
  /** placeholder or real photo/document card */
  photo?: { caption: string; at: number; file?: string };
  showLoC?: number;
  badge?: { text: string; at: number; tone: "blue" | "red" };
  cta?: number;
};

export const SCENES: Scene[] = [
  {
    id: "hook",
    dur: 8,
    camFrom: { x: 500, y: 500, s: 1.0 },
    camTo: { x: 500, y: 500, s: 1.18 },
    fills: { india: 0.4, pok: 3.2, aksai: 4.2 },
    cards: [
      { text: "India ke map mein poora J&K", at: 0.2, slot: "top" },
      { text: "Lekin zameen par kuch aur", at: 3.0, slot: "mid" },
      { text: "Ye hua kaise?", at: 5.6, slot: "low", tone: "blue" },
    ],
  },
  {
    id: "1947",
    dur: 8,
    camFrom: { x: 500, y: 520, s: 1.1 },
    camTo: { x: 500, y: 500, s: 1.25 },
    fills: {},
    base: ["india", "pok", "aksai"],
    cards: [
      { text: "1947 · J&K Riyasat", at: 0.3, slot: "top" },
      { text: "Maharaja Hari Singh", at: 2.2, slot: "mid" },
      { text: "Na India, na Pakistan", at: 4.6, slot: "low", tone: "blue" },
    ],
    photo: { caption: "Maharaja Hari Singh", at: 2.0 },
  },
  {
    id: "invasion",
    dur: 12,
    camFrom: { x: 420, y: 520, s: 1.2 },
    camTo: { x: 460, y: 480, s: 1.5 },
    fills: {},
    base: ["india", "pok", "aksai"],
    arrows: [
      { d: "M 250 470 L 330 450", at: 1.4, dur: 1.4, color: "#ff4d4d" },
      { d: "M 330 450 L 400 440", at: 2.8, dur: 1.2, color: "#ff4d4d" },
      { d: "M 400 440 L 455 470", at: 4.0, dur: 1.2, color: "#ff4d4d" },
    ],
    dates: [
      { label: "22 Oct 1947", at: 0.3 },
      { label: "26 Oct 1947", at: 6.4 },
    ],
    photo: { caption: "Instrument of Accession", at: 7.2 },
    cards: [
      { text: "Kabayli hamlawar", at: 1.2, slot: "mid", tone: "red" },
      { text: "Instrument of Accession sign", at: 7.4, slot: "low", tone: "blue" },
    ],
  },
  {
    id: "army",
    dur: 9,
    camFrom: { x: 470, y: 600, s: 1.1 },
    camTo: { x: 470, y: 470, s: 1.4 },
    fills: {},
    base: ["india", "pok", "aksai"],
    arrows: [{ d: "M 560 900 L 455 470", at: 0.8, dur: 2.2, color: "#ffffff", dashed: true }],
    dates: [{ label: "27 Oct 1947", at: 0.3 }],
    photo: { caption: "Indian Army · Srinagar", at: 3.2 },
    badge: { text: "Ceasefire · 1 Jan 1949", at: 6.0, tone: "blue" },
    cards: [
      { text: "Army plane se Srinagar", at: 0.8, slot: "mid" },
      { text: "United Nations", at: 4.4, slot: "low" },
    ],
  },
  {
    id: "loc",
    dur: 12,
    camFrom: { x: 480, y: 470, s: 1.25 },
    camTo: { x: 430, y: 450, s: 1.35 },
    fills: {},
    base: ["india", "aksai"],
    showLoC: 0.8,
    cards: [
      { text: "Army jahan ruki, wahin border", at: 0.6, slot: "top" },
      { text: "1972 · Line of Control (LoC)", at: 4.0, slot: "mid", tone: "blue" },
      { text: "PoK · Gilgit-Baltistan", at: 7.0, slot: "low", tone: "green" },
    ],
    // pok fills after LoC is drawn
    arrows: [],
  },
  {
    id: "aksai",
    dur: 12,
    camFrom: { x: 560, y: 500, s: 1.4 },
    camTo: { x: 720, y: 540, s: 2.0 },
    fills: { aksai: 6.5 },
    base: ["india", "pok"],
    arrows: [{ d: "M 640 600 L 760 480", at: 2.2, dur: 2.2, color: "#ffd24d", dashed: true }],
    dates: [
      { label: "1950s", at: 2.0 },
      { label: "1962", at: 6.0 },
    ],
    photo: { caption: "Aksai Chin", at: 0.6 },
    cards: [
      { text: "East mein Ladakh · Aksai Chin", at: 0.4, slot: "top" },
      { text: "Chupke se road", at: 3.0, slot: "mid", tone: "red" },
      { text: "1962 War ke baad China ke control mein", at: 7.0, slot: "low", tone: "red" },
    ],
  },
  {
    id: "shaksgam",
    dur: 7,
    camFrom: { x: 520, y: 400, s: 1.5 },
    camTo: { x: 480, y: 330, s: 1.9 },
    fills: { shaksgam: 2.0 },
    base: ["india", "pok", "aksai"],
    arrows: [{ d: "M 380 330 L 520 300", at: 0.8, dur: 1.6, color: "#ff4d4d" }],
    dates: [{ label: "1963", at: 0.3 }],
    cards: [
      { text: "Shaksgam Valley", at: 1.0, slot: "mid", tone: "red" },
      { text: "Pakistan → China · India ise illegal maanta hai", at: 3.0, slot: "low" },
    ],
  },
  {
    id: "outro",
    dur: 10,
    camFrom: { x: 500, y: 450, s: 1.6 },
    camTo: { x: 500, y: 500, s: 1.0 },
    fills: {},
    base: ["india", "pok", "aksai", "shaksgam"],
    cards: [
      { text: "Ek riyasat · Teen deshon ke control mein", at: 0.4, slot: "top" },
      { text: "1994 · Parliament ka unanimous resolution", at: 4.0, slot: "mid", tone: "blue" },
      { text: "NDA · CDS mein baar-baar poocha gaya", at: 6.0, slot: "low" },
    ],
    cta: 7.0,
  },
];

export const TOTAL_SECONDS = SCENES.reduce((a, s) => a + s.dur, 0);
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);
