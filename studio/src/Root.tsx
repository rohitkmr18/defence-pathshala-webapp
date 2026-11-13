import { Composition, Folder } from "remotion";
import "./branding/fonts";
import { ContrailsReel, CONTRAILS_COMPOSITION_ID, CONTRAILS_FORMAT, contrailsSchema } from "./compositions/ContrailsReel";
import { GlTest } from "./poc/GlTest";
import { ContrailPoc } from "./poc/ContrailPoc";
import { SceneTest } from "./poc/SceneTest";

export const Root: React.FC = () => (
  <>
    <Composition id={CONTRAILS_COMPOSITION_ID} component={ContrailsReel} schema={contrailsSchema} {...CONTRAILS_FORMAT} defaultProps={{ audio: "audio/contrails_mix.wav", captions: true }} />
    <Folder name="dev">
      <Composition id="GlTest" component={GlTest} width={540} height={960} fps={30} durationInFrames={30} />
      <Composition id="ContrailPoc" component={ContrailPoc} width={1080} height={1920} fps={30} durationInFrames={150} />
      <Composition id="SceneTest" component={SceneTest} width={1080} height={1920} fps={30} durationInFrames={600} defaultProps={{ scene: "mystery" }} />
    </Folder>
  </>
);
