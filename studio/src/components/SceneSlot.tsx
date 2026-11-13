import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";

/** Places a scene on the reel timeline (frames) and fades it in over `fadeIn`
 *  frames on top of the previous scene, so cuts become short dissolves. The
 *  child sees local frame 0 at `from` (the dissolve pre-roll is before it). */
export const SceneSlot: React.FC<{ from: number; to: number; fadeIn?: number; children: React.ReactNode }> = ({ from, to, fadeIn = 0, children }) => (
  <Sequence from={from - fadeIn} durationInFrames={to - from + fadeIn}>
    <Fade fadeIn={fadeIn}>
      <Sequence from={fadeIn} layout="none">{children}</Sequence>
      {fadeIn > 0 && <Sequence durationInFrames={fadeIn} layout="none"><PreRoll>{children}</PreRoll></Sequence>}
    </Fade>
  </Sequence>
);
const Fade: React.FC<{ fadeIn: number; children: React.ReactNode }> = ({ fadeIn, children }) => {
  const f = useCurrentFrame();
  const o = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
/** During the dissolve the incoming scene holds its first frame. */
const PreRoll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Sequence from={0} layout="none">
    <Freeze0>{children}</Freeze0>
  </Sequence>
);
import { Freeze } from "remotion";
const Freeze0: React.FC<{ children: React.ReactNode }> = ({ children }) => <Freeze frame={0}>{children}</Freeze>;
