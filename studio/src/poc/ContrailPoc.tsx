import { AbsoluteFill } from "remotion";
import { HeroFlight } from "../scenes/HeroFlight";
/** Phase B proof of concept: 5 s aircraft + contrail, rendered headless. */
export const ContrailPoc: React.FC = () => (
  <AbsoluteFill style={{ background: "#020617" }}>
    <HeroFlight />
  </AbsoluteFill>
);
