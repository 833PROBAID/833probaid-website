"use client";

import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ══════════════════════════════════════════════════════════════════
//  DESIGN CONFIG — every visual value lives here.
//  Change a number or color; it applies everywhere instantly.
//  Max card: 450 × 700 px  (aspect-ratio: 450 / 700 = 9 / 14)
//  All layout values are expressed as % of those dimensions.
// ══════════════════════════════════════════════════════════════════
const D = {
  // Card max size (px) — used only for maxWidth and aspect-ratio
  w: 450,
  h: 700,

  // Teal palette (cover, base, shadows)
  teal: "#14b3c2",
  tealMid: "#0a9aa8",
  tealDark: "#0097A7",
  tealDeep: "#007B88",
  tealShadow: "#033842",

  // Orange palette (band, staples, button)
  orange: "#FE7702",
  orangeLight: "#ff9043",
  orangeDark: "#d65f0f",

  // Inner page
  paper: "#fbf6ec",
  ink: "#1a3540",

  // Animation
  flipDur: 1400,
  fadeDur: 500,
};
// ══════════════════════════════════════════════════════════════════

// ── Percentage constants (derived from 450 × 700 grid) ─────────
// Horizontal % → relative to card width (450px)
// Vertical   % → relative to card height (700px)
const P = {
  // Inner/cover page insets
  coverPadV: "5%", // 35/700 — top & bottom gap from card edge
  hingeH: "9.33%", // (22+20)/450 — staple side inset
  openH: "7.78%", // 35/450 — open-corner side inset

  // Staples
  stapleW: "4.44%", // 20/450
  stapleH: "25.71%", // 180/700

  // Orange band (height relative to cover panel = 90% × 700 = 630px)
  bandH: "19.37%", // 122/630

  // Spine shadow strip
  spineW: "1.78%", // 8/450
};

// ── Percentage-safe padding for the inner content column ────────
// The inner content div's containing block width ≈ 450 × (1 - 9.33% - 7.78%) = 373px
// CSS % padding is always relative to the element's own width (373px here)
const INNER_PAD_NORMAL = "5%"; // 28 26 28 52 px
const INNER_PAD_MIRRORED = "5%";

// ──────────────────────────────────────────────────────────────────
export function BookCardDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter
          id="book-shadow-top"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter
          id="book-shadow-bottom"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1.7" />
        </filter>
      </defs>
    </svg>
  );
}

// Clip-paths stay in percentage units — they already are ✓
const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_SHADOW_POLYGON_POINTS = "0,0 96.5,0 100,3.5 100,88 86,100 0,100";
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";
const COVER_SHADOW_POLYGON_POINTS_MIRROR =
  "0,3.5 3.5,0 100,0 100,100 14,100 0,88";

// ── LearnMoreButton ───────────────────────────────────────────────
// All sizes use clamp() so the button scales with the card.
// Arrow/gap values kept as numbers (px) for the layout math but overridden
// visually via style on the <Image>.
const BTN_SIZE = {
  //           font clamp               height clamp              arrow max  arrow clamp
  lg: {
    fsClamp: "clamp(16px,6.67vw,30px)",
    hClamp: "clamp(40px,14.4vw,65px)",
    arrow: 42,
    arrowClamp: "clamp(24px,9.3vw,42px)",
  },
  md: {
    fsClamp: "clamp(13px,4.89vw,22px)",
    hClamp: "clamp(38px,14.4vw,65px)",
    arrow: 32,
    arrowClamp: "clamp(18px,7.1vw,32px)",
  },
  sm: {
    fsClamp: "clamp(10px,3.56vw,16px)",
    hClamp: "clamp(30px,9.3vw,42px)",
    arrow: 24,
    arrowClamp: "clamp(14px,5.3vw,24px)",
  },
};

export function LearnMoreButton({
  onClick,
  href,
  label = "Learn More",
  size = "lg",
  mirrored = false,
}) {
  const [hov, setHov] = useState(false);
  const { fsClamp, hClamp, arrow, arrowClamp } = BTN_SIZE[size] ?? BTN_SIZE.lg;
  const rotateDir = mirrored ? "3deg" : "-3deg";

  const sharedStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "clamp(6px,1.5vw,11px)",
    padding: "0 clamp(8px,2vw,14px)",
    background: D.orange,
    border: "mixed solid #924705",
    borderRadius: 8,
    height: hClamp,
    cursor: "pointer",
    textDecoration: "none",
    boxShadow:
      "0px 2.73px 6.64px 0px #000000AD, inset 3px -3px 2px 0px #00000040, inset -3px 3px 2px 0px #FFFFFF40, -1.82px -0.91px 3.64px 0px #00000099",
    animation: hov ? "none" : "floatBounce 3s ease-in-out infinite",
    transform: hov
      ? `scale(1.08) rotate(${rotateDir})`
      : "scale(1) rotate(0deg)",
    transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
    willChange: "transform",
    WebkitTextStroke: "0.91px #924705",
  };

  const inner = (
    <>
      <span
        className="font-poppins font-black uppercase text-white [text-shadow:0_3px_1px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]"
        style={{ fontSize: fsClamp }}
      >
        {label}
      </span>
      <Image
        src="/arrow-right.png"
        alt=""
        width={arrow}
        height={arrow}
        style={{ width: arrowClamp, height: arrowClamp }}
        className="object-contain"
      />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={sharedStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={sharedStyle}
    >
      {inner}
    </button>
  );
}

// ── BookCard ──────────────────────────────────────────────────────
function BookCardInner({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt = "",
  tag = "SERVICE",
  onLearnMore,
  slug,
  speed = D.flipDur,
  width = D.w,
  height = D.h,
  icon,
  mirrored = false,
}) {
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const stageRef = useRef(null);
  const router = useRouter();

  // Pause float animation for off-screen cards
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Mirrored variants ──────────────────────────────────────────
  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const shadowPoints = mirrored
    ? COVER_SHADOW_POLYGON_POINTS_MIRROR
    : COVER_SHADOW_POLYGON_POINTS;

  // Hinge/page edges — now pure percentages
  const hingeEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPageEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPadding = mirrored ? INNER_PAD_MIRRORED : INNER_PAD_NORMAL;

  const transformOrigin = mirrored ? "right center" : "left center";
  const flipAngle = mirrored ? "168deg" : "-168deg";
  const shadowTopTx = mirrored
    ? "translate(-1.35 -1.15)"
    : "translate(1.35 -1.15)";
  const shadowBotTx = mirrored ? "translate(0.55 1.2)" : "translate(-0.55 1.2)";
  const stapleEdge = mirrored ? { right: "7%" } : { left: "7%" }; // 22/450
  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";
  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };

  const coverTransition = `
    transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    opacity   ${D.fadeDur}ms ease ${speed - D.fadeDur}ms
  `;
  const coverTransform = open
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";

  return (
    // ── STAGE: perspective wrapper, fluid width, height driven by aspect-ratio ──
    <div
      ref={stageRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // perspective scales with the card: 2200/450 * 100 ≈ 489vw, capped at max
        perspective: "clamp(1400px, 489vw, 2200px)",
        perspectiveOrigin: "50% 45%",
        width: "100%",
        padding: "4% 0", // ~30px at max width, shrinks proportionally
        boxSizing: "border-box",
      }}
    >
      {/* ── BOOK WRAPPER ─────────────────────────────────────────── */}
      {/* width: 100% up to max; aspect-ratio locks height proportionally */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width, // 450px default
          aspectRatio: `${width} / ${height}`, // 450/700 = 0.643
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── BASE SHELL: always visible teal frame ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1.8%", // 8/450
            transform: "translateZ(-4px)",
            background: `linear-gradient(135deg, ${D.tealDark}, ${D.tealDeep})`,
            boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset -5px -6px 4px rgba(0,0,0,0.25),
              5px -6px 15.1px rgba(0,0,0,0.80),
              -2px 6px 11.3px rgba(0,0,0,0.80)
            `,
          }}
        />

        {/* ── SPINE STAPLES ── */}
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            top: "1.5px",
            width: P.stapleW, // 4.44%
            height: P.stapleH, // 25.71%
            transform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 -1px 0 rgba(255,255,255,0.3), 1px -1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px 5px 4.6px 0px #00000080",
          }}
        />
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            bottom: "1.5px",
            width: P.stapleW,
            height: P.stapleH,
            transform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px -5px 4.6px 0px #00000080",
          }}
        />

        {/* ── INNER PAGE ── */}
        <div
          style={{
            position: "absolute",
            top: P.coverPadV, // 5%
            bottom: P.coverPadV, // 5%
            ...innerPageEdge,
            transform: "translateZ(-1px)",
            borderRadius: "3%", // 13.5/450
            clipPath,
            WebkitClipPath: clipPath,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${D.paper} 0%, #f5ecd9 100%)`,
              borderRadius: "1.1%", // 4/373
              boxShadow: innerBoxShadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: innerPadding,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px,2vw,14px)",
                boxSizing: "border-box",
              }}
            >
              <div className="bg-white flex flex-col items-center justify-center py-4 text-center  border-4 rounded-3xl border-l-18 border-secondary transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                <h1 className="font-anton text-2xl uppercase leading-tight text-primary hover:text-secondary">
                  {title}
                </h1>
                {subtitle && (
                  <p className="font-montserrat mt-4 text-sm font-bold uppercase text-secondary hover:text-primary">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Hero image */}
              <div className="relative w-full bg-white overflow-hidden rounded-2xl border-4 border-secondary shadow-lg shadow-black/30 sm:shadow-xl my-6 sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                <img
                  src={imageSrc || "/images/hero.png"}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>
              {description && (
                <div className="p-4 bg-white rounded-2xl border-4 border-secondary mt-4">
                  <p className="text-secondary font-semibold text-sm">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COVER PAGE ── */}
        <div
          style={{
            position: "absolute",
            top: P.coverPadV,
            bottom: P.coverPadV,
            ...hingeEdge,
            transformOrigin,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            borderRadius: "3%",
            transform: coverTransform,
            WebkitTransform: coverTransform,
            opacity: open ? 0 : 1,
            transition: coverTransition,
            pointerEvents: open ? "none" : "auto",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate3d(0, 0, 0.02px)",
              WebkitTransform: "translate3d(0, 0, 0.02px)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* SVG edge shadow */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <polygon
                points={shadowPoints}
                fill="#000000"
                opacity="0.74"
                transform={shadowTopTx}
                filter="url(#book-shadow-top)"
              />
              <polygon
                points={shadowPoints}
                fill="#000000"
                opacity="0.64"
                transform={shadowBotTx}
                filter="url(#book-shadow-bottom)"
              />
            </svg>

            {/* Cover surface */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                background: "#0097A7",
                borderRadius: "3%",
                clipPath,
                WebkitClipPath: clipPath,
                overflow: "hidden",
              }}
            >
              {/* ORANGE BAND */}
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  right: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "20%",
                  background: "#FE7702",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), 0px 4px 5.6px 0px #00000060, 0px -3px 6.2px 0px #00000099, inset -12px 0px 4.6px 0px #00000080, inset 12px 0px 4.6px 0px #00000080",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <p
                  className="text-white text-center font-black font-poppins leading-[1.3]"
                  style={{
                    fontSize: "clamp(12px,4.4vw,20px)",
                    padding: "0 6%",
                    textShadow: "0px 4px 4px #00000099",
                  }}
                >
                  {subtitle}
                </p>
              </div>

              {/* UPPER HALF — icon + title */}
              <div
                className="absolute top-0 left-0 right-0 h-[36%] flex flex-col items-center justify-between"
                style={{ paddingTop: "3.6%" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "clamp(55px,22vw,100px)",
                    aspectRatio: "1",
                  }}
                >
                  <Image
                    src={icon}
                    alt={title}
                    fill
                    className={`object-contain floating-text cursor-pointer hover:scale-[1.1] transition-all duration-300 hover:rotate-3 ${icon === "/icons/card-icon-7.png" ? "scale-120" : ""}`}
                  />
                </div>
                <h1
                  className="text-white font-bold text-center uppercase leading-tight"
                  style={{
                    fontSize: "clamp(13px,4.4vw,20px)",
                    padding: "0 5%",
                    textShadow: "4.31px 4.31px 4.31px #00000040",
                  }}
                >
                  {String(title)
                    .split("®")
                    .map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <sup className="text-[0.55em]">®</sup>
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </h1>
              </div>

              {/* LOWER HALF — description + button */}
              <div
                className="absolute top-[64%] left-0 right-0 bottom-0 flex items-center justify-between flex-col"
                style={{ padding: "2% 6% 5%" }}
              >
                <p
                  className="text-white text-center font-montserrat leading-[1.3] font-semibold"
                  style={{
                    fontSize: "clamp(11px,3.8vw,17px)",
                    padding: "0 1%",
                  }}
                >
                  {description}
                </p>
                <LearnMoreButton
                  size="md"
                  label="Learn More"
                  mirrored={mirrored}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                    if (slug) {
                      router.push(`/homebooks/${slug}`);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Spine shadow strip */}
          <div
            style={{
              position: "absolute",
              ...spineEdge,
              top: 0,
              bottom: 0,
              width: P.spineW, // 1.78%
              background: spineGradient,
              pointerEvents: "none",
              opacity: open ? 1 : 0,
              transition: `opacity ${speed}ms ease`,
              zIndex: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const BookCard = memo(BookCardInner);
export default BookCard;
