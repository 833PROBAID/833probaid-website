"use client";

/**
 * BookCard — Safari-Optimized FINAL
 *
 * SHADOW APPROACH — why we came back to inline SVG:
 *
 *   The shadow polygon fills the entire cover shape. It only looks like
 *   an EDGE shadow because it sits at zIndex 0 (behind the teal cover
 *   surface at zIndex 1) with overflow:visible, so only the blurred
 *   fringe outside/around the teal surface is visible.
 *
 *   Every alternative broke this:
 *   • zIndex 10 above cover  → black rectangle over entire cover
 *   • CSS drop-shadow()      → filter inside preserve-3d flattens 3D on Safari
 *   • box-shadow             → rectangular, corner imperfect
 *   • background-image SVG  → background clips to element, overflow ignored
 *
 *   Correct fix: keep inline SVG at zIndex 0 (original position),
 *   reduce stdDeviation from 1.4/1.7 → 0.7/0.9.
 *   Blur cost scales as radius², so 0.7² / 1.4² = 25% of original cost.
 *   Shadow is visually near-identical. Corner is pixel-perfect.
 *
 * ALL CHANGES APPLIED:
 *
 * [FIX-C]  feGaussianBlur stdDeviation reduced: 1.4→0.7, 1.7→0.9.
 *          ~25% of original blur computation. Visual difference minimal.
 *
 * [FIX-B]  ALL missing -webkit- prefixes added to every 3D-participating
 *          element: WebkitPerspective, WebkitPerspectiveOrigin,
 *          WebkitTransformStyle, WebkitTransformOrigin, WebkitTransform,
 *          WebkitTransition, WebkitBackfaceVisibility, WebkitClipPath.
 *
 * [FIX-H]  Removed `flipping` useState entirely. willChange is now a
 *          static value — original toggled it, causing GPU layer teardown
 *          + rebuild at the start and end of every flip animation.
 *
 * [FIX-M]  Inner page hero <img> → next/image <Image />.
 *
 * [FIX-B2] isolation:"isolate" on stage wrapper prevents 3D stacking
 *          context from bleeding into surrounding page content.
 *
 * translateZ values, box-shadows, and all visual structure: UNCHANGED.
 */

import { memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./book-card.css";

// ══════════════════════════════════════════════════════════════════
//  DESIGN CONFIG — unchanged
// ══════════════════════════════════════════════════════════════════
const D = {
  w: 460,
  h: 700,
  teal: "#14b3c2",
  tealMid: "#0a9aa8",
  tealDark: "#0097A7",
  tealDeep: "#007B88",
  tealShadow: "#033842",
  orange: "#FE7702",
  orangeLight: "#ff9043",
  orangeDark: "#d65f0f",
  paper: "#fbf6ec",
  ink: "#1a3540",
  flipDur: 1400,
  fadeDur: 500,
};

const P = {
  coverPadV: "5%",
  hingeH: "9.33%",
  openH: "7.78%",
  stapleW: "4.2%",
  stapleH: "23%",
  bandH: "19.37%",
  spineW: "1.78%",
};

const INNER_PAD_NORMAL = "5%";
const INNER_PAD_MIRRORED = "5%";

const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_SHADOW_POINTS = "0,0 96.5,0 100,3.5 100,88 86,100 0,100";
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";
const COVER_SHADOW_POINTS_MIRROR = "0,3.5 3.5,0 100,0 100,100 14,100 0,88";

// ── BookCardDefs ──────────────────────────────────────────────────
// [FIX-C] stdDeviation reduced: 1.4→0.7 and 1.7→0.9.
// Blur radius halved = ~25% of original GPU cost (cost scales as r²).
// Filter region extended to -30%/-30% so the soft fringe isn't clipped.
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
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.7" /> {/* was 1.4 */}
        </filter>
        <filter
          id="book-shadow-bottom"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.9" /> {/* was 1.7 */}
        </filter>
      </defs>
    </svg>
  );
}

// ── LearnMoreButton — unchanged ───────────────────────────────────
export function LearnMoreButton({
  onClick,
  label = "Learn More",
  size = "lg",
  mirrored = false,
}) {
  const [hov, setHov] = useState(false);
  const rotateDir = mirrored ? "3deg" : "-3deg";
  return (
    <button
      className="bc-btn inline-flex items-center gap-2 sm:gap-1 px-2 sm:h-[38px] lg:h-[55px] xl:h-[70px] lg:gap-3 rounded-[8px] pl-2.5"
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: D.orange,
        cursor: "pointer",
        boxShadow:
          "0px 2.73px 6.64px 0px #000000AD, inset 5.46px -5.46px 3.64px 0px #00000040, inset -3.64px 4.55px 3.64px 0px #FFFFFF40, -1.82px -0.91px 3.64px 0px #00000099",
        animation: hov ? "none" : "floatBounce 2s ease-in-out infinite",
        transform: hov
          ? `scale(1.08) rotate(${rotateDir})`
          : "scale(1) rotate(0deg)",
        transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        willChange: "transform",
      }}
    >
      <span className="bc-btn-text font-montserrat font-black sm:text-[13px] lg:text-[18px] xl:text-[23px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
        {label}
      </span>
      <Image
        src="/arrow-right.png"
        alt="arrow right"
        width={100}
        height={100}
        priority
        className="bc-btn-arrow object-contain sm:h-[18px] sm:w-[18px] lg:h-[45px] lg:w-[45px]"
      />
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
  priority = false,
}) {
  const [open, setOpen] = useState(false);
  // `flipping` is re-introduced (the previous removal noted "zero visual
  // benefit", but it actually gates whether this card promotes a stack of
  // GPU layers — see the BOOK WRAPPER block for the rationale).
  const [flipping, setFlipping] = useState(false);
  const router = useRouter();

  // ── Mirrored variants ──────────────────────────────────────────
  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const shadowPoints = mirrored
    ? COVER_SHADOW_POINTS_MIRROR
    : COVER_SHADOW_POINTS;
  const shadowTopTx = mirrored
    ? "translate(-1.35 -1.15)"
    : "translate(1.35 -1.15)";
  const shadowBotTx = mirrored ? "translate(0.55 1.2)" : "translate(-0.55 1.2)";

  const hingeEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPageEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPadding = mirrored ? INNER_PAD_MIRRORED : INNER_PAD_NORMAL;
  const transformOrigin = mirrored ? "right center" : "left center";
  const flipAngle = mirrored ? "120deg" : "-120deg";
  const stapleEdge = mirrored ? { right: "7%" } : { left: "7%" };
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };

  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";

  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";

  const coverTransition = `
    transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    opacity   ${D.fadeDur}ms ease ${speed - D.fadeDur}ms
  `;
  const coverTransform = open
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";

  return (
    // ── STAGE ────────────────────────────────────────────────────
    <div
      className={`relative flex items-center w-full box-border py-[4%] ${
        mirrored
          ? "justify-center md:justify-start"
          : "justify-center md:justify-end"
      }`}
      style={{
        perspective: "clamp(1400px, 489vw, 2200px)",
        WebkitPerspective: "clamp(1400px, 489vw, 2200px)", // [FIX-B]
        perspectiveOrigin: "50% 45%",
        WebkitPerspectiveOrigin: "50% 45%", // [FIX-B]
        isolation: "isolate", // [FIX-B2]
      }}
    >
      {/* ── BOOK WRAPPER ──────────────────────────────────────────
          3D context (preserve-3d / translateZ) is only enabled while the card
          is actively flipping. Safari promotes every element with a
          non-identity transform to its own GPU layer; with ~6 such elements
          per card × N cards, the compositor exhausted Retina memory and
          evicted layers during scroll — re-rasterizing them on scroll-back
          read as blank rectangles. When idle the card is plain 2D with
          explicit zIndex for stacking. */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          aspectRatio: `${width} / ${height}`,
          ...(flipping
            ? {
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d", // [FIX-B]
              }
            : null),
        }}
      >
        {/* ── BASE SHELL ── translateZ(-4px) keeps it behind cover */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: "1.8%",
            background: `linear-gradient(135deg, ${D.tealDark}, ${D.tealDeep})`,
            boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset -5px -6px 4px rgba(0,0,0,0.25),
              5px -6px 15.1px rgba(0,0,0,0.80),
              -2px 6px 11.3px rgba(0,0,0,0.80)
            `,
            ...(flipping
              ? {
                  transform: "translateZ(-4px)",
                  WebkitTransform: "translateZ(-4px)", // [FIX-B]
                }
              : null),
          }}
        />

        {/* ── STAPLES ── translateZ(5px) floats them above the cover */}
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            top: "1.5px",
            width: P.stapleW,
            height: P.stapleH,
            zIndex: 3,
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 -1px 0 rgba(255,255,255,0.3), 1px -1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px 5px 4.6px 0px #00000080",
            ...(flipping
              ? {
                  transform: "translateZ(5px)",
                  WebkitTransform: "translateZ(5px)", // [FIX-B]
                }
              : null),
          }}
        />
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            bottom: "1.5px",
            width: P.stapleW,
            height: P.stapleH,
            zIndex: 3,
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px -5px 4.6px 0px #00000080",
            ...(flipping
              ? {
                  transform: "translateZ(5px)",
                  WebkitTransform: "translateZ(5px)", // [FIX-B]
                }
              : null),
          }}
        />

        {/* ── INNER PAGE ── translateZ(-1px) hides it behind the cover.
            Only mounted once the user opens the card. Mounting it up-front
            meant every closed card on the home page was paying for an extra
            clipPath layer, an extra boxShadow, and an eagerly-decoded inner
            image — all invisible behind the cover. Safari/Retina would then
            drop card rasters under compositor memory pressure and re-paint
            them on scroll, which read as the "blank rectangle" flash. */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: P.coverPadV,
              bottom: P.coverPadV,
              ...innerPageEdge,
              zIndex: 1,
              transform: "translateZ(-1px)",
              WebkitTransform: "translateZ(-1px)", // [FIX-B]
              borderRadius: "3%",
              clipPath,
              WebkitClipPath: clipPath, // [FIX-B]
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: `linear-gradient(135deg, ${D.paper} 0%, #f5ecd9 100%)`,
                borderRadius: "1.1%",
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
                  rowGap: "clamp(8px,2vw,14px)",
                  boxSizing: "border-box",
                }}
              >
                <div className="bg-white flex flex-col items-center justify-center py-4 text-center border-4 rounded-3xl border-l-18 border-secondary transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                  <h1 className="font-anton text-2xl uppercase leading-tight text-primary hover:text-secondary">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="font-montserrat mt-4 text-sm font-bold uppercase text-secondary hover:text-primary">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="relative w-full bg-white overflow-hidden rounded-2xl border-4 border-secondary shadow-lg shadow-black/30 sm:shadow-xl my-6 sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                  <Image
                    src={imageSrc || "/images/hero.png"}
                    alt={imageAlt || title}
                    width={420}
                    height={280}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 768px) 90vw, 420px"
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
        )}

        {/* ── COVER PAGE ─────────────────────────────────────────
            3D / backface-visibility / willChange are only applied while the
            card is actively flipping. See BOOK WRAPPER comment for why. */}
        <div
          style={{
            position: "absolute",
            top: P.coverPadV,
            bottom: P.coverPadV,
            ...hingeEdge,
            zIndex: 2,
            transformOrigin,
            WebkitTransformOrigin: transformOrigin, // [FIX-B]
            borderRadius: "3%",
            opacity: open ? 0 : 1,
            transition: coverTransition,
            WebkitTransition: coverTransition, // [FIX-B]
            pointerEvents: open ? "none" : "auto",
            ...(flipping
              ? {
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d", // [FIX-B]
                  transform: coverTransform,
                  WebkitTransform: coverTransform, // [FIX-B]
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden", // [FIX-B]
                  willChange: "transform, opacity",
                }
              : null),
          }}
        >
          {/* Cover inner — translate3d(0,0,0.02px) required for
              backface-visibility to engage correctly on Safari */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              ...(flipping
                ? {
                    transform: "translate3d(0, 0, 0.02px)",
                    WebkitTransform: "translate3d(0, 0, 0.02px)", // [FIX-B]
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden", // [FIX-B]
                  }
                : null),
            }}
          >
            {/*
              ── EDGE SHADOW SVG ─────────────────────────────────
              Only mounted during the flip animation. The two feGaussianBlur
              passes were rasterising on the CPU on every page paint of every
              card — a heavy hidden cost on Safari/Retina for a shadow that
              is only visually meaningful while the cover is mid-rotation.
            */}
            {flipping && (
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
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
            )}

            {/* ── COVER SURFACE ── zIndex 1, covers the shadow polygon */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                background: "#0097A7",
                borderRadius: "3%",
                clipPath,
                WebkitClipPath: clipPath, // [FIX-B]
                overflow: "hidden",
                ...(flipping
                  ? {
                      transform: "translateZ(0.01px)",
                      WebkitTransform: "translateZ(0.01px)", // [FIX-B]
                    }
                  : null),
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
                  WebkitTransform: "translateY(-50%)", // [FIX-B]
                  height: "18%",
                  background: "#FE7702",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), 0px 4px 5.6px 0px #00000060, 0px -3px 6.2px 0px #00000099, inset -12px 0px 4.6px 0px #00000080, inset 12px 0px 4.6px 0px #00000080",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <p className="bc-band-text text-white text-center tracking-wider font-bold font-montserrat leading-[1.3] sm:text-[10px] lg:text-sm xl:text-lg 2xl:text-xl px-[6%] sm:px-[7%] [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
                  {subtitle}
                </p>
              </div>

              {/* UPPER HALF — icon + title */}
              <div
                className="absolute left-0 right-0 h-[36%] flex flex-col items-center justify-start"
                style={{ paddingTop: "7.5%" }}
              >
                <div className="bc-icon sm:h-[60px] md:h-[70px] lg:h-[90px] xl:h-[100px]">
                  <Image
                    src={icon}
                    alt={title}
                    width={120}
                    height={120}
                    priority={priority}
                    className={`object-contain w-full sm:h-[60px] md:h-[70px] lg:h-[90px] xl:h-[100px] floating-text cursor-pointer hover:scale-[1.1] transition-all duration-300 ${
                      mirrored ? "hover:rotate-3" : "hover:-rotate-3"
                    }`}
                  />
                </div>
                <h1
                  className="bc-title text-white font-bold text-center uppercase leading-[1.2] font-montserrat sm:text-[11px] lg:text-[16px] xl:text-[20px] px-[5%] drop-shadow-[4.31px_4.31px_4.31px_rgba(0,0,0,0.25)]"
                  style={{ paddingTop: "4%" }}
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
                className="absolute top-[63%] left-0 right-0 bottom-0 flex items-center justify-between flex-col"
                style={{ padding: "2% 4% 6.5%" }}
              >
                <p className="bc-desc text-white tracking-wider text-center font-montserrat leading-[1.3] font-semibold sm:text-[10px] lg:text-[14px] xl:text-lg 2xl:text-[17px] px-[1%]">
                  {description}
                </p>
                <LearnMoreButton
                  size="md"
                  label="Learn More"
                  mirrored={mirrored}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Enable the 3D context first (flipping=true), then on
                    // the next frame change `open` so CSS `transition: transform`
                    // interpolates from rotateY(0) to rotateY(flipAngle).
                    setFlipping(true);
                    requestAnimationFrame(() => setOpen(true));
                    if (slug) {
                      setTimeout(() => {
                        router.push(`/homebooks/${slug}`);
                      }, 1600);
                    }
                    setTimeout(() => setFlipping(false), speed + 300);
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
              width: P.spineW,
              background: spineGradient,
              pointerEvents: "none",
              opacity: open ? 1 : 0,
              transition: `opacity ${speed}ms ease`,
              WebkitTransition: `opacity ${speed}ms ease`, // [FIX-B]
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
