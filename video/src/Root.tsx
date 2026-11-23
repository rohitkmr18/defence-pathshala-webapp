import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

export const Root = () => (
  <Composition
    id="KashmirReel"
    component={Reel}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
