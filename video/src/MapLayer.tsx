import { useId } from "react";
import { Easing, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, PLACES, REGIONS } from "./regions";
import { Arrow, ColorKey, HEIGHT, MAP_H, MAP_W, Paint, RegionId, Scene, WIDTH } from "./timeline";

const K = WIDTH / MAP_W; // base scale: map image fills the frame width
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const FONT = "'Poppins', sans-serif";

const maskStyle = (name: string): React.CSSProperties => {
  const u = `url(${staticFile(`maps/mask_${name}.png`)})`;
  return { WebkitMaskImage: u, maskImage: u, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
};

function regionColor(scene: Scene, id: RegionId, t: number): string {
  let cur: ColorKey = scene.init?.[id] ?? "claim";
  let colour = COLORS[cur];
  for (const p of (scene.paint ?? []).filter((p: Paint) => p.region === id).sort((a, b) => a.at - b.at)) {
    if (t < p.at) break;
    colour = interpolateColors(t, [p.at, p.at + 0.8], [COLORS[cur], COLORS[p.to]]);
    cur = p.to;
  }
  return colour;
}

export const MapLayer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const e = ease(interpolate(t, [0, scene.dur], [0, 1], { extrapolateRight: "clamp" }));
  const cam = {
    x: scene.camFrom.x + (scene.camTo.x - scene.camFrom.x) * e,
    y: scene.camFrom.y + (scene.camTo.y - scene.camFrom.y) * e,
    s: scene.camFrom.s + (scene.camTo.s - scene.camFrom.s) * e,
  };
  const sc = K * cam.s;
  const pop = (at: number) => spring({ frame: frame - at * fps, fps, config: { damping: 12, stiffness: 150 } });

  // LoC wipe along the line (it runs bottom-left -> up -> top-right, so a 45deg sweep follows it)
  let locStyle: React.CSSProperties | null = null;
  if (scene.loc?.mode === "full") locStyle = {};
  if (scene.loc?.mode === "draw" && t >= scene.loc.at) {
    const p = interpolate(t, [scene.loc.at, scene.loc.at + 2.4], [26, 63], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const g = `linear-gradient(45deg, #000 ${p}%, transparent ${p + 1.2}%)`;
    locStyle = { WebkitMaskImage: g, maskImage: g };
  }

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fcf0e6" }}>
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: MAP_W, height: MAP_H, transformOrigin: "0 0",
          transform: `translate(${WIDTH / 2 - cam.x * sc}px, ${HEIGHT / 2 - cam.y * sc}px) scale(${sc})`,
        }}
      >
        {REGIONS.map((id) => (
          <div key={id} style={{ position: "absolute", inset: 0, background: regionColor(scene, id, t), ...maskStyle(id) }} />
        ))}
        <img src={staticFile("maps/lines.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {locStyle && (
          <img src={staticFile("maps/loc.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 6px rgba(232,28,44,0.8))", ...locStyle }} />
        )}

        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {scene.arrows?.map((a, i) => <DrawPath key={i} {...a} t={t} />)}
          {scene.flagsArrow && <FlagArrow t={t} at={scene.flagsArrow.at} />}
        </svg>

        {scene.places?.map((id) => {
          const p = PLACES[id];
          const s = pop(0.3);
          return (
            <div key={id} style={{ position: "absolute", left: p.x, top: p.y, transform: `scale(${s})`, transformOrigin: "0 0" }}>
              <div style={{ position: "absolute", left: -7, top: -7, width: 14, height: 14, borderRadius: 14, background: "#1b2a4a", border: "3px solid #fff" }} />
              <div style={{ position: "absolute", left: p.anchor === "start" ? p.dx : undefined, right: p.anchor === "end" ? -p.dx : undefined, top: p.dy - 22, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "#1b2a4a", textShadow: "0 0 6px #fcf0e6, 0 0 6px #fcf0e6" }}>{p.label}</div>
            </div>
          );
        })}

        {scene.crown !== undefined && t >= scene.crown && (
          <div style={{ position: "absolute", left: 420, top: 960, fontSize: 110, transform: `translate(-50%,-50%) scale(${pop(scene.crown)})` }}>👑</div>
        )}

        {scene.plane && <Plane {...scene.plane} t={t} />}

        {scene.pins?.map((p, i) => t >= p.at && (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${pop(p.at)})`, transformOrigin: "50% 100%" }}>
            <div style={{ width: 96, height: 96, borderRadius: 96, background: "#fff", border: "6px solid #1b2a4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }}>{p.flag}</div>
            <div style={{ width: 0, height: 0, margin: "-4px auto 0", borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "24px solid #1b2a4a" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const DrawPath: React.FC<Arrow & { t: number }> = ({ d, at, dur, color, dashed, t }) => {
  const id = useId().replace(/:/g, "");
  if (t < at) return null;
  const p = interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const solid = (
    <path d={d} pathLength={1} fill="none" stroke={dashed ? "#fff" : color} strokeWidth={9} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - p} />
  );
  if (!dashed) return solid;
  return (
    <>
      <mask id={id}>{solid}</mask>
      <path d={d} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray="22 16" mask={`url(#${id})`} />
    </>
  );
};

// PoK/Shaksgam -> China arrow with flags at each end (scene 7 of the DP storyboard)
const FlagArrow: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at) return null;
  const p = interpolate(t, [at, at + 1.6], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <g>
      <text x={320} y={545} fontSize={80} textAnchor="middle">🇵🇰</text>
      <path d="M 375 520 Q 490 450 600 505" pathLength={1} fill="none" stroke="#1b2a4a" strokeWidth={9} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - p} />
      <text x={655} y={545} fontSize={80} textAnchor="middle" opacity={p}>🇨🇳</text>
    </g>
  );
};

const Plane: React.FC<{ from: [number, number]; ctrl: [number, number]; to: [number, number]; at: number; dur: number; t: number }> = ({ from, ctrl, to, at, dur, t }) => {
  if (t < at) return null;
  const u = interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const b = (a: number, c: number, d: number) => (1 - u) ** 2 * a + 2 * (1 - u) * u * c + u ** 2 * d;
  const x = b(from[0], ctrl[0], to[0]);
  const y = b(from[1], ctrl[1], to[1]);
  const dx = 2 * (1 - u) * (ctrl[0] - from[0]) + 2 * u * (to[0] - ctrl[0]);
  const dy = 2 * (1 - u) * (ctrl[1] - from[1]) + 2 * u * (to[1] - ctrl[1]);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 45; // emoji points north-east by default
  return <div style={{ position: "absolute", left: x, top: y, fontSize: 90, transform: `translate(-50%,-50%) rotate(${ang}deg)`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}>✈️</div>;
};
