import { ReactNode, useState } from "react";
import svgPaths from "../../imports/ButtonFilled-3/svg-dgogxr8jjj";

export interface ButtonFilledProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "xsmall" | "small" | "medium" | "large";
  /** Label typeface. Defaults **by variant** to match the DS rule: primary →
   *  "brand" (Canal+ italic 700, always uppercase); secondary/tertiary → "system"
   *  (upright Hind, first-letter uppercase only). Pass explicitly to override. */
  font?: "system" | "brand";
  /** Force les majuscules sur le label système (font="system"). Défaut false →
   *  seule la première lettre est capitalisée (first-letter:uppercase), le reste
   *  tel que saisi. Sans effet sur font="brand" (toujours en majuscules). */
  uppercase?: boolean;
  disabled?: boolean;
  children: ReactNode;
  icon?: boolean;
  /** Optional width override, e.g. "w-full" or "w-[124px]". Defaults to content width. */
  widthClass?: string;
  onClick?: () => void;
}

export default function ButtonFilled({
  variant = "primary",
  size = "medium",
  font,
  uppercase = false,
  disabled = false,
  children,
  icon = false,
  widthClass = "",
  onClick
}: ButtonFilledProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // DS rule: the red primary CTA wears the Canal+ brand type (italic 700, always
  // uppercase); secondary/tertiary wear upright Hind (first-letter uppercase only).
  // Resolve the typeface from the variant unless the caller overrides `font`.
  const resolvedFont = font ?? (variant === "primary" ? "brand" : "system");

  // Background resolves per variant + interaction state. Primary/secondary
  // base/hover/active migrated to flat Color-alias tokens (value-identical:
  // accent = pink/55·40·70, secondary = grey/85·75·90). Tertiary states and
  // every `-disabled` state have no value-identical flat alias (inverse-grey
  // intent / opacity primitives), so they keep the resolved Color-component
  // `button-v2` slash token.
  const getBackground = () => {
    if (disabled)
      return `var(--background\\/button-v2\\/button-filled-${variant}-disabled)`;

    const aliasBg: Record<string, { base: string; hover: string; active: string }> = {
      primary: {
        base: "var(--bg-fill-accent)",
        hover: "var(--bg-fill-accent-hover)",
        active: "var(--bg-fill-accent-active)"
      },
      secondary: {
        base: "var(--bg-fill-secondary)",
        hover: "var(--bg-fill-secondary-hover)",
        active: "var(--bg-fill-secondary-active)"
      }
    };

    if (variant === "tertiary") {
      const base = `--background\\/button-v2\\/button-filled-tertiary`;
      if (active) return `var(${base}-active)`;
      if (hovered) return `var(${base}-hover)`;
      return `var(${base})`;
    }

    const map = aliasBg[variant];
    if (active) return map.active;
    if (hovered) return map.hover;
    return map.base;
  };

  // Text + icon (via currentColor) share the same semantic foreground token.
  const getForeground = () =>
    disabled
      ? `var(--text\\/button-v2\\/button-filled-${variant}-disabled)`
      : `var(--text\\/button-v2\\/button-filled-${variant})`;

  const getSizeClasses = () => {
    switch (size) {
      case "xsmall":
        return "h-[28px] sm:h-[26px] px-[8px]";
      case "small":
        return "h-[30px] sm:h-[34px] px-[10px]";
      case "medium":
        return "h-[38px] sm:h-[44px] px-[10px]";
      case "large":
        // Figma Size=Large: XS 44px (20px content + 12px*2 pad), SM+ 50px.
        return "h-[44px] sm:h-[50px] px-[12px]";
    }
  };

  // Corner radius is size-driven in Figma: Small/Xsmall use radius-small (2px),
  // Medium/Large use radius-medium (4px). The repo previously hardcoded 4px for
  // all sizes (ecart-majeur on Small/Xsmall).
  const getRadiusClass = () => {
    switch (size) {
      case "xsmall":
      case "small":
        return "rounded-[2px]";
      case "medium":
      case "large":
        return "rounded-[4px]";
    }
  };

  // Label typography scales with button size (system) — single class per size,
  // matching the repo convention (plain CSS type classes, not Tailwind utilities,
  // so they can't take a `sm:` variant).
  const getTypeClass = () => {
    switch (size) {
      case "xsmall":
        return "system-label-4-semibold-xs-start"; // 12px
      case "small":
      case "medium":
        return "system-label-3-semibold-xs-start"; // 14px
      case "large":
        return "system-label-2-semibold-xs-start"; // 16px
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "xsmall":
        return "size-[14px]";
      case "small":
        return "size-[16px]";
      case "medium":
        return "size-[18px]";
      case "large":
        return "size-[20px]";
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      className={`content-stretch flex gap-[8px] items-center justify-center overflow-clip relative ${getRadiusClass()} transition-colors ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${getSizeClasses()} ${widthClass}`}
      style={{ background: getBackground(), color: getForeground() }}
      data-name="Button Filled"
    >
      <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
        {icon && (
          <div className="content-stretch flex items-start relative shrink-0">
            <div className={`relative shrink-0 ${getIconSize()}`}>
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <g>
                  <path clipRule="evenodd" d={svgPaths.p2c22800} fill="currentColor" fillRule="evenodd" />
                </g>
              </svg>
            </div>
          </div>
        )}
        <div className="content-stretch flex items-center relative shrink-0">
          {resolvedFont === "brand" ? (
            <>
              {/* Brand label = Canal+ italic 700; brand-label-3 is 16px/20px at XS,
                  18px/22px at SM+. The classes are plain CSS (no Tailwind `sm:`
                  variant), so the breakpoint switch is done via display toggles. */}
              <p className="brand-label-3-xs-start sm:hidden uppercase whitespace-nowrap">{children}</p>
              <p className="brand-label-3-sm-start hidden sm:block uppercase whitespace-nowrap">{children}</p>
            </>
          ) : (
            <p className={`${getTypeClass()} ${uppercase ? "uppercase" : "first-letter:uppercase"} whitespace-nowrap`}>{children}</p>
          )}
        </div>
      </div>
    </button>
  );
}
