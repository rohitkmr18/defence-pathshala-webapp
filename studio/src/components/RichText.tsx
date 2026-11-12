import { DP } from "../branding/brand";
/** Minimal markup: *term* → blue, !word! → red. */
export const RichText: React.FC<{ text: string; blue?: string; red?: string }> = ({ text, blue = DP.blueLight, red = DP.red }) => {
  const parts = text.split(/(\*[^*]+\*|![^!]+!)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") ? <span key={i} style={{ color: blue }}>{p.slice(1, -1)}</span>
        : p.startsWith("!") && p.length > 2 ? <span key={i} style={{ color: red }}>{p.slice(1, -1)}</span>
        : <span key={i}>{p}</span>,
      )}
    </>
  );
};
