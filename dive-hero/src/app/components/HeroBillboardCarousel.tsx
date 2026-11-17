import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from "react";
import MediaBlock from "./MediaBlock";
import IconButton from "./IconButton";
import CarouselScrollButton from "./CarouselScrollButton";
import Sticker from "./Sticker";
import ButtonFilled from "./ButtonFilled";

/* =============================================================================
 * HeroBillboardCarousel — Canal+ "Promotion Carousel v2"
 * Figma: Promotion-Carousel (6ZDj8fDjC4yTmlusUogC1S) — pages "Carousel v2
 * Delivery", "06.2026 - Left Panel resize", "Highlight Delivery".
 *
 * Anatomy (all screens): A media background (STD169 cover or muted trailer),
 * B left panel (logotitle / text title, catchline, optional CTA), C right panel
 * (sound + pause controls, label 5:1 + channel logo 4:3), D carousel row of 16:9
 * MediaBlock tiles whose highlighted tile carries the auto-advance timer bar,
 * F slide arrows on the cover + row arrows in the gutters, G page dots on XS.
 *
 * Behaviour: on the highlighted item the cover shows 1 s, the trailer plays if
 * available, the cover shows 1 s again, then the next item is highlighted; with
 * no trailer the cover shows 10 s. The timer bar advances on real elapsed time.
 * The last item is played then the carousel stays idle (no wrap-around).
 * Highlight (the product's frame) and focus (the user's) are distinct signals.
 * ========================================================================== */

export interface HeroSlide {
  /** Programme title (text title in "basic" mode, and the a11y name). */
  title: string;
  /** 16:9 thumbnail (STD169LT) for the carousel row tile. */
  tileImage: string;
  /** Channel / provider logo (4:3) — on the tile and in the right panel. */
  channelLogo: string;
  /** Resume progress (0–100), kept for API compatibility. */
  progressPercent?: number;
  /** 16:9 cover (STD169) for the media background. Defaults to `tileImage`. */
  backgroundImage?: string;
  /** Muted trailer (mp4 / natively playable). Absent → 10 s cover sequence. */
  trailerUrl?: string;
  /** Logotitle asset (16:9 box). "Premium" mode; without it the title renders in the brand type. */
  logoImage?: string;
  /** Catchline, 1–2 lines of ≤ 24 characters; `\n` inside a line forces a break. */
  catchline?: string[];
  /** Editorial label shown beside the channel logo — text fallback of `labelImage`. */
  label?: string;
  /** Editorial label asset (Label51, 5:1), same height as the channel logo. */
  labelImage?: string;
  /** Optional CTA (B4) — tablet/desktop only, never on mobile. */
  ctaLabel?: string;
  /** Navigation target, passed back through `onSelect`. */
  href?: string;
  /** Live programme: LIVE sticker on the tile and on the mobile card. */
  live?: boolean;
}

export interface HeroBillboardCarouselProps {
  slides: HeroSlide[];
  /** Cover-only sequence duration in ms (no trailer). Default 10 000. */
  coverMs?: number;
  /** Cover hold before and after a trailer, in ms. Default 1 000. */
  holdMs?: number;
  /** @deprecated Use `coverMs`. */
  intervalMs?: number;
  /** Start advancing on mount (default true). Forced off under `prefers-reduced-motion`. */
  autoPlay?: boolean;
  /** Initially highlighted item. Default 0. */
  initialIndex?: number;
  /** Navigation intent: click on the highlighted tile, the media, the left panel or the CTA. */
  onSelect?: (slide: HeroSlide, index: number) => void;
  /** Fired whenever the highlighted item changes (auto-advance or user). */
  onHighlightChange?: (index: number) => void;
}

/* ---- Breakpoint tiers (guidelines/styles.md §5, web) — measured in Figma ----
 * Sizing is driven by the component's own width (container-aware), so it
 * behaves in the gallery as on a full-width page. */
type Tier = "xs" | "sm" | "md" | "lg" | "xlg" | "xxlg";

interface TierConfig {
  /** Page gutter (row padding, panel inset). */
  gutter: number;
  /** Tiles fully visible in the row. */
  n: number;
  /** Row bottom margin. */
  rowBottom: number;
  /** Left panel container width / logotitle width / catchline width. */
  leftW: number;
  logoW: number;
  catchW: number;
  /** Panel offsets from the carousel bottom. */
  leftBottom: number;
  rightBottom: number;
  /** Height of the channel logo (4:3) and label (5:1) in the right panel. */
  logoH: number;
  /** Type classes: catchline, short text title, long text title. */
  catchClass: string;
  shortTitleClass: string;
  longTitleClass: string;
  labelClass: string;
}

const TIERS: Record<Tier, TierConfig> = {
  xs: {
    gutter: 16, n: 1, rowBottom: 0, leftW: 256, logoW: 160, catchW: 256, leftBottom: 12, rightBottom: 4, logoH: 36,
    catchClass: "brand-title-6-xs-start", shortTitleClass: "brand-title-2-xs-start", longTitleClass: "brand-title-4-xs-start",
    labelClass: "brand-label-5-xs-start",
  },
  sm: {
    gutter: 32, n: 4, rowBottom: 40, leftW: 320, logoW: 280, catchW: 320, leftBottom: 165, rightBottom: 145, logoH: 48,
    catchClass: "brand-title-3-sm-start", shortTitleClass: "brand-title-1-sm-start", longTitleClass: "brand-title-1-sm-start",
    labelClass: "brand-label-5-sm-start",
  },
  md: {
    gutter: 32, n: 5, rowBottom: 32, leftW: 320, logoW: 280, catchW: 320, leftBottom: 165, rightBottom: 147, logoH: 48,
    catchClass: "brand-title-3-sm-start", shortTitleClass: "brand-title-1-sm-start", longTitleClass: "brand-title-1-sm-start",
    labelClass: "brand-label-5-sm-start",
  },
  lg: {
    gutter: 64, n: 6, rowBottom: 40, leftW: 480, logoW: 352, catchW: 480, leftBottom: 204, rightBottom: 192, logoH: 72,
    catchClass: "brand-title-3-sm-start", shortTitleClass: "brand-display-5-sm-start", longTitleClass: "brand-title-1-sm-start",
    labelClass: "brand-label-5-sm-start",
  },
  xlg: {
    gutter: 64, n: 6, rowBottom: 40, leftW: 520, logoW: 380, catchW: 480, leftBottom: 227, rightBottom: 215, logoH: 72,
    catchClass: "brand-title-2-sm-start", shortTitleClass: "brand-display-4-sm-start", longTitleClass: "brand-title-1-sm-start",
    labelClass: "brand-label-5-sm-start",
  },
  xxlg: {
    gutter: 64, n: 7, rowBottom: 40, leftW: 580, logoW: 420, catchW: 480, leftBottom: 240, rightBottom: 230, logoH: 72,
    catchClass: "brand-title-1-sm-start", shortTitleClass: "brand-display-3-sm-start", longTitleClass: "brand-display-5-sm-start",
    labelClass: "brand-label-5-sm-start",
  },
};

const TILE_GAP = 16;
/** A text title is "short" (display size) up to this length; longer titles use the title size. */
const SHORT_TITLE_MAX = 18;
/** Trailer metadata must arrive within this delay after the cover hold, else the cover sequence takes over. */
const TRAILER_TIMEOUT_MS = 3000;
/** Cover crossfade / panel fade duration (Figma "Motion & transitions": 200 ms, linear). */
const FADE_MS = 200;

function tierForWidth(width: number): Tier {
  if (width >= 1920) return "xxlg";
  if (width >= 1600) return "xlg";
  if (width >= 1285) return "lg";
  if (width >= 960) return "md";
  if (width >= 700) return "sm";
  return "xs";
}

/* ---- Control glyphs (DIVE icon library `player-*`, viewBox 0 0 24 24) ------
 * Painted with `fill="currentColor"`: IconButton sets the icon colour token. */
function PlayerSoundOff() {
  return (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M15 2V11.638L10.0028 6.61277L15 2ZM15 16.4856L18.2256 19.7293L19.6358 18.3111L4.41025 3.00005L3 4.41821L6.56179 8L5.05217 8C5.02336 8 5 8.02336 5 8.05217V15.9478C5 15.9766 5.02336 16 5.05217 16L8.5 16L15 22V16.4856Z" fill="currentColor" />
    </svg>
  );
}
function PlayerSoundOn() {
  return (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.05 8C1.05 8 1 8.02 1 8.05V15.95C1 15.95 1.02 16 1.05 16H4.5L11 22V2L4.5 8H1.05Z" fill="currentColor" />
      <path d="M19.38 3.77C19.17 3.58 18.96 3.39 18.74 3.22C18.72 3.2 18.7 3.19 18.68 3.17L17.82 4.4C17.82 4.4 17.84 4.41 17.84 4.42C18.33 4.81 18.78 5.26 19.18 5.76C20.35 7.2 21.12 9.03 21.27 11.05C21.29 11.3 21.3 11.55 21.3 11.81C21.3 15.27 19.52 18.24 16.92 19.84L17.6 21.01C18.38 20.56 19.09 20.03 19.73 19.42C19.98 19.18 20.22 18.93 20.44 18.68C21.91 16.81 22.8 14.42 22.8 11.81C22.8 8.62 21.48 5.75 19.37 3.78L19.38 3.77Z" fill="currentColor" />
      <path d="M19.02 11.21C18.85 9.22 17.89 7.49 16.48 6.3C16.48 6.3 16.46 6.28 16.45 6.28L15.55 7.48C15.55 7.48 15.59 7.52 15.61 7.53C16.67 8.48 17.39 9.81 17.52 11.34C17.71 13.48 16.7 15.45 15.05 16.6C15.02 16.62 15 16.64 14.97 16.65L15.72 17.95C15.72 17.95 15.77 17.92 15.8 17.9C17.94 16.47 19.25 13.95 19.01 11.21H19.02Z" fill="currentColor" />
      <path d="M15.23 11.68C15.16 10.86 14.74 10.15 14.12 9.67C14.1 9.66 14.09 9.65 14.07 9.64L12.46 11.98L12.48 12.01L13.09 13.21L13.74 14.48C13.74 14.48 13.78 14.46 13.8 14.44C14.74 13.85 15.32 12.82 15.23 11.69V11.68Z" fill="currentColor" />
    </svg>
  );
}
function PlayerPause() {
  return (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.7 2C3.58954 2 3.5 2.08954 3.5 2.2V21.8C3.5 21.9105 3.58954 22 3.7 22H9.88065C9.9911 22 10.0806 21.9105 10.0806 21.8V2.2C10.0806 2.08954 9.9911 2 9.88065 2H3.7ZM14.1193 2C14.0088 2 13.9193 2.08954 13.9193 2.2V21.8C13.9193 21.9105 14.0088 22 14.1193 22H20.2999C20.4104 22 20.4999 21.9105 20.4999 21.8V2.2C20.4999 2.08954 20.4104 2 20.2999 2H14.1193Z" fill="currentColor" />
    </svg>
  );
}
function PlayerPlay() {
  return (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.29713 2.16507C5.16382 2.09101 5 2.18741 5 2.3399V21.6601C5 21.8126 5.16382 21.909 5.29713 21.8349L22.6853 12.1748C22.8225 12.0986 22.8225 11.9014 22.6853 11.8252L5.29713 2.16507Z" fill="currentColor" />
    </svg>
  );
}

/* ---- Hooks ------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/** Live `prefers-reduced-motion` flag (SSR-safe). */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Breakpoint tier of the component's own box (ResizeObserver). Defaults to `lg` before mount. */
function useContainerTier(ref: RefObject<HTMLElement | null>): Tier {
  const [tier, setTier] = useState<Tier>("lg");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => setTier(tierForWidth(el.clientWidth));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return tier;
}

type Phase = "coverIn" | "video" | "coverOut" | "cover" | "done";
type ChangeReason = "init" | "auto" | "arrow" | "click" | "swipe";

interface AutoAdvanceOptions {
  active: number;
  count: number;
  trailerUrl?: string;
  /** Trailers play on SM+ only and never under reduced motion. */
  videoAllowed: boolean;
  paused: boolean;
  coverMs: number;
  holdMs: number;
  onAdvance: () => void;
}

/**
 * The auto-advance sequence of the highlighted item, on real elapsed time:
 * cover `holdMs` → trailer (`video` phase, driven by `currentTime`) → cover
 * `holdMs` → next item; or cover `coverMs` → next item without a trailer.
 * Pause freezes both the clock and the video. The last item ends in `done`.
 */
function useAutoAdvance({ active, count, trailerUrl, videoAllowed, paused, coverMs, holdMs, onAdvance }: AutoAdvanceOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const hasTrailer = !!trailerUrl && videoAllowed && !failed.has(active);
  const rotates = count > 1;

  const [phase, setPhaseState] = useState<Phase>(hasTrailer ? "coverIn" : "cover");
  const phaseRef = useRef<Phase>(phase);
  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);
  const durationRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const lastCommitRef = useRef(0);

  // Trailer unavailable (error, no metadata, playback refused): cover sequence.
  const fail = useCallback(() => {
    setFailed((prev) => {
      if (prev.has(active)) return prev;
      const next = new Set(prev);
      next.add(active);
      return next;
    });
  }, [active]);

  // New highlighted item (or trailer availability changed): restart from zero.
  useEffect(() => {
    elapsedRef.current = 0;
    durationRef.current = null;
    lastCommitRef.current = 0;
    setProgress(0);
    setPhase(hasTrailer ? "coverIn" : "cover");
  }, [active, hasTrailer, setPhase]);

  const running = rotates && !paused && phase !== "done";

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    lastTickRef.current = performance.now();
    const total = () => (hasTrailer ? holdMs * 2 + (durationRef.current ?? coverMs) : coverMs);
    const finish = () => {
      setProgress(1);
      if (active < count - 1) onAdvance();
      else setPhase("done");
    };
    const tick = (now: number) => {
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      const video = videoRef.current;
      const p = phaseRef.current;
      if (p === "video") {
        if (video) elapsedRef.current = holdMs + video.currentTime * 1000;
      } else {
        elapsedRef.current += dt;
      }
      if (p === "coverIn" && elapsedRef.current >= holdMs) {
        if (durationRef.current != null && video) {
          setPhase("video");
          video.play().catch(fail);
        } else if (elapsedRef.current >= holdMs + TRAILER_TIMEOUT_MS) {
          fail();
          return;
        }
      } else if ((p === "coverOut" || p === "cover") && elapsedRef.current >= total()) {
        finish();
        return;
      }
      if (now - lastCommitRef.current > 100) {
        lastCommitRef.current = now;
        setProgress(Math.min(1, elapsedRef.current / total()));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, active, count, hasTrailer, coverMs, holdMs, onAdvance, fail, setPhase]);

  // Pause / resume the trailer with the sequence.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || phaseRef.current !== "video") return;
    if (paused) video.pause();
    else video.play().catch(fail);
  }, [paused, fail]);

  const videoHandlers = {
    onLoadedMetadata: () => {
      const v = videoRef.current;
      const d = v && Number.isFinite(v.duration) && v.duration > 0 ? v.duration * 1000 : null;
      if (d == null) fail();
      else durationRef.current = d;
    },
    onEnded: () => {
      elapsedRef.current = holdMs + (durationRef.current ?? 0);
      setPhase("coverOut");
    },
    onError: fail,
  };

  return { videoRef, videoHandlers, hasTrailer, phase, progress, running };
}

/* ---- Presentational pieces (declared outside the component: stable identity) */

const fadeStyle = (reducedMotion: boolean) => (reducedMotion ? undefined : { animation: `diveHeroFadeIn ${FADE_MS}ms linear` });

/** Cover image with a 200 ms linear crossfade between items (never through black). */
function CoverImage({ src, reducedMotion, className }: { src: string; reducedMotion: boolean; className: string }) {
  const [prev, setPrev] = useState<string | null>(null);
  const lastRef = useRef(src);
  useEffect(() => {
    if (lastRef.current === src) return;
    const old = lastRef.current;
    lastRef.current = src;
    if (reducedMotion) return;
    setPrev(old);
    const id = setTimeout(() => setPrev(null), FADE_MS + 50);
    return () => clearTimeout(id);
  }, [src, reducedMotion]);
  return (
    <>
      {prev && <img src={prev} alt="" className={className} />}
      <img key={src} src={src} alt="" className={className} style={fadeStyle(reducedMotion)} />
    </>
  );
}

/** Page dots (XS only): active 10 px, inactive 8 px, shrinking to 6 / 4 px at the edges of a 7-dot window. */
function PageDots({ count, active }: { count: number; active: number }) {
  const window = 7;
  let start = 0;
  if (count > window) start = Math.min(Math.max(0, active - Math.floor(window / 2)), count - window);
  const end = Math.min(count, start + window);
  const dots: number[] = [];
  for (let i = start; i < end; i++) dots.push(i);
  const sizeFor = (i: number) => {
    if (i === active) return 10;
    if (count <= window) return 8;
    const atStart = i === start && start > 0;
    const atEnd = i === end - 1 && end < count;
    if (atStart || atEnd) return i === start + 1 || i === end - 2 ? 8 : 4;
    return 8;
  };
  return (
    <div className="flex items-center justify-center gap-[8px] py-[8px]" aria-hidden="true" data-name="page controls">
      {dots.map((i) => {
        const size = sizeFor(i);
        const edge = count > window && ((i === start && start > 0) || (i === end - 1 && end < count));
        const s = edge ? Math.min(size, 6) : size;
        return (
          <span
            key={i}
            className="block rounded-[100px] shrink-0"
            style={{
              width: s,
              height: s,
              background: i === active ? "var(--bg-surface-inverse)" : "var(--bg-surface-transparent-35)",
            }}
          />
        );
      })}
    </div>
  );
}

interface LeftPanelProps {
  slide: HeroSlide;
  cfg: TierConfig;
  isXs: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onSelect?: () => void;
}

/** B — left panel: logotitle (or text title), catchline, optional CTA. Stacked upward from the bottom. */
function LeftPanel({ slide, cfg, isXs, reducedMotion, paused, onSelect }: LeftPanelProps) {
  const isShort = slide.title.length <= SHORT_TITLE_MAX;
  const titleClass = isShort ? cfg.shortTitleClass : cfg.longTitleClass;
  return (
    <div
      className={`flex flex-col items-start ${onSelect ? "cursor-pointer" : ""}`}
      style={{ width: cfg.leftW, ...fadeStyle(reducedMotion) }}
      aria-live={paused ? "polite" : "off"}
      aria-atomic="true"
      onClick={onSelect}
      data-name="Left panel"
    >
      {slide.logoImage ? (
        <>
          <h2 className="sr-only">{slide.title}</h2>
          <img
            src={slide.logoImage}
            alt=""
            className="block h-auto object-contain object-left-bottom"
            style={{ width: cfg.logoW, maxWidth: "100%" }}
          />
        </>
      ) : (
        <h2 className={`${titleClass} uppercase`} style={{ color: "var(--text-primary)", maxWidth: cfg.leftW }}>
          {slide.title}
        </h2>
      )}
      {slide.catchline && slide.catchline.length > 0 && (
        <p
          className={`${cfg.catchClass} uppercase whitespace-pre-line ${isXs ? "pt-[8px]" : "pt-[24px]"}`}
          style={{ color: "var(--text-primary)", maxWidth: cfg.catchW }}
        >
          {slide.catchline.slice(0, 2).join("\n")}
        </p>
      )}
      {slide.ctaLabel && !isXs && (
        <div className="pt-[16px]" onClick={(e) => e.stopPropagation()}>
          <ButtonFilled
            variant="primary"
            size={cfg.gutter >= 64 ? "large" : "small"}
            widthClass={cfg.gutter >= 64 ? "min-w-[184px]" : "min-w-[136px]"}
            onClick={onSelect}
          >
            {slide.ctaLabel}
          </ButtonFilled>
        </div>
      )}
    </div>
  );
}

interface ControlsProps {
  showMute: boolean;
  muted: boolean;
  onToggleMute: () => void;
  showPause: boolean;
  paused: boolean;
  onTogglePause: () => void;
  vertical?: boolean;
  gap: number;
}

/** C1 — sound + pause controls (bordered circle icon buttons, transparent fill). */
function Controls({ showMute, muted, onToggleMute, showPause, paused, onTogglePause, vertical = false, gap }: ControlsProps) {
  if (!showMute && !showPause) return null;
  return (
    <div className={`flex items-center ${vertical ? "flex-col" : ""}`} style={{ gap }} data-name="Video controls">
      {showMute && (
        <IconButton
          shape="circle"
          type="secondary"
          bordered
          size="xsmall"
          aria-label={muted ? "Activer le son" : "Couper le son"}
          aria-pressed={!muted}
          onClick={onToggleMute}
        >
          {muted ? <PlayerSoundOff /> : <PlayerSoundOn />}
        </IconButton>
      )}
      {showPause && (
        <IconButton
          shape="circle"
          type="secondary"
          bordered
          size="xsmall"
          aria-label={paused ? "Reprendre le défilement automatique" : "Suspendre le défilement automatique"}
          aria-pressed={paused}
          onClick={onTogglePause}
        >
          {paused ? <PlayerPlay /> : <PlayerPause />}
        </IconButton>
      )}
    </div>
  );
}

/** C2 — editorial label (5:1 asset or brand text) beside the channel logo (4:3), identical heights. */
function LabelAndChannel({ slide, cfg, reducedMotion }: { slide: HeroSlide; cfg: TierConfig; reducedMotion: boolean }) {
  return (
    <div className="flex items-center justify-end gap-[16px]" style={fadeStyle(reducedMotion)} data-name="Bloc logos">
      {slide.labelImage ? (
        <img src={slide.labelImage} alt={slide.label ?? ""} className="block aspect-[5/1] object-contain" style={{ height: cfg.logoH }} />
      ) : (
        slide.label && (
          <span className={`${cfg.labelClass} uppercase text-right`} style={{ color: "var(--text-primary)" }}>
            {slide.label}
          </span>
        )
      )}
      {/* DIVE channel logos are 4:3 with preserveAspectRatio="none": keep the box 4:3. */}
      <div className="aspect-[4/3] shrink-0" style={{ height: cfg.logoH }}>
        <img src={slide.channelLogo} alt="" className="block size-full" />
      </div>
    </div>
  );
}

interface TileProps {
  slide: HeroSlide;
  index: number;
  isActive: boolean;
  showTimer: boolean;
  progress: number;
  width: string;
  tileRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  onClick: (index: number) => void;
}

/** D — a carousel row tile: MediaBlock 16:9, highlight ring (product) + focus ring (user). */
function Tile({ slide, index, isActive, showTimer, progress, width, tileRefs, onClick }: TileProps) {
  return (
    <button
      ref={(node) => {
        tileRefs.current[index] = node;
      }}
      type="button"
      onClick={() => onClick(index)}
      title={slide.title}
      aria-label={isActive ? `${slide.title} — ouvrir` : slide.title}
      aria-current={isActive ? "true" : undefined}
      className="relative flex-none cursor-pointer rounded-[2px] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:[outline-color:var(--border-focus)]"
      style={{ width }}
    >
      <MediaBlock
        aspectRatio="16:9"
        imageUrl={slide.tileImage}
        channelLogo={slide.channelLogo}
        showLogo
        showOverlayTitle={false}
        showProgress={showTimer}
        timerProgress={showTimer ? progress : undefined}
        progressPercent={slide.progressPercent ?? 0}
        showProgressShadow
        showCloseButton={false}
        showLiveBadge={!!slide.live}
        showCompleteIcon={false}
        showPlayButton={false}
        showOutsideElements={false}
        selected={isActive}
      />
    </button>
  );
}

/* ---- Component --------------------------------------------------------- */

function clampIndex(i: number, count: number) {
  return Math.min(Math.max(0, i), Math.max(0, count - 1));
}

export default function HeroBillboardCarousel({
  slides,
  coverMs: coverMsProp,
  intervalMs,
  holdMs = 1000,
  autoPlay = true,
  initialIndex = 0,
  onSelect,
  onHighlightChange,
}: HeroBillboardCarouselProps) {
  const coverMs = coverMsProp ?? intervalMs ?? 10000;
  const count = slides.length;
  const rotates = count > 1;

  const sectionRef = useRef<HTMLElement | null>(null);
  const tier = useContainerTier(sectionRef);
  const cfg = TIERS[tier];
  const isXs = tier === "xs";
  const reducedMotion = useReducedMotion();

  // --- Highlight (the product's position) ---
  const [active, setActiveState] = useState(() => clampIndex(initialIndex, count));
  const reasonRef = useRef<ChangeReason>("init");
  const setActive = useCallback(
    (i: number, reason: ChangeReason) => {
      reasonRef.current = reason;
      setActiveState(clampIndex(i, count));
    },
    [count],
  );
  const slide = slides[active] ?? slides[0];

  useEffect(() => {
    onHighlightChange?.(active);
  }, [active, onHighlightChange]);

  // --- Pause / sound ---
  // Reduced-motion users never get an auto-advancing billboard: mount paused.
  const [paused, setPaused] = useState(() => !autoPlay || prefersReducedMotion());
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);
  // Hidden tab: pause the sequence, resume on return unless the user paused it.
  const autoPausedRef = useRef(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisibility = () => {
      if (document.hidden) {
        setPaused((p) => {
          if (!p) autoPausedRef.current = true;
          return true;
        });
      } else if (autoPausedRef.current) {
        autoPausedRef.current = false;
        setPaused(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const advance = useCallback(() => setActive(active + 1, "auto"), [active, setActive]);
  const { videoRef, videoHandlers, hasTrailer, phase, progress } = useAutoAdvance({
    active,
    count,
    trailerUrl: slide?.trailerUrl,
    videoAllowed: !isXs && !reducedMotion,
    paused,
    coverMs,
    holdMs,
    onAdvance: advance,
  });

  // --- Row (SM+) — highlight visibility rules ---
  const rowRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevActiveRef = useRef<number | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scrollBehavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";

  const updateArrows = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, isXs]);

  // A tile is "visible" when 100% inside the row's content box (gutters excluded).
  const isFullyVisible = useCallback(
    (el: HTMLElement, row: HTMLDivElement) =>
      el.offsetLeft >= row.scrollLeft + cfg.gutter - 1 &&
      el.offsetLeft + el.offsetWidth <= row.scrollLeft + row.clientWidth - cfg.gutter + 1,
    [cfg.gutter],
  );
  const reveal = useCallback(
    (el: HTMLElement, row: HTMLDivElement, align: "start" | "end") => {
      const left =
        align === "start" ? el.offsetLeft - cfg.gutter : el.offsetLeft + el.offsetWidth + cfg.gutter - row.clientWidth;
      row.scrollTo({ left, behavior: scrollBehavior });
    },
    [cfg.gutter, scrollBehavior],
  );

  useLayoutEffect(() => {
    const prev = prevActiveRef.current;
    prevActiveRef.current = active;
    if (prev == null || prev === active) return;
    const reason = reasonRef.current;
    if (isXs) {
      // XS: the cards slide (translation); a swipe already moved the scroller.
      const el = rowRef.current;
      if (el && reason !== "swipe") {
        const card = el.children[active] as HTMLElement | undefined;
        if (card) el.scrollTo({ left: card.offsetLeft - cfg.gutter, behavior: scrollBehavior });
      }
      return;
    }
    const row = rowRef.current;
    const tile = tileRefs.current[active];
    const prevTile = tileRefs.current[prev];
    if (!row || !tile) return;
    if (reason === "click") {
      // Peeking tile clicked: bring it fully into view, minimal move.
      if (!isFullyVisible(tile, row)) reveal(tile, row, active > prev ? "end" : "start");
      return;
    }
    // Auto-advance / slide arrows: a visible highlight must stay visible; a
    // highlight the user scrolled away keeps moving off-screen.
    if (prevTile && !isFullyVisible(prevTile, row)) return;
    if (isFullyVisible(tile, row)) return;
    reveal(tile, row, active > prev ? "start" : "end");
  }, [active, isXs, cfg.gutter, isFullyVisible, reveal, scrollBehavior]);

  // XS: swiping the cards moves the highlight (and restarts its timer).
  const onXsScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el || !isXs) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    const stride = card.offsetWidth + TILE_GAP;
    const i = clampIndex(Math.round(el.scrollLeft / stride), count);
    if (i !== active) setActive(i, "swipe");
  }, [isXs, count, active, setActive]);

  const scrollRange = (dir: number) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth - 2 * cfg.gutter + TILE_GAP), behavior: scrollBehavior });
  };

  const select = useCallback(() => {
    if (slide) onSelect?.(slide, active);
  }, [onSelect, slide, active]);

  const onTileClick = useCallback(
    (i: number) => {
      if (i === active) select();
      else setActive(i, "click");
    },
    [active, select, setActive],
  );

  if (!slide) return null;

  const background = slide.backgroundImage || slide.tileImage;
  const tileWidth = `calc((100% - ${(cfg.n - 1) * TILE_GAP}px) / ${cfg.n})`;
  const showTimer = rotates;
  const controls = (vertical: boolean) => (
    <Controls
      showMute={hasTrailer}
      muted={muted}
      onToggleMute={() => setMuted((m) => !m)}
      showPause={rotates}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      vertical={vertical}
      gap={vertical ? 20 : cfg.gutter >= 64 ? 24 : 16}
    />
  );
  const radialScrim = {
    backgroundImage:
      "radial-gradient(ellipse at 54% 43%, var(--bg-scrim-secondary-start) 0%, var(--bg-surface-transparent-20-inverse) 100%)",
  };

  /* ---------------------------------------------------------------- XS --- */
  if (isXs) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full pt-[16px]"
        style={{ background: "var(--bg)" }}
        data-name="Hero billboard carousel"
        aria-roledescription="carrousel"
        aria-label="À la une"
      >
        <div
          ref={rowRef}
          onScroll={onXsScroll}
          className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          style={{ gap: TILE_GAP, paddingInline: cfg.gutter, scrollPaddingInline: cfg.gutter, scrollbarWidth: "none" }}
        >
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                className="relative w-full shrink-0 snap-start overflow-hidden rounded-[4px] aspect-[342/256] cursor-pointer"
                onClick={() => (isActive ? select() : setActive(i, "click"))}
                aria-hidden={!isActive}
                data-name="Carousel Slides"
              >
                <img src={s.backgroundImage || s.tileImage} alt="" className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0" style={radialScrim} aria-hidden="true" />
                {/* Right panel XS: label top-right, stacked controls, channel logo bottom-right */}
                <div className="absolute right-[4px] inset-y-[4px] w-[180px]" data-name="Right panel - web XS">
                  <div className="absolute right-0 top-0 flex items-center justify-end gap-[8px]">
                    {s.labelImage ? (
                      <img src={s.labelImage} alt={s.label ?? ""} className="block aspect-[5/1] object-contain" style={{ height: cfg.logoH }} />
                    ) : (
                      s.label && (
                        <span className={`${cfg.labelClass} uppercase text-right pt-[4px] pr-[4px]`} style={{ color: "var(--text-primary)" }}>
                          {s.label}
                        </span>
                      )
                    )}
                    {s.live && <Sticker variant="emphasis" label="LIVE" labelStyle="semibold" />}
                  </div>
                  {isActive && (
                    <div className="absolute right-[4px] bottom-[50px]" onClick={(e) => e.stopPropagation()}>
                      {controls(true)}
                    </div>
                  )}
                  <div className="absolute right-0 bottom-0 aspect-[4/3]" style={{ height: cfg.logoH }}>
                    <img src={s.channelLogo} alt="" className="block size-full" />
                  </div>
                </div>
                <div className="absolute left-[12px] bottom-[12px]">
                  <LeftPanel slide={s} cfg={cfg} isXs reducedMotion={reducedMotion} paused={paused} />
                </div>
              </div>
            );
          })}
        </div>
        {rotates && <PageDots count={count} active={active} />}
      </section>
    );
  }

  /* --------------------------------------------------------------- SM+ --- */
  const isSm = tier === "sm";
  // SM: the media is 16:9 and the row overlaps its bottom edge. MD+: dynamic
  // height between 16:9 and 16:7 of the width, leaving ≥ 8 % of the viewport to
  // the top of the next row (Figma "Responsive rules").
  const height = isSm
    ? "calc(100cqw * 9 / 16 + 65px)"
    : "clamp(calc(100cqw * 7 / 16), 92svh, calc(100cqw * 9 / 16))";
  const coverClass = "absolute inset-0 size-full object-cover";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", containerType: "inline-size" }}
      data-name="Hero billboard carousel"
      aria-roledescription="carrousel"
      aria-label="À la une"
    >
      <div className="relative w-full" style={{ height }}>
        {/* A — media background: cover crossfade + optional trailer */}
        <div
          className={`absolute inset-x-0 top-0 overflow-hidden ${isSm ? "aspect-[16/9]" : "bottom-0"} ${onSelect ? "cursor-pointer" : ""}`}
          onClick={select}
          aria-hidden="true"
          data-name="Background media"
        >
          <CoverImage src={background} reducedMotion={reducedMotion} className={coverClass} />
          {hasTrailer && slide.trailerUrl && (
            <video
              key={active}
              ref={videoRef}
              src={slide.trailerUrl}
              muted={muted}
              playsInline
              preload="auto"
              tabIndex={-1}
              className={`${coverClass} ${reducedMotion ? "" : "transition-opacity duration-200 ease-linear"}`}
              style={{ opacity: phase === "video" ? 1 : 0, transform: "scale(1.35)" }}
              {...videoHandlers}
            />
          )}
          {/* Radial scrim (all SM+), then the bottom fade into the page surface. */}
          <div className="absolute inset-0" style={radialScrim} />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(to bottom, var(--bg-transparent) 70%, var(--bg) 100%)" }}
          />
        </div>

        {/* F — slide arrows on the cover: highlight ±1 */}
        {rotates && active > 0 && (
          <div className="absolute left-[8px] top-1/2 -translate-y-1/2 z-20">
            <CarouselScrollButton direction="left" size="small" aria-label="Contenu précédent" onClick={() => setActive(active - 1, "arrow")} />
          </div>
        )}
        {rotates && active < count - 1 && (
          <div className="absolute right-[8px] top-1/2 -translate-y-1/2 z-20">
            <CarouselScrollButton direction="right" size="small" aria-label="Contenu suivant" onClick={() => setActive(active + 1, "arrow")} />
          </div>
        )}

        {/* B — left panel */}
        <div key={`left-${active}`} className="absolute z-10" style={{ left: cfg.gutter, bottom: cfg.leftBottom }}>
          <LeftPanel slide={slide} cfg={cfg} isXs={false} reducedMotion={reducedMotion} paused={paused} onSelect={onSelect ? select : undefined} />
        </div>

        {/* C — right panel: controls above the label + channel logo */}
        <div
          className="absolute z-10 flex flex-col items-end"
          style={{ right: cfg.gutter, bottom: cfg.rightBottom, gap: cfg.gutter >= 64 ? 32 : 16 }}
          data-name="Right panel"
        >
          {controls(false)}
          <div key={`right-${active}`}>
            <LabelAndChannel slide={slide} cfg={cfg} reducedMotion={reducedMotion} />
          </div>
        </div>

        {/* D — carousel row = navigation; the highlighted tile carries the timer */}
        <div className="absolute inset-x-0 z-10" style={{ bottom: cfg.rowBottom }} data-name="Carousel Row">
          <div
            ref={rowRef}
            className="hide-scrollbar relative flex overflow-x-auto"
            style={{ gap: TILE_GAP, paddingInline: cfg.gutter, scrollPaddingInline: cfg.gutter, scrollbarWidth: "none" }}
          >
            {slides.map((s, i) => (
              <Tile
                key={i}
                slide={s}
                index={i}
                isActive={i === active}
                showTimer={showTimer && i === active}
                progress={progress}
                width={tileWidth}
                tileRefs={tileRefs}
                onClick={onTileClick}
              />
            ))}
          </div>
          {/* Row arrows, inside the gutters (LG+ only: the 32 px gutters of SM/MD can't host them) */}
          {cfg.gutter >= 64 && canLeft && (
            <div className="absolute top-1/2 -translate-y-1/2 z-20" style={{ left: (cfg.gutter - 40) / 2 }}>
              <CarouselScrollButton direction="left" size="small" aria-label="Vignettes précédentes" onClick={() => scrollRange(-1)} />
            </div>
          )}
          {cfg.gutter >= 64 && canRight && (
            <div className="absolute top-1/2 -translate-y-1/2 z-20" style={{ right: (cfg.gutter - 40) / 2 }}>
              <CarouselScrollButton direction="right" size="small" aria-label="Vignettes suivantes" onClick={() => scrollRange(1)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
