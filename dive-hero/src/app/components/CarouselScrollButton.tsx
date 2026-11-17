import { ButtonHTMLAttributes } from "react";
import IconButton from "./IconButton";
import svgPaths from "../../imports/svg-fqb1oqglyr";

export interface CarouselScrollButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  direction?: "left" | "right";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

// Carousel "rail" navigation control: a square grey icon button that scrolls a row
// of cards left/right. It IS a quaternary square `IconButton`, so the radius
// (rounded-[4px]), square sizing, dark-translucent fill and hover/active/disabled
// states all come from the canonical component. We add only the directional chevron:
// the glyph `pad2ea80` points down, so we rotate it -90deg for "right" and +90deg
// for "left".
export default function CarouselScrollButton({
  direction = "right",
  size = "medium",
  disabled = false,
  className = "",
  ...rest
}: CarouselScrollButtonProps) {
  const rotation = direction === "right" ? "-rotate-90" : "rotate-90";

  return (
    <IconButton
      type="quaternary"
      shape="square"
      size={size}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <div className={`size-full ${rotation}`}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path clipRule="evenodd" d={svgPaths.pad2ea80} fill="currentColor" fillRule="evenodd" />
        </svg>
      </div>
    </IconButton>
  );
}
