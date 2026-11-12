/**
 * Contrails reel — narration-first timeline (reel seconds, 30 fps).
 *
 * Source of truth: the user's recordings (assets/audio/source/vo_A_231505.m4a,
 * vo_B_231511.m4a). Phrase boundaries come from pause detection on the
 * recording; keyword times from progressive-prefix Whisper decoding
 * (scripts/audio/keyword_onsets.py → work/kw_onsets*.json). Source → reel time
 * mapping follows the edit decision list below (mirrors build_voice.sh).
 */
export const FPS = 30;
export const DURATION_S = 59.0;
export const DURATION_FRAMES = Math.round(DURATION_S * FPS);

export const VO_EDL = [
  { file: "A", srcIn: 4.05, srcOut: 52.62, at: 0.35 },
  { file: "A", srcIn: 54.22, srcOut: 55.92, at: 49.55 },
  { file: "B", srcIn: 1.92, srcOut: 6.45, at: 51.55 },
] as const;
export const toReel = (file: "A" | "B", src: number) => {
  const e = VO_EDL.find((x) => x.file === file && src >= x.srcIn - 0.3 && src <= x.srcOut + 0.3)!;
  return +(e.at + (src - e.srcIn)).toFixed(3);
};

/** Measured keyword anchors (source seconds = moment the word is recognised,
 *  i.e. ≈ word end). `on` = onset estimate used for reveals (anchor − word length). */
const kw = (file: "A" | "B", detected: number, wordLen = 0.32) => ({ end: toReel(file, detected), on: toReel(file, detected - wordLen) });
export const K = {
  line: kw("A", 7.28),
  dhuaan: kw("A", 9.77),
  nahiDikhti: kw("A", 15.48),
  gayab: kw("A", 17.8),
  ghanton: kw("A", 19.48),
  contrail: kw("A", 22.18, 0.4),
  condensation: kw("A", 23.62, 0.55),
  waterVapour: kw("A", 27.12),
  exhaust: kw("A", 28.2, 0.4),
  thandi: kw("A", 29.41),
  crystals: kw("A", 31.79, 0.45),
  whiteLine: kw("A", 34.6),
  twist: kw("A", 36.93),
  kitniDer: kw("A", 38.25),
  atmosphere: kw("A", 41.62, 0.45),
  humidity: kw("A", 42.1, 0.45),
  humidAir: kw("A", 44.96),
  kaafiDer: kw("A", 45.68),
  climate: kw("A", 51.3, 0.4),
  affect: kw("A", 51.5, 0.4),
  earth: kw("A", 50.82, 0.35),
  letterB: kw("B", 2.44, 0.2),
  letterC: kw("B", 2.92, 0.2),
  comment: kw("B", 3.28, 0.4),
  pathshala: kw("B", 4.91, 0.45),
  follow: kw("B", 5.63, 0.3),
};

/** Caption units = pause-delimited phrases (split at measured anchors where a
 *  phrase is too long for two lines). Markup: *blue term*, !red emphasis! */
export const CAPTIONS: { from: number; to: number; text: string }[] = [
  { from: toReel("A", 4.17), to: toReel("A", 6.25), text: "Kabhi aasman mein aeroplane ke peeche" },
  { from: toReel("A", 6.25), to: toReel("A", 7.9), text: "ye lambi *white line* dekhi hai?" },
  { from: toReel("A", 8.22), to: toReel("A", 10.5), text: "Kya plane aasman mein !dhuaan! chhod raha hai?" },
  { from: toReel("A", 10.63), to: toReel("A", 11.75), text: "Ya phir kuch aur?" },
  { from: toReel("A", 12.03), to: toReel("A", 12.85), text: "Interesting baat..." },
  { from: toReel("A", 12.96), to: toReel("A", 15.95), text: "ye line har aeroplane ke peeche !nahi! dikhti." },
  { from: toReel("A", 16.35), to: toReel("A", 18.3), text: "Kabhi ye kuch seconds mein *gayab* ho jaati hai..." },
  { from: toReel("A", 18.38), to: toReel("A", 20.6), text: "aur kabhi *ghanton tak* aasman mein bani rehti hai!" },
  { from: toReel("A", 20.87), to: toReel("A", 22.3), text: "Actually, ise kehte hain *Contrail*" },
  { from: toReel("A", 22.3), to: toReel("A", 24.6), text: "yaani *Condensation Trail!*" },
  { from: toReel("A", 24.94), to: toReel("A", 26.7), text: "Jab jet engine se nikli garam," },
  { from: toReel("A", 26.7), to: toReel("A", 28.6), text: "*water-vapour* wali exhaust" },
  { from: toReel("A", 28.8), to: toReel("A", 30.5), text: "bahut *thandi hawa* se milti hai," },
  { from: toReel("A", 30.7), to: toReel("A", 32.8), text: "toh tiny *ice crystals* ban jaate hain." },
  { from: toReel("A", 33.0), to: toReel("A", 34.45), text: "Aur wahi humein aasman mein" },
  { from: toReel("A", 34.45), to: toReel("A", 36.0), text: "*white line* ki tarah dikhte hain." },
  { from: toReel("A", 36.22), to: toReel("A", 39.25), text: "Lekin !twist! ye hai — contrail kitni der rahegi," },
  { from: toReel("A", 39.45), to: toReel("A", 40.68), text: "ye mainly depend karta hai" },
  { from: toReel("A", 40.68), to: toReel("A", 42.85), text: "upper atmosphere ki *humidity* par." },
  { from: toReel("A", 43.15), to: toReel("A", 44.55), text: "*Dry air* mein jaldi gayab," },
  { from: toReel("A", 44.55), to: toReel("A", 46.9), text: "aur *humid air* mein kaafi der tak reh sakti hai!" },
  { from: toReel("A", 47.07), to: toReel("A", 48.45), text: "Ab ek !tricky question!!" },
  { from: toReel("A", 48.68), to: toReel("A", 50.45), text: "Kya aeroplane ki white contrails" },
  { from: toReel("A", 50.45), to: toReel("A", 52.55), text: "Earth ke *climate* ko affect kar sakti hain?" },
  { from: toReel("A", 54.34), to: toReel("A", 55.9), text: "Answer comment mein batayein." },
  { from: toReel("B", 2.04), to: toReel("B", 3.65), text: "*A, B ya C* comment karo" },
  { from: toReel("B", 3.72), to: toReel("B", 6.4), text: "aur *Defence Pathshala* ko follow karna mat bhoolna!" },
];

/** Scene cuts sit in natural pauses between phrases. */
export const SCENES = {
  mystery: { from: 0, to: 8.2 },
  contradiction: { from: 8.2, to: 17.05 },
  contrailTitle: { from: 17.05, to: 21.05 },
  engine: { from: 21.05, to: 26.85 },
  ice: { from: 26.85, to: 32.35 },
  humidity: { from: 32.35, to: 43.2 },
  challenge: { from: 43.2, to: DURATION_S },
} as const;
export const f = (s: number) => Math.round(s * FPS);
