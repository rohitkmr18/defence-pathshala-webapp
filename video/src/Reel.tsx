import { AbsoluteFill, Audio, Img, Sequence, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/noto-serif-devanagari/devanagari-700.css";
import "@fontsource/noto-sans-devanagari/devanagari-600.css";
import { MapLayer } from "./MapLayer";
import { Card, FPS, HAS_MUSIC, HAS_VO, MUSIC_FILE, SCENES, Scene, VO_FILE } from "./timeline";

const BLUE = "#285FF2";
const TONES = { plain: "#101826", blue: BLUE, red: "#c62828", green: "#1f8a4c" } as const;
const SERIF = "'Noto Serif Devanagari', serif";
const SANS = "'Noto Sans Devanagari', sans-serif";
// Instagram safe zones: 150px top, 250px bottom
const SLOT_Y = { top: 190, mid: 1480, low: 1580 } as const;

const useT = () => useCurrentFrame() / useVideoConfig().fps;

const pop = (t: number, at: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at * fps, fps, config: { damping: 14, stiffness: 140 } });
};

const TextCard: React.FC<{ c: Card; end: number }> = ({ c, end }) => {
  const t = useT();
  if (t < c.at) return null;
  const s = pop(t, c.at);
  const out = interpolate(t, [end - 0.3, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tone = c.tone ?? "plain";
  const filled = tone !== "plain";
  return (
    <div style={{ position: "absolute", left: 60, right: c.slot === "top" ? 200 : 60, top: SLOT_Y[c.slot ?? "mid"], display: "flex", justifyContent: "center", opacity: out, transform: `scale(${0.85 + 0.15 * s})`, translate: `0 ${(1 - s) * 30}px` }}>
      <div style={{
        fontFamily: SERIF, fontWeight: 700, fontSize: c.slot === "top" ? 50 : 52, lineHeight: 1.25, textAlign: "center",
        color: filled ? "#fff" : "#fff", background: filled ? TONES[tone] : "rgba(10,16,30,0.72)",
        padding: "14px 30px", borderRadius: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.45)", textShadow: "0 2px 6px rgba(0,0,0,0.5)",
      }}>{c.text}</div>
    </div>
  );
};

const DateCard: React.FC<{ label: string; at: number; end: number }> = ({ label, at, end }) => {
  const t = useT();
  if (t < at || t > end) return null;
  const flip = interpolate(t - at, [0, 0.45], [-90, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 60, top: 340, perspective: 800 }}>
      <div style={{ transform: `rotateX(${flip}deg)`, transformOrigin: "top", background: "#fff", color: "#111", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", minWidth: 300 }}>
        <div style={{ background: "#c62828", height: 34 }} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, padding: "12px 24px 16px", textAlign: "center" }}>{label}</div>
      </div>
    </div>
  );
};

const PhotoCard: React.FC<{ p: NonNullable<Scene["photo"]>; end: number }> = ({ p, end }) => {
  const t = useT();
  if (t < p.at) return null;
  const s = pop(t, p.at);
  const out = interpolate(t, [end - 0.3, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", right: 50, top: 560, width: 420, opacity: out, transform: `translateY(${(1 - s) * 80}px) rotate(${2 - s * 2}deg)` }}>
      <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,0.55)" }}>
        {p.file ? (
          <Img src={staticFile(p.file)} style={{ width: "100%", height: 300, objectFit: "cover", filter: "sepia(0.35) contrast(1.05)" }} />
        ) : (
          <div style={{ height: 300, background: "repeating-linear-gradient(45deg,#d9d9d9,#d9d9d9 12px,#e9e9e9 12px,#e9e9e9 24px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, color: "#666", fontSize: 26 }}>फ़ोटो यहाँ</div>
        )}
        <div style={{ fontFamily: SERIF, fontWeight: 700, color: "#111", fontSize: 30, padding: "10px 6px 2px", textAlign: "center" }}>{p.caption}</div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ b: NonNullable<Scene["badge"]> }> = ({ b }) => {
  const t = useT();
  if (t < b.at) return null;
  const s = pop(t, b.at);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1370, display: "flex", justifyContent: "center", transform: `scale(${s})` }}>
      <div style={{ background: b.tone === "blue" ? BLUE : "#c62828", color: "#fff", fontFamily: SERIF, fontWeight: 700, fontSize: 46, padding: "12px 34px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>{b.text}</div>
    </div>
  );
};

const Cta: React.FC<{ at: number }> = ({ at }) => {
  const t = useT();
  if (t < at) return null;
  const pulse = 1 + 0.06 * Math.sin((t - at) * 7);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1680, display: "flex", justifyContent: "center", transform: `scale(${pulse})` }}>
      <div style={{ background: "#e53935", color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 44, padding: "16px 44px", borderRadius: 999 }}>💬 कमेंट में बताइए</div>
    </div>
  );
};

const Legend: React.FC = () => (
  <div style={{ position: "absolute", left: 60, top: 1290, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#fff", display: "grid", gap: 8 }}>
    {[["#f2c230", "भारत"], ["#35b36b", "पाकिस्तान के क़ब्ज़े में"], ["#e8473f", "चीन के क़ब्ज़े में"]].map(([c, l]) => (
      <div key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 26, height: 26, borderRadius: 6, background: c }} />{l}</div>
    ))}
  </div>
);

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => (
  <AbsoluteFill>
    <MapLayer scene={scene} />
    {scene.cards.map((c, i) => <TextCard key={i} c={c} end={scene.dur - 0.1} />)}
    {scene.dates?.map((d, i) => <DateCard key={i} label={d.label} at={d.at} end={scene.dates?.[i + 1]?.at ?? scene.dur} />)}
    {scene.photo && <PhotoCard p={scene.photo} end={scene.dur} />}
    {scene.badge && <Badge b={scene.badge} />}
    {scene.cta !== undefined && <><Legend /><Cta at={scene.cta} /></>}
  </AbsoluteFill>
);

export const Reel: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #223048 0%, #0b1220 70%)" }}>
      {HAS_VO && <Audio src={staticFile(VO_FILE)} />}
      {HAS_MUSIC && <Audio src={staticFile(MUSIC_FILE)} volume={0.12} />}
      {SCENES.map((s) => {
        const start = from;
        const frames = Math.round(s.dur * FPS);
        from += frames;
        return <Sequence key={s.id} from={start} durationInFrames={frames}><SceneView scene={s} /></Sequence>;
      })}
      {/* vignette + persistent DP bug */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.65)", pointerEvents: "none" }} />
      <Img src={staticFile("dp-logo.svg")} style={{ position: "absolute", right: 48, top: 150, width: 120, filter: "brightness(0) invert(1)" }} />
    </AbsoluteFill>
  );
};
