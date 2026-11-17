import { useState } from "react";
import imgImagePlaceholder from "../../imports/MediaBlock-1/71d0d6e743c72eb2b5f76d0f88179af23547c1fc.png";
import imgChannelsCentered from "../../imports/ChannelsCentered.svg";
import Sticker from "./Sticker";

// SVG paths for icons
const svgPaths = {
  // Close icon (X) — filled shape, exported from Figma (viewBox 0 0 10.6752 10.6667)
  p32ea2780:
    "M0.176809 10.4917C0.257566 10.568 0.34954 10.6196 0.452729 10.6465C0.555919 10.6734 0.659108 10.6734 0.762298 10.6465C0.865488 10.6196 0.955218 10.568 1.03149 10.4917L5.33853 6.18465L9.64558 10.4917C9.72185 10.568 9.81158 10.6196 9.91477 10.6465C10.018 10.6734 10.1211 10.6734 10.2243 10.6465C10.332 10.624 10.424 10.5725 10.5003 10.4917C10.5765 10.4154 10.6259 10.3257 10.6483 10.2225C10.6752 10.1193 10.6752 10.0161 10.6483 9.91293C10.6259 9.80974 10.5765 9.72001 10.5003 9.64374L6.19321 5.32997L10.5003 1.02292C10.5765 0.946653 10.6281 0.856923 10.655 0.753733C10.682 0.650543 10.682 0.547354 10.655 0.444164C10.6281 0.340974 10.5765 0.251244 10.5003 0.174974C10.4195 0.0942166 10.3275 0.0426218 10.2243 0.0201893C10.1211 -0.00672976 10.018 -0.00672976 9.91477 0.0201893C9.81158 0.0426218 9.72185 0.0942166 9.64558 0.174974L5.33853 4.48202L1.03149 0.174974C0.955218 0.0942166 0.863244 0.0426218 0.755568 0.0201893C0.652379 -0.00672976 0.549189 -0.00672976 0.445999 0.0201893C0.34281 0.0426218 0.25308 0.0942166 0.176809 0.174974C0.100539 0.251244 0.0489437 0.340974 0.0220247 0.444164C-0.000407864 0.547354 -0.000407864 0.650543 0.0220247 0.753733C0.0489437 0.856923 0.100539 0.946653 0.176809 1.02292L4.48385 5.32997L0.176809 9.64374C0.100539 9.72001 0.0489437 9.80974 0.0220247 9.91293C-0.00489437 10.0161 -0.00713762 10.1193 0.0152949 10.2225C0.0422139 10.3257 0.096052 10.4154 0.176809 10.4917Z",
  // Complete checkmark icon
  p27d9900: "M13.5 3L5 11.5L1.5 8",
  // Play icon (triangle)
  p2e179cc0: "M10 5L10 27L26 16L10 5Z"
};

export interface MediaBlockProps {
  aspectRatio?: "1:1" | "3:4" | "4:3" | "16:9" | "2:3" | "4:7" | "16:6";
  /**
   * Surface mode. `default` renders the dark variant (white text);
   * `inverse` renders on a light surface (black text), per the Figma light frames.
   */
  mode?: "default" | "inverse";
  title?: string;
  /** Title overlaid on the image, next to the logo. */
  overlayTitle?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  showLiveBadge?: boolean;
  /** Text shown in the top-right emphasis badge when `showLiveBadge`. Defaults to "LIVE". */
  liveBadgeLabel?: string;
  showCloseButton?: boolean;
  showLogo?: boolean;
  /**
   * Provider/channel/studio logo shown bottom-left of the poster, signalling
   * where the content comes from. An image `src` (URL, data URI, or an imported
   * SVG) — defaults to the Canal+ mark. Pass an official logo from the
   * `channel-logos` set (see `guideline_channel-logos` / the `channel_logos`
   * MCP tool), e.g. `channelLogo={channelLogos["netflix"].default}`. Only shown
   * when `showLogo` is on.
   */
  channelLogo?: string;
  showProgress?: boolean;
  progressPercent?: number;
  /** When set, the progress bar runs as an auto-rotate timer: it fills 0→100%
   *  over this many ms (white --bg-surface-inverse) and fires onTimerEnd on
   *  completion. Overrides progressPercent.
   *  Limitation: the bar is a CSS animation on a sub-component re-created on
   *  every render, so any parent re-render restarts it. Prefer `timerProgress`
   *  when the host already tracks elapsed time (HeroBillboardCarousel does). */
  timerMs?: number;
  /** Freeze the timer animation (e.g. when the carousel is paused). */
  timerPaused?: boolean;
  onTimerEnd?: () => void;
  /** Externally driven timer fill, 0–1 (white --bg-surface-inverse, no CSS
   *  animation). Takes precedence over `timerMs` and `progressPercent`. Used by
   *  HeroBillboardCarousel, whose auto-advance sequence (cover → trailer →
   *  cover) has no fixed duration. */
  timerProgress?: number;
  /** Figma "Select" state of the Carousel v2 row: a 4px outside ring
   *  (--bg-surface-transparent-20) marking the highlighted tile. Distinct from
   *  keyboard focus, which the host draws on its own button. */
  selected?: boolean;
  showCompleteIcon?: boolean;
  /** Center play button. On by default. */
  showPlayButton?: boolean;
  /** Title overlaid next to the logo. On by default. */
  showOverlayTitle?: boolean;
  /** Title/subtitle/description block below the image. On by default. */
  showOutsideElements?: boolean;
  /** Bottom progress-bar shadow gradient. On by default. */
  showProgressShadow?: boolean;
  onPlayClick?: () => void;
  onCloseClick?: () => void;
}

export default function MediaBlock({
  aspectRatio = "1:1",
  mode = "default",
  title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  overlayTitle = "Title",
  subtitle = "Lorem ipsum dolor sit amet",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor eli.",
  imageUrl,
  showLiveBadge = true,
  liveBadgeLabel = "LIVE",
  showCloseButton = true,
  showLogo = true,
  channelLogo = imgChannelsCentered,
  showProgress = true,
  progressPercent = 41,
  timerMs,
  timerPaused = false,
  onTimerEnd,
  timerProgress,
  selected = false,
  showCompleteIcon = true,
  showPlayButton = true,
  showOverlayTitle = true,
  showOutsideElements = true,
  showProgressShadow = true,
  onPlayClick,
  onCloseClick
}: MediaBlockProps) {
  const inverse = mode === "inverse";
  const [closeHovered, setCloseHovered] = useState(false);
  const [playHovered, setPlayHovered] = useState(false);

  // Semantic color tokens (slashes escaped as \\/). Below-image text supports
  // inverse mode (black on light); the overlay title sits on the image and also
  // flips per Figma light frames.
  const titleColor = inverse
    ? "var(--text-title-inverse)"
    : "var(--text-title)";
  const subtitleColor = inverse
    ? "var(--text-subtitle-inverse)"
    : "var(--text-subtitle)";
  const bodyColor = inverse
    ? "var(--text-body-80-inverse)"
    : "var(--text-body-80)";
  // Icon buttons (close / play) use the quaternary icon-button fill token; hover
  // tracked via state because Tailwind hover: can't hold slash tokens.
  const closeBtnBg = closeHovered
    ? "var(--background\\/button-icon-v2\\/button-icon-filled-quaternary-hover)"
    : "var(--background\\/button-icon-v2\\/button-icon-filled-quaternary)";
  const playBtnBg = playHovered
    ? "var(--background\\/button-icon-v2\\/button-icon-filled-quaternary-hover)"
    : "var(--background\\/button-icon-v2\\/button-icon-filled-quaternary)";

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "1:1":
        return "aspect-[1/1]";
      case "3:4":
        return "aspect-[3/4]";
      case "4:3":
        return "aspect-[4/3]";
      case "16:9":
        return "aspect-[16/9]";
      case "2:3":
        return "aspect-[2/3]";
      case "4:7":
        return "aspect-[4/7]";
      case "16:6":
        return "aspect-[16/6]";
      default:
        return "aspect-[1/1]";
    }
  };

  const CloseButtonContent = () => (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative" data-name="content">
      <div className="relative shrink-0 size-[16px]" data-name="icon">
        <div className="absolute inset-[16.67%_16.64%]" style={{ color: "var(--icon\\/icon)" }} data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 10.6752 10.6667">
            <path d={svgPaths.p32ea2780} />
          </svg>
        </div>
      </div>
    </div>
  );

  const Icon = () => (
    <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0" data-name="icon">
      {showLiveBadge && (
        <Sticker variant="emphasis" label={liveBadgeLabel} labelStyle="semibold" />
      )}
      {showCloseButton && (
        <button
          onClick={onCloseClick}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          className="content-stretch flex items-center justify-center overflow-clip p-[4px] relative rounded-[100px] shrink-0 size-[24px] border-none cursor-pointer transition-colors"
          style={{ background: closeBtnBg }}
          data-name="close button"
        >
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <CloseButtonContent />
          </div>
        </button>
      )}
    </div>
  );

  const TopElements = () => (
    <div className="absolute content-stretch flex flex-col items-end left-0 overflow-clip p-[4px] right-0 top-0 z-[3]" data-name="Top elements">
      <Icon />
    </div>
  );

  const BgShadowLogo = () => (
    <div className="absolute bottom-0 h-[90px] left-0 w-[160px]" data-name="Bg Shadow logo">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(closest-side at 0% 100%, var(--gradient\\/media-logo-gradient\\/gradient-start) 0%, var(--gradient\\/media-logo-gradient\\/gradient-end) 100%)"
        }}
        data-name="Shadow logo"
      />
    </div>
  );

  const Shadow = () => (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="shadow">
      <div
        className="col-1 h-[60px] ml-0 mt-0 relative row-1 w-full"
        style={{
          backgroundImage:
            "linear-gradient(to top, var(--gradient\\/media-logo-gradient\\/gradient-start) 0%, var(--gradient\\/media-logo-gradient\\/gradient-end) 100%)"
        }}
        data-name="Shadow progress bar"
      />
    </div>
  );

  const BgShadowProgressBar = () => (
    <div className="content-stretch flex items-end relative w-full" data-name="Bg Shadow Progress bar">
      <Shadow />
    </div>
  );

  const Logo = () => (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="logo">
      <div className="col-1 h-[36px] ml-0 mt-0 relative row-1 w-[48px]" data-name="Channels Centered">
        <img alt="" className="absolute block inset-0 max-w-none size-full object-contain" src={channelLogo} />
      </div>
    </div>
  );

  const Title1 = () => (
    <div className="col-1 h-[36px] ml-0 mt-0 relative row-1 w-full" data-name="Title">
      <div
        className="[word-break:break-word] absolute bottom-1/4 flex flex-col system-body-2-regular-xs-start justify-center left-0 overflow-hidden right-[5.26%] text-ellipsis top-1/4 whitespace-nowrap"
        style={{ color: titleColor }}
      >
        <p className="leading-[18px] overflow-hidden text-ellipsis">{overlayTitle}</p>
      </div>
    </div>
  );

  const TitleComponent = () => (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid min-w-px place-items-start relative" data-name="title">
      <Title1 />
    </div>
  );

  const LogoTitle = () => (
    <div className="content-stretch flex gap-[4px] h-[36px] items-end leading-[0] relative shrink-0 w-full" data-name="logo + title">
      {showLogo && <Logo />}
      {showOverlayTitle && <TitleComponent />}
    </div>
  );

  const Filled = () =>
    timerProgress != null ? (
      <div
        className="-translate-y-1/2 absolute h-[4px] left-0 rounded-[100px] top-1/2"
        data-name="Timer"
        style={{
          right: `${(1 - Math.min(1, Math.max(0, timerProgress))) * 100}%`,
          background: "var(--bg-surface-inverse)",
        }}
      />
    ) : timerMs != null ? (
      <div
        className="-translate-y-1/2 absolute h-[4px] left-0 rounded-[100px] top-1/2"
        data-name="Timer"
        onAnimationEnd={onTimerEnd}
        style={{
          right: "100%",
          background: "var(--bg-surface-inverse)",
          animation: `diveMediaTimer ${timerMs}ms linear forwards`,
          animationPlayState: timerPaused ? "paused" : "running",
        }}
      />
    ) : (
      <div
        className="-translate-y-1/2 absolute h-[4px] left-0 rounded-[100px] top-1/2 transition-all"
        data-name="Filled"
        style={{ right: `${100 - progressPercent}%`, background: "var(--bg-fill-emphasis)" }}
      />
    );

  const Track = () => (
    <div
      className="h-[4px] relative rounded-[100px] shrink-0 w-full"
      style={{ background: "var(--bg-surface-transparent-10)" }}
      data-name="Track"
    >
      <Filled />
    </div>
  );

  const ProgressBarContent = () => (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="content">
      <Track />
    </div>
  );

  const InsideElements = () => (
    <div className="content-stretch flex flex-col gap-[2px] items-start justify-end relative shrink-0 w-full" data-name="Inside Elements">
      <LogoTitle />
      {showProgress && (
        <div className="content-stretch flex flex-col items-start relative rounded-[2px] shrink-0 w-full" data-name="progress bar linear">
          <ProgressBarContent />
        </div>
      )}
    </div>
  );

  const IconBottom = () => (
    <div className="absolute bottom-[4.29px] content-stretch flex items-center justify-end right-[4px]" data-name="icon bottom">
      <div className="relative shrink-0 size-[16px]" data-name="Completed">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16" style={{ color: "var(--icon\\/icon-accent)" }}>
          <g>
            <circle cx="8" cy="8" fill="currentColor" r="8" style={{ color: "var(--bg-surface-inverse)" }} />
            <path d={svgPaths.p27d9900} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );

  const BottomElements = () => (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[90px] items-center justify-end left-0 overflow-clip p-[4px] right-0 z-[2]" data-name="Bottom elements">
      <BgShadowLogo />
      {showProgressShadow && (
        <div className="absolute bottom-0 flex items-center justify-center left-0 right-0" style={{ containerType: "size" }}>
          <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <BgShadowProgressBar />
          </div>
        </div>
      )}
      <InsideElements />
      {showCompleteIcon && <IconBottom />}
    </div>
  );

  const ImageLoadBackground = () => (
    <div className="absolute inset-0" style={{ background: "var(--bg-fill-secondary)" }} data-name="Image load background" />
  );

  const ImagePlaceholder = () => (
    <div className="absolute inset-0" data-name="Image Placeholder">
      <img
        alt=""
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        src={imageUrl || imgImagePlaceholder}
      />
    </div>
  );

  const PlayButtonContent = () => (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-name="content">
      <div className="flex-[1_0_0] h-full min-w-px relative" style={{ color: "var(--icon\\/icon)" }} data-name="Type=Player legacy, Mode=Default">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g>
            <path clipRule="evenodd" d={svgPaths.p2e179cc0} fill="currentColor" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );

  const CenterElements = () => (
    <div className="absolute content-stretch flex flex-col inset-0 items-center justify-center overflow-clip z-[1]" data-name="Center elements">
      <div className={`-translate-x-1/2 absolute ${getAspectRatioClass()} bottom-0 content-stretch flex flex-col items-center justify-center left-1/2 overflow-clip top-0`} data-name="Media">
        <ImageLoadBackground />
        <ImagePlaceholder />
      </div>
      {showPlayButton && (
        <button
          onClick={onPlayClick}
          onMouseEnter={() => setPlayHovered(true)}
          onMouseLeave={() => setPlayHovered(false)}
          className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-center justify-center left-1/2 overflow-clip p-[8px] rounded-[100px] top-[calc(50%-0.15px)] border-none cursor-pointer transition-colors"
          style={{ background: playBtnBg }}
          data-name="Button Icon Filled"
        >
          <PlayButtonContent />
        </button>
      )}
    </div>
  );

  const Content = () => (
    <div
      className={`${getAspectRatioClass()} content-stretch flex flex-col isolate items-start overflow-clip relative rounded-[2px] shrink-0 w-full`}
      style={selected ? { boxShadow: "0 0 0 4px var(--bg-surface-transparent-20)" } : undefined}
      data-name="content"
      data-selected={selected || undefined}
    >
      <TopElements />
      <BottomElements />
      <CenterElements />
    </div>
  );

  const TitleSubtitle = () => (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Title/Subtitle">
      <p className="system-title-5-regular-xs-start overflow-hidden relative shrink-0 text-ellipsis w-full" style={{ color: titleColor }}>{title}</p>
      <p className="system-title-6-regular-xs-start overflow-hidden relative shrink-0 text-ellipsis w-full whitespace-nowrap" style={{ color: subtitleColor }}>{subtitle}</p>
    </div>
  );

  const OutsideElements = () => (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Outside Elements">
      <TitleSubtitle />
      <p className="system-body-3-regular-xs-start overflow-hidden relative shrink-0 text-ellipsis w-full" style={{ color: bodyColor }}>{description}</p>
    </div>
  );

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="Media - Block">
      <Content />
      {showOutsideElements && <OutsideElements />}
    </div>
  );
}
