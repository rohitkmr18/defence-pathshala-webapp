import { AbsoluteFill, Sequence } from "remotion";
import { S1Mystery } from "../scenes/S1Mystery";
import { S2Contradiction } from "../scenes/S2Contradiction";
import { S3Reveal } from "../scenes/S3Reveal";
import { S4Ice } from "../scenes/S4Ice";
import { S5Humidity } from "../scenes/S5Humidity";
import { S6Challenge } from "../scenes/S6Challenge";
import { SCENES, f } from "../projects/contrails/timeline";
import { LogoBug } from "../components/LogoBug";
/** Dev harness to render individual scenes at their reel offsets. */
export const SceneTest: React.FC<{ scene: string }> = ({ scene }) => {
  const map: Record<string, [React.FC, number, number]> = {
    mystery: [S1Mystery, SCENES.mystery.from, SCENES.mystery.to],
    contradiction: [S2Contradiction, SCENES.contradiction.from, SCENES.contradiction.to],
    reveal: [S3Reveal, SCENES.contrailTitle.from, SCENES.engine.to],
    ice: [S4Ice, SCENES.ice.from, SCENES.ice.to],
    humidity: [S5Humidity, SCENES.humidity.from, SCENES.humidity.to],
    challenge: [S6Challenge, SCENES.challenge.from, SCENES.challenge.to],
  };
  const [C, from, to] = map[scene];
  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <Sequence from={0} durationInFrames={f(to - from)}><C /></Sequence>
      <LogoBug />
    </AbsoluteFill>
  );
};
