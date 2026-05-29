"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./book-card.css";
import BlogHero from "@/components/BlogHero";

// ══════════════════════════════════════════════════════════════════
//  DESIGN CONFIG — every visual value lives here.
//  Change a number or color; it applies everywhere instantly.
//  Max card: 450 × 700 px  (aspect-ratio: 450 / 700 = 9 / 14)
//  All layout values are expressed as % of those dimensions.
// ══════════════════════════════════════════════════════════════════
const D = {
  // Card max size (px) — used only for maxWidth and aspect-ratio
  w: 550,
  h: 750,

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
  stapleW: "4.2%", // 20/450
  stapleH: "23%", // 180/700

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
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
        <filter
          id="book-shadow-bottom"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
    </svg>
  );
}

// Clip-paths stay in percentage units — they already are ✓
const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_SHADOW_POLYGON_POINTS = "0,0.2 96,0 99,1.9 99.5,87.4 85,100 -1,100";
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";
const COVER_SHADOW_POLYGON_POINTS_MIRROR =
  "0,2 3,0 100,0 100,100 14,100 0.1,88";

// ── LearnMoreButton ───────────────────────────────────────────────
// All sizes use clamp() so the button scales with the card.
// Arrow/gap values kept as numbers (px) for the layout math but overridden
// visually via style on the <Image>.

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
      className={`bc-btn inline-flex items-center gap-2 sm:gap-1 px-2 sm:h-[38px] lg:h-[55px] xl:h-[70px] lg:gap-3 rounded-[8px] pl-2.5 hover:${rotateDir}`}
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
      <span className="bc-btn-text   font-montserrat font-black sm:text-[13px] lg:text-[18px] xl:text-[23px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
        {" "}
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
  bannerImage,
  authorAvatar,
  authorName,
  onLearnMore,
  slug,
  speed = D.flipDur,
  width = D.w,
  height = D.h,
  mirrored,
  priority = false,
  onVideoClick, // optional callback for watch video button
}) {
  const [open, setOpen] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const router = useRouter();

  // ── Mirrored variants ──────────────────────────────────────────
  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const shadowPoints = mirrored
    ? COVER_SHADOW_POLYGON_POINTS_MIRROR
    : COVER_SHADOW_POLYGON_POINTS;
  const shadowTopTx = mirrored
    ? "translate(-1.35 -1.15)"
    : "translate(1.35 -1.15)";
  const shadowBotTx = mirrored ? "translate(0.55 1.2)" : "translate(-0.55 1.2)";

  // Hinge/page edges — now pure percentages
  const hingeEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPageEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const innerPadding = mirrored ? INNER_PAD_MIRRORED : INNER_PAD_NORMAL;

  const transformOrigin = mirrored ? "right center" : "left center";
  const flipAngle = mirrored ? "85deg" : "-85deg";
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
      className={`relative flex items-center w-full box-border py-[4%]  ${
        mirrored
          ? "justify-center md:justify-start"
          : "justify-center md:justify-end"
      }`}
      style={{
        containerType: "inline-size",
      }}
    >
      {/* ── BOOK WRAPPER ─────────────────────────────────────────── */}
      {/* width: 100% up to max; aspect-ratio locks height proportionally */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          // aspectRatio: `${width} / ${height}`,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          containerType: "inline-size",
          height: "clamp(450px, 140cqw, 750px)",
        }}
      >
        {/* ── BASE SHELL: always visible teal frame ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: "1.8%",
            transform: "translateZ(-4px)",
            WebkitTransform: "translateZ(-4px)",
            background: `linear-gradient(135deg, ${D.tealDark}, ${D.tealDeep})`,
            boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset -5px -6px 4px rgba(0,0,0,0.25),
              4px -4px 15.1px rgba(0,0,0,0.90),
              -2px 6px 16.3px rgba(0,0,0,0.98)
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
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: `linear-gradient(135deg, ${D.paper} 0%, #f6f4f1ff 100%)`,
              borderRadius: "1.1%",
              boxShadow: innerBoxShadow,
              overflow: "hidden",
            }}
          >
            {/* Hero image */}
            {/* <div className="relative w-full bg-white overflow-hidden rounded-2xl border-4 border-secondary shadow-lg shadow-black/30 sm:shadow-xl my-6 sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                <img
                  src={bannerImage || "/images/hero.png"}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>
              <h1 className="font-anton text-2xl uppercase leading-tight text-primary hover:text-secondary">
                {title}
              </h1> */}

            {/* {description && (
                <div className="p-4 bg-white rounded-2xl border-4 border-secondary mt-4">
                  <p className="text-secondary font-semibold text-sm">
                    {description}
                  </p>
                </div>
              )} */}
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width: "100%", height: "100%" }}
              className="p-4"
            >
              <BlogHero
                bannerImage={bannerImage}
                title={title}
                authorName={authorName}
                authorAvatar={authorAvatar}
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "unset",
                }}
                isCard={true}
              />
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
            WebkitTransformOrigin: transformOrigin,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            borderRadius: "2%",
            transform: coverTransform,
            WebkitTransform: coverTransform,
            opacity: open ? 0.5 : 1,
            transition: coverTransition,
            pointerEvents: open ? "none" : "auto",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: flipping ? "transform, opacity" : "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
                top: "-2px",
                right: 0,
                bottom: 0,
                left: "-4px",
                width: "102.5%",
                height: "101.1%",
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
                opacity="0.74"
                transform={shadowBotTx}
                filter="url(#book-shadow-bottom)"
              />
            </svg>

            {/* Cover surface */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                background: "#fff",
                borderRadius: "3%",
                clipPath,
                WebkitClipPath: clipPath,
                overflow: "hidden",
                transform: "translateZ(0.01px)",
                WebkitTransform: "translateZ(0.01px)",
              }}
            >
              {/* UPPER HALF — icon + title */}
              <div className="absolute left-0 right-0 flex flex-col items-center justify-start h-full  md:p-6 p-3 md:gap-6 gap-4 ">
                <div
                  className={` w-full  relative  overflow-hidden transition-all duration-300 rounded-xl border-[#FE7702] border-[4px] shadow-lg shadow-black/70`}
                  style={{
                    height: "clamp(120px, 50cqw, 275px)",
                    width: "100%",
                  }}
                >
                  <Image
                    src={bannerImage || "/images/hero.png"}
                    alt={title}
                    width={1000}
                    height={1000}
                    priority={priority}
                    className={`object-cover w-full  h-full  cursor-pointer hover:scale-[1.1] transition-all duration-300  `}
                  />
                </div>
                <h2
                  className="font-montserrat text-black  font-semibold pl-2 "
                  style={{ fontSize: "clamp(14px, 5cqw, 24px)" }}
                >
                  {title}
                </h2>
                {/* Author Name */}
                <div className="w-full ">
                  <hr className="w-full h-[2px] border-[#14b3c2] border rounded-full" />
                  <div className="flex items-center gap-3 w-full justify-start mt-2">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="border-primary border-2"
                      style={{
                        width: "clamp(25px, 50cqw, 40px)",
                        aspectRatio: "1/1",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        alignSelf: "center",
                      }}
                    />
                    <span
                      className="font-poppins font-semibold text-gray-500"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        lineHeight: 1.2,
                        alignSelf: "center",
                        fontSize: "clamp(.8rem, 5cqw, 21px)",
                      }}
                    >
                      {authorName}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOWER HALF — description + button */}
              <div className="absolute md:bottom-[6%] bottom-[4%] left-0 right-0 flex items-center justify-between flex-col">
                {/* <p className="bc-desc text-white tracking-wider text-center font-montserrat leading-[1.3] font-semibold sm:text-[10px] lg:text-[14px] xl:text-lg 2xl:text-[17px] px-[1%]">
                  {description}
                </p> */}
                {mirrored ? (
                  <LearnMoreButton
                    size="md"
                    label="Watch Video"
                    mirrored={mirrored}
                    onClick={(e) => {
                      e.stopPropagation();
                      onVideoClick && onVideoClick();
                    }}
                  />
                ) : (
                  <LearnMoreButton
                    size="md"
                    label="Read Article"
                    mirrored={mirrored}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlipping(true);
                      setOpen(true);
                      if (slug) {
                        setTimeout(() => {
                          router.push(`/blogs/${slug}`);
                        }, 1600);
                      }
                      setTimeout(() => setFlipping(false), speed + 300);
                    }}
                  />
                )}
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
