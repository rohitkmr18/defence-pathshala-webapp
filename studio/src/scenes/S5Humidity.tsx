import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { SkyScene } from "../three/SkyScene";
import { KineticTitle } from "../components/KineticTitle";
import { Chip } from "../components/Chip";
import { DP } from "../branding/brand";
import { K, SCENES, f } from "../projects/contrails/timeline";

const EL = (d: number) => (d * Math.PI) / 180;
const groundCam = (elev: number, fov: number, az = 0) => ({
  position: [0, 0, 0] as [number, number, number],
  target: [Math.sin(az) * Math.cos(EL(elev)) * 1000, Math.sin(EL(elev)) * 1000, -Math.cos(az) * Math.cos(EL(elev)) * 1000] as [number, number, number], fov,
});
const DIAGRAM_AT = 35.6, SPLIT_AT = 39.3;
const e = Easing.bezier(0.16, 1, 0.3, 1);

/* (a) "Lekin twist ye hai — contrail kitni der rahegi?" */
const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const s0 = SCENES.humidity.from;
  const qAt = f(K.kitniDer.on - 0.35 - s0);
  const ring = interpolate(frame, [qAt, qAt + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <SkyScene t={t + 3} width={width} height={height} mode="ground" camera={{ ...groundCam(70, 16, 0.02), roll: 0.25 }} sky={{ cirrus: 0.2 }} flights={[
        { p0: [-700, 10600, -3300], heading: 0.42, scale: 2.2, trail: { r0: 3, grow: 2.0, spread: 1.4, tau: 1e6, ageScale: 4, gapAge: 1.0, sink: 0.6, opacity: 0.3, spacing: 4, wind: [0, 0, 4], tStart: -50 } },
      ]} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.0) 45%)" }} />
      <Chip at={f(K.twist.on - s0)} x={540} y={380} text="TWIST" color={DP.red} size={46} />
      <KineticTitle top={460} lines={[{ text: "KITNI DER", at: qAt, size: 128 }, { text: "RAHEGI?", at: qAt + 5, size: 128, color: DP.blueLight }]} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={890} r={70} fill="rgba(2,6,23,0.6)" stroke="rgba(255,255,255,0.25)" strokeWidth={8} opacity={ring > 0 ? 1 : 0} />
        <circle cx={540} cy={890} r={70} fill="none" stroke={DP.white} strokeWidth={8} strokeDasharray={`${440 * ring} 440`} transform="rotate(-90 540 890)" strokeLinecap="round" />
        <line x1={540} y1={890} x2={540 + 46 * Math.sin(ring * 6.283)} y2={890 - 46 * Math.cos(ring * 6.283)} stroke={DP.white} strokeWidth={6} strokeLinecap="round" opacity={ring > 0 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};

/* (b) Atmosphere cross-section: cruise layer, temperature, ice-relative humidity */
const Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  const base = DIAGRAM_AT;
  const atmAt = f(K.atmosphere.on - base), humAt = f(K.humidity.on - base);
  const yKm = (km: number) => 1180 - km * 61;
  const draw = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp", easing: e });
  const band = interpolate(frame, [atmAt - 4, atmAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const hum = interpolate(frame, [humAt, humAt + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const plane = interpolate(frame, [6, 110], [140, 830], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #030b26 0%, #0b1f55 35%, #1e4fae 75%, #5d93dc 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="trailG" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.9" /></linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        {/* altitude ruler */}
        <line x1={120} y1={yKm(0)} x2={120} y2={yKm(0) - (yKm(0) - yKm(14)) * draw} stroke="rgba(255,255,255,0.6)" strokeWidth={3} />
        {[0, 2, 4, 6, 8, 10, 12, 14].map((km) => (
          <g key={km} opacity={draw}>
            <line x1={108} y1={yKm(km)} x2={132} y2={yKm(km)} stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
            <text x={96} y={yKm(km) + 10} textAnchor="end" fontFamily="Geist Mono" fontSize={26} fill={DP.muted}>{km}</text>
          </g>
        ))}
        <text x={66} y={yKm(14) - 30} fontFamily="Geist" fontWeight={700} fontSize={26} fill={DP.muted} opacity={draw}>km</text>
        {/* low clouds */}
        {[220, 420, 640, 860].map((x, i) => <ellipse key={x} cx={x} cy={yKm(1.6) + (i % 2) * 18} rx={110} ry={34} fill="#fff" opacity={0.28 * draw} filter="url(#soft)" />)}
        {/* cruise band */}
        <rect x={140} y={yKm(12)} width={900} height={yKm(10) - yKm(12)} rx={18} fill={DP.blue} opacity={0.18 + 0.22 * band} stroke={DP.blueLight} strokeOpacity={band} strokeWidth={3} />
        {/* plane icon + contrail through the band */}
        <rect x={140} y={yKm(11) - 5} width={Math.max(0, plane - 160)} height={10} rx={5} fill="url(#trailG)" opacity={0.9} />
        <g transform={`translate(${plane} ${yKm(11)})`}>
          <path d="M 30 0 L -22 -6 L -30 -20 L -36 -20 L -32 -5 L -40 -4 L -48 -14 L -52 -14 L -50 0 L -52 14 L -48 14 L -40 4 L -32 5 L -36 20 L -30 20 L -22 6 Z" fill="#fff" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 170, top: yKm(12) - 116, opacity: band, transform: `translateY(${(1 - band) * 20}px)` }}>
        <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 54, color: DP.white, letterSpacing: -0.5 }}>UPPER ATMOSPHERE</div>
        <div style={{ fontFamily: DP.text, fontWeight: 800, fontSize: 32, color: DP.blueLight }}>cruise ≈ 10–12 km · ≈ −40 to −60°C</div>
      </div>
      {/* humidity gauge: relative humidity with respect to ice */}
      <div style={{ position: "absolute", left: 170, top: yKm(8.6), width: 840, opacity: hum, transform: `translateY(${(1 - hum) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 84, color: DP.blueLight, letterSpacing: -1 }}>HUMIDITY</div>
          <div style={{ fontFamily: DP.text, fontWeight: 500, fontSize: 30, color: DP.muted }}>(relative to ice, RHi)</div>
        </div>
        <div style={{ position: "relative", marginTop: 16, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${hum * 100}%`, height: "100%", background: `linear-gradient(90deg, ${DP.red} 0%, #f59e0b 35%, ${DP.blueLight} 62%, ${DP.blue} 100%)` }} />
          <div style={{ position: "absolute", left: "58%", top: -6, width: 4, height: 42, background: DP.white }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: DP.text, fontWeight: 800, fontSize: 28, color: DP.muted }}>
          <span>DRY</span><span style={{ marginLeft: 170, color: DP.white }}>100%</span><span>ICE-SUPERSATURATED</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* (c) Dry air vs ice-supersaturated air, same flight, same instant */
const Pane: React.FC<{ wet: boolean; t: number }> = ({ wet, t }) => {
  const { height } = useVideoConfig();
  return (
    <SkyScene t={t} width={540} height={height} mode="ground" camera={groundCam(64, 13, 0)} sky={{ cirrus: wet ? 0.24 : 0.04, zenith: wet ? "#1d55c0" : "#1c5ad6" }} flights={[
      { p0: [-70, 10500, -4400], heading: Math.PI / 2 + 0.035, scale: 1.7, trail: wet
        ? { r0: 2.6, grow: 1.6, spread: 0.3, tau: 1e6, ageScale: 8, gapAge: 2.0, sink: 0.5, opacity: 0.27, spacing: 3, wind: [2, 0, 0], tStart: -60 }
        : { r0: 2.6, grow: 1.8, tau: 0.55, gapAge: 0.25, sink: 2, opacity: 0.36, spacing: 3, tStart: -20 } },
    ]} />
  );
};
const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const base = SPLIT_AT;
  const wipe = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const banAt = f(K.kaafiDer.on - base);
  const ban = interpolate(frame, [banAt, banAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  return (
    <AbsoluteFill style={{ background: DP.bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1920, overflow: "hidden", clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}><Pane wet={false} t={t} /></div>
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}><Pane wet t={t} /></div>
      <div style={{ position: "absolute", left: 537, top: 0, width: 6, height: 1920 * wipe, background: DP.white, boxShadow: "0 0 24px rgba(255,255,255,0.6)" }} />
      <Chip at={f(39.45 - base)} x={270} y={330} text="DRY AIR" color={DP.red} size={40} sub="RHi < 100%" />
      <Chip at={f(39.45 - base) + 10} x={270} y={1110} text="jaldi gayab" color={DP.red} size={28} solid={false} />
      <Chip at={f(K.humidAir.on - base) - 3} x={810} y={330} text="ICE-SUPERSATURATED" color={DP.blue} size={29} sub="RHi > 100%" />
      <Chip at={f(K.humidAir.on - base) + 8} x={810} y={1110} text="der tak, phailti hai" color={DP.blue} size={28} solid={false} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: ban, transform: `scale(${0.9 + 0.1 * ban})` }}>
        <div style={{ padding: "26px 40px", borderRadius: 26, background: "rgba(2,6,23,0.86)", border: `3px solid ${DP.blue}`, textAlign: "center", boxShadow: "0 20px 60px rgba(2,6,23,0.6)" }}>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 70, lineHeight: 1.0, color: DP.blueLight, letterSpacing: -1 }}>HUMIDITY</div>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 56, lineHeight: 1.08, color: DP.white, letterSpacing: -0.5 }}>CHANGES EVERYTHING</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S5Humidity: React.FC = () => {
  const s0 = SCENES.humidity.from;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={f(DIAGRAM_AT - s0)}><Twist /></Sequence>
      <Sequence from={f(DIAGRAM_AT - s0)} durationInFrames={f(SPLIT_AT - DIAGRAM_AT)}><Diagram /></Sequence>
      <Sequence from={f(SPLIT_AT - s0)}><Compare /></Sequence>
    </AbsoluteFill>
  );
};
