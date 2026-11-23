import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { DP } from "../branding/brand";
import { K, SCENES, f } from "../projects/contrails/timeline";

const e = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const at = (s: number) => f(s - SCENES.challenge.from);
const p = (fr: number, a: number, d: number, ez = e) => interpolate(fr, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ez });

/* The recorded CTA asks: "Kya aeroplane ki white contrails Earth ke climate ko
 * affect kar sakti hain?" — options are on-screen only (the narration says
 * "A, B ya C comment karo"); the answer is deliberately NOT revealed. */
export const OPTIONS = [
  { k: "A", text: "HAAN, CLIMATE PAR ASAR PADTA HAI" },
  { k: "B", text: "NAHI, YE SIRF PAANI HAI" },
  { k: "C", text: "SIRF BAARISH WALE DIN" },
];

const Backdrop: React.FC<{ fr: number }> = ({ fr }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${DP.navy} 0%, ${DP.bg} 72%)` }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      <defs>
        <linearGradient id="cl" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.5" /></linearGradient>
        <filter id="b6"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      {[[-80, 260, -12, 1.0], [-200, 1480, -9, 0.7], [-300, 1720, -15, 0.5]].map(([x, y, r, s], i) => (
        <g key={i} transform={`rotate(${r} 540 960) translate(${x + fr * 1.6 * s} 0)`}>
          <rect x={-400} y={y} width={1300} height={12} rx={6} fill="url(#cl)" filter="url(#b6)" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

export const S6Challenge: React.FC = () => {
  const fr = useCurrentFrame();
  const tq = at(43.37), qIn = at(44.98), q2 = at(K.earth.on);
  const optAt = [at(K.climate.end + 0.05), at(K.affect.end + 0.15), at(K.affect.end + 0.75)];
  const cdA = at(49.1), cdB = at(51.6);
  const cmt = at(51.69);
  const pulse = [at(51.69), at(K.letterB.on), at(K.letterC.on)];
  const endAt = at(53.65), follow = at(K.follow.on - 0.1);
  const trickyBig = p(fr, tq, 14, pop);
  const trickyDock = p(fr, qIn - 6, 14);
  const quizOut = p(fr, endAt, 10, Easing.in(Easing.cubic));
  const cd = interpolate(fr, [cdA, cdB], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endIn = p(fr, endAt + 11, 16);
  const followIn = p(fr, follow, 14, pop);
  return (
    <AbsoluteFill>
      <Backdrop fr={fr} />
      {/* TRICKY QUESTION — big, then docks as a header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(trickyDock, [0, 1], [700, 236]), display: "flex", justifyContent: "center", opacity: trickyBig * (1 - quizOut), transform: `scale(${interpolate(trickyDock, [0, 1], [0.6 + 0.4 * trickyBig, 0.5])})` }}>
        <div style={{ padding: "22px 46px", borderRadius: 999, background: DP.red, fontFamily: DP.display, fontWeight: 900, fontSize: 96, letterSpacing: 1, color: DP.white, boxShadow: "0 18px 50px rgba(239,68,68,0.35)", whiteSpace: "nowrap" }}>TRICKY QUESTION!</div>
      </div>
      {/* question */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 440, opacity: 1 - quizOut, transform: `translateY(${-40 * quizOut}px)` }}>
        <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 70, lineHeight: 1.08, color: DP.white, letterSpacing: -1, textAlign: "center" }}>
          <span style={{ opacity: p(fr, qIn, 12), display: "inline-block", transform: `translateY(${(1 - p(fr, qIn, 12)) * 24}px)` }}>KYA WHITE CONTRAILS</span>{" "}
          <span style={{ opacity: p(fr, q2, 12), display: "inline-block", transform: `translateY(${(1 - p(fr, q2, 12)) * 24}px)` }}>EARTH KE <span style={{ color: DP.blueLight }}>CLIMATE</span> KO AFFECT KAR SAKTI HAIN?</span>
        </div>
      </div>
      {/* options */}
      {OPTIONS.map((o, i) => {
        const a = p(fr, optAt[i], 14);
        const hit = interpolate(fr, [pulse[i], pulse[i] + 5, pulse[i] + 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={o.k} style={{ position: "absolute", left: 80, right: 80, top: 736 + i * 118, height: 100, opacity: a * (1 - quizOut), transform: `translateX(${(1 - a) * 80}px) scale(${1 + hit * 0.04})`, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", borderRadius: 26, background: `rgba(11,26,58,${0.92})`, border: `3px solid ${hit > 0.05 ? DP.blueLight : "rgba(96,165,250,0.35)"}`, boxShadow: `0 12px 34px rgba(2,6,23,0.5), 0 0 ${40 * hit}px rgba(37,99,235,${0.6 * hit})` }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: DP.blue, fontFamily: DP.display, fontWeight: 900, fontSize: 42, color: DP.white }}>{o.k}</div>
            <div style={{ fontFamily: DP.text, fontWeight: 800, fontSize: 38, color: DP.white, letterSpacing: -0.3, lineHeight: 1.1 }}>{o.text}</div>
          </div>
        );
      })}
      {/* think-time progress */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1100, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)", opacity: p(fr, cdA - 6, 8) * (1 - quizOut) * (1 - p(fr, cmt, 8)) }}>
        <div style={{ width: `${(1 - cd) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${DP.blue}, ${DP.blueLight})` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1132, display: "flex", justifyContent: "center", opacity: p(fr, cmt - 2, 10, pop) * (1 - quizOut), transform: `scale(${0.8 + 0.2 * p(fr, cmt - 2, 12, pop)})` }}>
        <div style={{ padding: "16px 34px", borderRadius: 999, background: DP.white, fontFamily: DP.display, fontWeight: 900, fontSize: 48, color: DP.bg, letterSpacing: 0.5 }}>COMMENT  <span style={{ color: DP.blue }}>A, B YA C</span></div>
      </div>
      {/* end card */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: endIn, transform: `translateY(${(1 - endIn) * 50}px)` }}>
        <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 64, color: DP.white, letterSpacing: 1 }}>COMMENT</div>
        <div style={{ display: "flex", gap: 26 }}>
          {["A", "B", "C"].map((k) => (
            <div key={k} style={{ width: 150, height: 150, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(11,26,58,0.95)", border: `4px solid ${DP.blue}`, fontFamily: DP.display, fontWeight: 900, fontSize: 92, color: DP.white }}>{k}</div>
          ))}
        </div>
        <div style={{ height: 70 }} />
        <div style={{ opacity: followIn, transform: `scale(${0.7 + 0.3 * followIn})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ padding: "18px 56px", borderRadius: 999, background: DP.red, fontFamily: DP.display, fontWeight: 900, fontSize: 58, color: DP.white, letterSpacing: 2, boxShadow: "0 16px 44px rgba(239,68,68,0.35)" }}>FOLLOW</div>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 86, color: DP.white, letterSpacing: -1.5, lineHeight: 1 }}>DEFENCE</div>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 86, color: DP.blueLight, letterSpacing: -1.5, lineHeight: 1 }}>PATHSHALA</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
