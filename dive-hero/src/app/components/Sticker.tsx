// DS play triangle — reused from ListListRowReplayNext (svg-0ndtbpn7kj `p3ccea200`),
// rendered in a 10x10 viewBox. No foreign art / emoji.
const playTrianglePath =
  "M1.5 2.25C1.5 1.63419 2.17163 1.25604 2.6914 1.58397L8.4414 5.08397C8.93967 5.39839 8.93967 6.10161 8.4414 6.41603L2.6914 9.91603C2.17163 10.244 1.5 9.86581 1.5 9.25V2.25Z";

export interface StickerProps {
  label?: string;
  variant?: "primary" | "secondary" | "accent" | "emphasis";
  labelStyle?: "regular" | "semibold";
  /** Render the leading play icon (Figma Icon=True). Defaults to false for backward compatibility. */
  icon?: boolean;
}

// Semantic Color-alias tokens (flat — no slash, no escaping). Migrated from the
// --sticker/* Color-component layer, which mapped 1:1 to these aliases by definition.
const variantTokens = {
  primary: {
    background: "var(--bg-fill-secondary-transparent-on-surface-70)",
    color: "var(--text-title-on-accent)",
    icon: "var(--icon-on-accent)",
  },
  secondary: {
    background: "var(--bg-fill-on-active-inverse)",
    color: "var(--text-title-on-accent-inverse)",
    icon: "var(--icon-on-accent-inverse)",
  },
  accent: {
    background: "var(--bg-fill-accent)",
    color: "var(--text-on-accent)",
    icon: "var(--icon-on-accent)",
  },
  emphasis: {
    background: "var(--bg-fill-emphasis)",
    color: "var(--text-on-emphasis)",
    icon: "var(--icon-on-emphasis)",
  },
} as const;

export default function Sticker({
  label = "Label",
  variant = "primary",
  labelStyle = "regular",
  icon = false,
}: StickerProps) {
  const tokens = variantTokens[variant];

  // Figma: text-only sticker uses symmetric px-[4px]; the icon variant trims the
  // left padding to pl-[2px] so the leading play triangle (its 14px box carries
  // internal whitespace) stays optically centered.
  const paddingX = icon ? "pl-[2px] pr-[4px]" : "px-[4px]";

  return (
    <div
      className={`inline-flex items-center justify-center gap-[2px] ${paddingX} py-[2px] rounded-[2px]`}
      style={{ background: tokens.background, color: tokens.color }}
      data-name="Sticker"
    >
      {icon && (
        <span
          className="inline-flex items-center justify-center shrink-0 size-[14px]"
          style={{ color: tokens.icon }}
          data-name="Play"
        >
          <svg
            className="block"
            width="10"
            height="10"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            <path d={playTrianglePath} fill="currentColor" />
          </svg>
        </span>
      )}
      <p className={`system-label-5-${labelStyle}-sm-start text-center whitespace-nowrap`}>{label}</p>
    </div>
  );
}
