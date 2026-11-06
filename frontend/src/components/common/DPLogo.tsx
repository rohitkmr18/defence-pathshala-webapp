/**
 * Defence Pathshala "DP" monogram — official vector mark.
 * Single source of truth for the in-app logo. The same geometry lives in
 * public/logo.svg (used for raster icon generation and external references).
 */
type DPLogoProps = {
  className?: string;
  /** Fill colour. Defaults to the DP brand blue. */
  color?: string;
  /** Accessible name; the mark is decorative when a visible wordmark sits beside it. */
  title?: string;
};

export const DP_BRAND_BLUE = "#285FF2";

export default function DPLogo({
  className = "h-9 w-auto",
  color = DP_BRAND_BLUE,
  title,
}: DPLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="67 70 606 544"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path
        fill={color}
        fillRule="evenodd"
        d="M67 70H401A272 272 0 0 1 401 614H274V498H406.5A160.5 160.5 0 0 0 406.5 177H182V498L67 612Z"
      />
      <path fill={color} d="M274 261H398A76 76 0 0 1 398 413H274Z" />
    </svg>
  );
}
