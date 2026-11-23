import { useId } from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { LOC_PATH, PLACES, REGION_COLORS, REGION_PATHS } from "./regions";
import type { Arrow, RegionId, Scene } from "./timeline";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const MapLayer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = interpolate(t, [0, scene.dur], [0, 1], { extrapolateRight: "clamp" });
  const e = ease(p);
  const cam = {
    x: scene.camFrom.x + (scene.camTo.x - scene.camFrom.x) * e,
    y: scene.camFrom.y + (scene.camTo.y - scene.camFrom.y) * e,
    s: scene.camFrom.s + (scene.camTo.s - scene.camFrom.s) * e,
  };
  const ids = Object.keys(REGION_PATHS) as RegionId[];
  const opacityOf = (id: RegionId) => {
    if (scene.base?.includes(id)) return 0.85;
    const at = scene.fills[id];
    if (at === undefined) return 0;
    return interpolate(t, [at, at + 0.8], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  // map space is 1000x1000, rendered into a 1080 box centred in the frame
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1000 1000"
        style={{
          position: "absolute", left: 0, top: 360, width: 1080, height: 1080,
          transform: `translate(${(500 - cam.x) * cam.s * 1.08}px, ${(500 - cam.y) * cam.s * 1.08}px) scale(${cam.s})`,
          transformOrigin: "50% 50%",
        }}
      >
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#ffffff10" strokeWidth="1" /></pattern>
        </defs>
        <rect x="-600" y="-600" width="2200" height="2200" fill="url(#grid)" />
        {ids.map((id) => (
          <path key={id} d={REGION_PATHS[id]} fill={REGION_COLORS[id]} fillOpacity={opacityOf(id)} stroke="#ffffffcc" strokeWidth={2.2} strokeLinejoin="round" />
        ))}
        {scene.showLoC !== undefined && (
          <>
            <Draw d={LOC_PATH} at={scene.showLoC} dur={2.4} color="#ffffff" glow />
            <rect x="0" y="0" width="0" height="0" />
            <PokFill at={scene.showLoC + 2.2} />
          </>
        )}
        {scene.arrows?.map((a, i) => <Draw key={i} {...a} />)}
        {Object.values(PLACES).map((pl) => (
          <g key={pl.label}>
            <circle cx={pl.x} cy={pl.y} r={5} fill="#fff" />
            <text x={pl.x + 10} y={pl.y - 8} fill="#fff" fontSize={22} fontFamily="Noto Sans Devanagari">{pl.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const PokFill: React.FC<{ at: number }> = ({ at }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const o = interpolate(t, [at, at + 0.9], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <path d={REGION_PATHS.pok} fill={REGION_COLORS.pok} fillOpacity={o} />;
};

const Draw: React.FC<Arrow & { glow?: boolean }> = ({ d, at, dur, color, dashed, glow }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const id = useId().replace(/:/g, "");
  const p = interpolate(t, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  if (t < at) return null;
  const solid = (
    <path d={d} pathLength={1} fill="none" stroke={dashed ? "#fff" : color} strokeWidth={6} strokeLinecap="round"
      strokeDasharray={1} strokeDashoffset={1 - p} filter={glow ? "url(#glow)" : undefined} />
  );
  if (!dashed) return solid;
  return (
    <>
      <mask id={id}>{solid}</mask>
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray="14 12" mask={`url(#${id})`} />
    </>
  );
};
