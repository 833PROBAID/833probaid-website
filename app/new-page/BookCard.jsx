"use client";

import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ══════════════════════════════════════════════════════════════════
//  DESIGN CONFIG — every visual value lives here.
//  Change a number or color; it applies everywhere instantly.
// ══════════════════════════════════════════════════════════════════
const D = {
  // Card size (px)
  w: 450,
  h: 700,
  coverPagePadding: 35,

  // Teal palette (cover, base, shadows)
  teal: "#14b3c2", // raised-panel highlight
  tealMid: "#0a9aa8", // main cover surface
  tealDark: "#0097A7", // cover plate / base
  tealDeep: "#007B88", // recessed areas
  tealShadow: "#033842", // deepest background

  // Orange palette (band, staples, button)
  orange: "#FE7702",
  orangeLight: "#ff9043",
  orangeDark: "#d65f0f",

  // Inner page
  paper: "#fbf6ec",
  ink: "#1a3540",

  // Spine staples — two vertical orange bars on the left edge
  stapleLeft: 22, // px from left edge
  stapleW: 20, // px wide
  stapleH: 70, // px tall
  stapleTop: 36, // top staple: distance from top (px)
  stapleBot: 36, // bottom staple: distance from bottom (px)

  // Animation
  flipDur: 1400, // ms — 3D cover flip duration
  fadeDur: 500, // ms — cover fade-out (starts near end of flip)
  floatAmp: 6, // px — idle bounce height
  floatPer: "5.5s", // idle bounce loop time
};
// ══════════════════════════════════════════════════════════════════

// Shared SVG blur filters — render ONCE per page via <BookCardDefs />.
// All BookCard instances reference these global IDs.
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

// Normal  — chamfered BOTTOM-RIGHT corner, hinge on LEFT
const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_SHADOW_POLYGON_POINTS = "0,0 96.5,0 100,3.5 100,88 86,100 0,100";

// Mirrored — chamfered BOTTOM-LEFT corner, hinge on RIGHT
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";
const COVER_SHADOW_POLYGON_POINTS_MIRROR =
  "0,3.5 3.5,0 100,0 100,100 14,100 0,88";

// ── LearnMore button ─────────────────────────────────────────────
// size:  "lg" standalone  |  "md" cover CTA  |  "sm" inner page
const BTN_SIZE = {
  lg: { fs: 30, arrow: 42 },
  md: { fs: 22, arrow: 32 },
  sm: { fs: 16, arrow: 24 },
};

export function LearnMoreButton({
  onClick,
  href,
  label = "Learn More",
  size = "lg",
  mirrored = false,
}) {
  const [hov, setHov] = useState(false);
  const { fs, arrow } = BTN_SIZE[size] ?? BTN_SIZE.lg;
  const pad = Math.round(fs * 0.5);
  const rotateDir = mirrored ? "3deg" : "-3deg";
  const sharedStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: Math.round(arrow * 0.35),
    padding: `${pad}px ${Math.round(pad * 0.9)}px ${pad}px ${Math.round(pad * 1.2)}px`,
    background: D.orange,
    border: "mixed solid #924705",
    borderRadius: 8,
    height: "65px",
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
      <span className="font-poppins font-black text-[26px] uppercase text-white  [text-shadow:0_3px_1px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
        {label}
      </span>
      <Image
        src="/arrow-right.png"
        alt=""
        width={arrow}
        height={arrow}
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
// Props quick-reference:
//   title        orange band text + inner heading
//   subtitle     italic tagline on the cover and inner page
//   description  body copy — inner page only
//   imageSrc     inner page hero; "" shows a stripe placeholder
//   imageAlt     img alt / placeholder label
//   tag          small badge top-left of inner page ("SERVICE", "TOOL" …)
//   onLearnMore  callback when inner-page Learn More is clicked
//   speed        override D.flipDur per card (ms)
//   width/height override D.w / D.h per card (px numbers)
// ─────────────────────────────────────────────────────────────────
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

  // Pause float animation for cards that are off-screen
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

  // Derived mirrored values
  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const shadowPoints = mirrored
    ? COVER_SHADOW_POLYGON_POINTS_MIRROR
    : COVER_SHADOW_POLYGON_POINTS;
  const hingeEdge = mirrored
    ? { right: D.stapleLeft + D.stapleW, left: D.coverPagePadding }
    : { left: D.stapleLeft + D.stapleW, right: D.coverPagePadding };
  const transformOrigin = mirrored ? "right center" : "left center";
  const flipAngle = mirrored ? "168deg" : "-168deg";
  const shadowTopTx = mirrored
    ? "translate(-1.35 -1.15)"
    : "translate(1.35 -1.15)";
  const shadowBotTx = mirrored ? "translate(0.55 1.2)" : "translate(-0.55 1.2)";
  const stapleEdge = mirrored ? { right: "8%" } : { left: "8%" };
  const innerPageEdge = mirrored
    ? { right: D.stapleLeft + D.stapleW, left: D.coverPagePadding }
    : { left: D.stapleLeft + D.stapleW, right: D.coverPagePadding };
  const innerPadding = mirrored ? "28px 52px 28px 26px" : "28px 26px 28px 52px";
  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";
  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };

  // Cover flips then fades. Fade starts (speed - fadeDur) ms in so it
  // finishes exactly as the flip lands — the vanish feels part of the motion.
  const coverTransition = `
    transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    opacity   ${D.fadeDur}ms ease ${speed - D.fadeDur}ms
  `;
  const coverTransform = open
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 2200,
        perspectiveOrigin: "50% 45%",
        width: "100%",
        minHeight: height + 60,
        padding: "30px 0",
        boxSizing: "border-box",
      }}
    >
      {/* ── BOOK WRAPPER: 3D space + idle float when closed ── */}
      <div
        style={{
          position: "relative",
          width,
          height,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── BASE WRAPPER: dark teal shell — always visible, frames everything ── */}
        {/* This is the outer card. It never hides. Inner content is inset within it. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
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

        {/* ── SPINE STAPLES: always in front — Z=+5 beats cover at Z=0 ── */}
        {/* Move D.stapleLeft / D.stapleTop / D.stapleBot to reposition */}
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            top: "1px",
            width: "20px",
            height: "180px",
            transform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: 2,
            boxShadow:
              "inset 0 -1px 0 rgba(255,255,255,0.3), 1px -1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px 5px 4.6px 0px #00000080",
          }}
        />
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            bottom: "1.5px",
            width: "20px",
            height: "180px",
            transform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: 2,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px -5px 4.6px 0px #00000080",
          }}
        />

        {/* ── INNER PAGE: paper content — inset so the dark base frame always shows ── */}
        {/* clipPath matches the cover exactly — chamfered corner shows base, not content */}
        <div
          style={{
            position: "absolute",
            top: D.coverPagePadding,
            bottom: D.coverPagePadding,
            ...innerPageEdge,
            transform: "translateZ(-1px)",
            borderRadius: "13.5px",
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
              borderRadius: 4,
              boxShadow: innerBoxShadow,
              overflow: "hidden",
            }}
          >
            {/* Extra padding on the staple side keeps text clear */}
            <div
              style={{
                padding: innerPadding,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxSizing: "border-box",
              }}
            >
              <h1 className="font-anton text-xl uppercase leading-tight text-primary sm:text-2xl md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="font-montserrat mt-2 text-sm font-bold uppercase text-secondary sm:mt-3 sm:text-base md:text-lg">
                  {subtitle}
                </p>
              )}
              {/* Image / placeholder */}
              <div className="flex-1 min-h-[110px] rounded overflow-hidden bg-[#007B88] relative max-h-56">
                <img
                  src={imageSrc || "/images/hero.png"}
                  alt={title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              {description && (
                <p
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    color: "rgba(26,53,64,0.78)",
                    margin: 0,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── COVER PAGE: only the raised inner panel flips open ── */}
        {/* Change D.stapleLeft + D.stapleW in D to move the hinge */}
        <div
          style={{
            position: "absolute",
            top: D.coverPagePadding,
            bottom: D.coverPagePadding,
            ...hingeEdge,
            transformOrigin, // "left center" normal | "right center" mirrored
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            borderRadius: "13.5px",
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
            {/* SVG shadow paints immediately in Safari and follows the clipped cover shape. */}
            {/* SVG shadow — references shared filters from <BookCardDefs /> */}
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

            {/* Visual shape — chamfered corner (bottom-right normal, bottom-left mirrored) */}
            {/* Only inset effects here; outer shadows live on the wrapper above */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                background: "#0097A7",
                borderRadius: "13.5px",
                clipPath,
                WebkitClipPath: clipPath,
                overflow: "hidden",
              }}
            >
              {/* ORANGE BAND — subtitle */}
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  right: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: 122,
                  background: "#FE7702",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), 0px 4px 5.6px 0px #00000099, 0px -3px 6.2px 0px #00000099, inset -12px 0px 4.6px 0px #00000080, inset 12px 0px 4.6px 0px #00000080",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <p
                  className="text-white text-[20px] text-center px-6 font-black font-poppins leading-[1.3]"
                  style={{ textShadow: "0px 4px 4px #00000099" }}
                >
                  {subtitle}
                </p>
              </div>

              {/* UPPER HALF — title */}
              <div className="absolute top-0 left-0 right-0 h-[36%] flex flex-col items-center justify-between pt-4">
                <div className="w-25 h-25 relative">
                  {" "}
                  <Image
                    src={icon}
                    alt={title}
                    fill
                    className={`object-contain floating-text 
                      cursor-pointer hover:scale-[1.1] transition-all duration-300 hover:rotate-3 ${icon === "/icons/card-icon-7.png" ? "scale-120" : ""}`}
                  />
                </div>
                <h1
                  className="text-white text-xl font-bold text-center px-5 leading-tight uppercase"
                  style={{ textShadow: "4.31px 4.31px 4.31px #00000040" }}
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

              {/* LOWER HALF — Open button */}
              <div className="absolute top-[64%] left-0 right-0 bottom-0 flex items-center justify-between px-6 pt-2 pb-6 flex-col">
                <p className="text-white text-lg text-center px-1 font-montserrat leading-[1.3] font-semibold">
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
                      setTimeout(() => router.push(`/homebooks/${slug}`), 1000);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── SPINE SHADOW — thin strip that fades in when open ── */}
          <div
            style={{
              position: "absolute",
              ...spineEdge,
              top: 0,
              bottom: 0,
              width: 8,
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
