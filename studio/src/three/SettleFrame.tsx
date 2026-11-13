import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, useCurrentFrame } from "remotion";

/** Place LAST inside a ThreeCanvas. After every child has mounted / updated
 *  for the current frame (incl. EffectComposer passes and async models), it
 *  advances the R3F loop a few times before Remotion captures the frame. */
export const SettleFrame: React.FC<{ ready?: boolean; passes?: number }> = ({ ready = true, passes = 2 }) => {
  const frame = useCurrentFrame();
  const advance = useThree((s) => s.advance);
  const [handle, setHandle] = useState<number | null>(null);
  useEffect(() => {
    const h = delayRender(`settle-${frame}`);
    setHandle(h);
    return () => continueRender(h);
  }, [frame]);
  useEffect(() => {
    if (handle === null || !ready) return;
    let n = 0;
    const tick = () => {
      advance(performance.now());
      if (++n < passes) requestAnimationFrame(tick);
      else { continueRender(handle); setHandle(null); }
    };
    requestAnimationFrame(tick);
  }, [handle, ready, advance, passes]);
  return null;
};
