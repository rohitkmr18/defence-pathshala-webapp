import { AbsoluteFill, Audio, staticFile } from "remotion";
import { z } from "zod";
import "../branding/fonts";
import { DP } from "../branding/brand";
import { LogoBug } from "../components/LogoBug";
import { Captions } from "../components/Captions";
import { SceneSlot } from "../components/SceneSlot";
import { S1Mystery } from "../scenes/S1Mystery";
import { S2Contradiction } from "../scenes/S2Contradiction";
import { S3Title, S3Engine } from "../scenes/S3Reveal";
import { S4Ice } from "../scenes/S4Ice";
import { S5Humidity } from "../scenes/S5Humidity";
import { S6Challenge } from "../scenes/S6Challenge";
import { CAPTIONS, SCENES, DURATION_FRAMES, f } from "../projects/contrails/timeline";

export const CONTRAILS_COMPOSITION_ID = "DPContrails";
export const CONTRAILS_FORMAT = { width: 1080, height: 1920, fps: 30, durationInFrames: DURATION_FRAMES } as const;

export const contrailsSchema = z.object({
  audio: z.string().describe("public/ path of the final mixed soundtrack"),
  captions: z.boolean(),
});
export type ContrailsProps = z.infer<typeof contrailsSchema>;

/** Defence Pathshala — "Why do aeroplanes leave white trails?" (9:16, 30 fps).
 *  Every event is driven by narration timestamps in projects/contrails/timeline.ts. */
export const ContrailsReel: React.FC<ContrailsProps> = ({ audio, captions }) => {
  const S = SCENES;
  return (
    <AbsoluteFill style={{ background: DP.bg }}>
      <SceneSlot from={0} to={f(S.mystery.to)}><S1Mystery /></SceneSlot>
      <SceneSlot from={f(S.contradiction.from)} to={f(S.contradiction.to)} fadeIn={8}><S2Contradiction /></SceneSlot>
      <SceneSlot from={f(S.contrailTitle.from)} to={f(S.contrailTitle.to)} fadeIn={10}><S3Title /></SceneSlot>
      <SceneSlot from={f(S.engine.from)} to={f(S.engine.to)} fadeIn={8}><S3Engine /></SceneSlot>
      <SceneSlot from={f(S.ice.from)} to={f(S.ice.to)} fadeIn={10}><S4Ice /></SceneSlot>
      <SceneSlot from={f(S.humidity.from)} to={f(S.humidity.to)} fadeIn={6}><S5Humidity /></SceneSlot>
      <SceneSlot from={f(S.challenge.from)} to={DURATION_FRAMES} fadeIn={8}><S6Challenge /></SceneSlot>
      {captions && <Captions captions={CAPTIONS} />}
      <LogoBug />
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
