import { ButtonHTMLAttributes, ReactNode, useState } from "react";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  shape?: "square" | "circle";
  type?: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";
  size?: "2xsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
  disabled?: boolean;
  mode?: "default" | "inverse";
  bordered?: boolean;
}

// The DIVE design system models icon-button treatments through the five
// `button-icon-filled-*` token types, whose names match the Figma variant names
// 1:1. Each `type` therefore maps to the identically-named token (verified
// against Figma node-ids 54252:97654 Tertiary / 54252:97657 Quinary):
//   primary    → primary    (pink)
//   secondary  → secondary  (#242424 dark surface, white icon)
//   tertiary   → tertiary   (#EBEBEB light surface, black icon)
//   quaternary → quaternary (translucent dark surface, white icon)
//   quinary    → quinary    (#363636 dark surface, white icon)
// `mode="inverse"` swaps a variant to its opposite-luminance sibling for use on
// light surfaces (kept as an opt-in convenience; defaults preserve the Figma look).
const TYPE_TOKEN: Record<
  NonNullable<IconButtonProps["type"]>,
  { default: string; inverse: string }
> = {
  primary: { default: "primary", inverse: "primary" },
  secondary: { default: "secondary", inverse: "tertiary" },
  tertiary: { default: "tertiary", inverse: "quinary" },
  quaternary: { default: "quaternary", inverse: "quaternary" },
  quinary: { default: "quinary", inverse: "tertiary" }
};

export default function IconButton({
  children,
  shape = "square",
  type = "primary",
  size = "large",
  disabled = false,
  mode = "default",
  bordered = false,
  className = "",
  ...rest
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const tokenSuffix = TYPE_TOKEN[type][mode === "inverse" ? "inverse" : "default"];
  const isBorderedGhost = bordered && type !== "primary";

  // Background: bordered variants are transparent (outline-only). Otherwise the
  // filled background token resolves per interaction state.
  const getBackground = () => {
    if (isBorderedGhost) return "transparent";
    const base = `--background\\/button-icon-v2\\/button-icon-filled-${tokenSuffix}`;
    if (disabled) return `var(${base}-disabled)`;
    if (active) return `var(${base}-active)`;
    if (hovered) return `var(${base}-hover)`;
    return `var(${base})`;
  };

  const getIconColor = () =>
    disabled
      ? `var(--icon\\/button-icon-v2\\/button-icon-filled-${tokenSuffix}-disabled)`
      : `var(--icon\\/button-icon-v2\\/button-icon-filled-${tokenSuffix})`;

  const getBorderColor = () =>
    disabled
      ? `var(--border\\/button-icon-v2\\/button-icon-filled-${tokenSuffix}-disabled)`
      : `var(--border\\/button-icon-v2\\/button-icon-filled-${tokenSuffix})`;

  // Square radius is size-modulated per Figma: 2px for the small sizes
  // (2XSmall / XSmall / Small), 4px from Medium upward. Circle stays a pill.
  const isSmallSize = size === "2xsmall" || size === "xsmall" || size === "small";
  const getBorderRadius = () =>
    shape === "circle" ? "rounded-[100px]" : isSmallSize ? "rounded-[2px]" : "rounded-[4px]";

  const getSizeClasses = () => {
    switch (size) {
      case "2xsmall":
        return { padding: "p-[4px]", iconSize: "size-[16px]", containerSize: "size-[24px]" };
      case "xsmall":
        return { padding: "p-[6px]", iconSize: "size-[20px]", containerSize: "size-[32px]" };
      case "small":
        return { padding: "p-[6px]", iconSize: "size-[24px]", containerSize: "size-[40px]" };
      case "medium":
        return { padding: "p-[8px]", iconSize: "size-[28px]", containerSize: "size-[48px]" };
      case "large":
        return { padding: "p-[8px]", iconSize: "size-[40px]", containerSize: "size-[64px]" };
      case "xlarge":
        return { padding: "p-[12px]", iconSize: "size-[48px]", containerSize: "size-[80px]" };
      default:
        return { padding: "p-[8px]", iconSize: "size-[40px]", containerSize: "size-[64px]" };
    }
  };

  const sizeClasses = getSizeClasses();
  const borderRadius = getBorderRadius();

  return (
    <button
      className={`${borderRadius} content-stretch flex items-center justify-center overflow-clip ${sizeClasses.padding} relative ${sizeClasses.containerSize} transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      style={{ background: getBackground() }}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative">
          <div className={`relative shrink-0 ${sizeClasses.iconSize}`} style={{ color: getIconColor() }}>
            {children}
          </div>
        </div>
      </div>
      {isBorderedGhost && (
        <div className={`absolute inset-0 ${borderRadius}`}>
          <div
            aria-hidden="true"
            className={`absolute border border-solid inset-0 pointer-events-none ${borderRadius} transition-colors`}
            style={{ borderColor: getBorderColor() }}
          />
        </div>
      )}
    </button>
  );
}
