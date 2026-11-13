// Exports SFX cue sheet + SRT captions from the single source of truth
// (src/projects/contrails/timeline.ts). Usage: node scripts/export-timeline.mjs
import { writeFileSync, mkdirSync } from "node:fs";
const { K, CAPTIONS, SCENES, DURATION_S } = await import("../src/projects/contrails/timeline.ts");
const s = Object.fromEntries(Object.entries(SCENES).map(([k, v]) => [k, v.from]));
const cue = {
  push: K.line.on - 0.25, smoke: K.dhuaan.on, science: 6.93, trail: 9.3, noTrail: K.nahiDikhti.on,
  gayab: K.gayab.on - 0.13, ghanton: K.ghanton.on - 0.13, contrail: K.contrail.on, condensation: K.condensation.on,
  hot: K.waterVapour.on - 0.15, cold: K.thandi.on - 0.1, freeze: s.ice + 0.75, crystals: K.crystals.on - 0.3,
  pull: s.ice + 2.45, twist: K.twist.on, clock: K.kitniDer.on - 0.35, atmosphere: K.atmosphere.on, humidity: K.humidity.on,
  dry: 39.45, humid: K.humidAir.on - 0.1, banner: K.kaafiDer.on, tricky: 43.37,
  optA: K.climate.end + 0.05, optB: K.affect.end + 0.15, optC: K.affect.end + 0.75, cdA: 49.1, cdB: 51.6,
  pA: 51.69, pB: K.letterB.on, pC: K.letterC.on, end: 53.65, follow: K.follow.on - 0.1,
};
mkdirSync("work", { recursive: true });
writeFileSync("work/cues.json", JSON.stringify({ duration: DURATION_S, scenes: s, cue }, null, 1));
const ts = (x) => { const ms = Math.round(x * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60, r = ms % 1000; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(r).padStart(3, "0")}`; };
const srt = CAPTIONS.map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text.replace(/\*([^*]+)\*/g, "$1").replace(/!([^!]+)!/g, "$1")}\n`).join("\n");
const out = process.argv[2] ?? "renders/contrails/contrails_captions.srt";
mkdirSync(out.split("/").slice(0, -1).join("/"), { recursive: true });
writeFileSync(out, srt);
console.log("cues + srt written", Object.keys(cue).length, CAPTIONS.length);
