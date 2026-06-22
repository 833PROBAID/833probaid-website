"use client";

import { memo, useEffect, useState } from "react";
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
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";

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
  const isVideoWatch = label.includes("Video")
  return (
    <button
      className={`inline-flex items-center gap-2 sm:gap-1 px-2 h-[28px] md:h-[55px] xl:h-[70px] md:gap-3 rounded-sm md:rounded-[8px] pl-2.5 hover:${rotateDir} shadow-[0px_2.73px_6.64px_0px_rgba(0,0,0,0.68),2.46px_-2.46px_1.64px_0px_rgba(0,0,0,0.25)_inset,-2.64px_1.55px_1.64px_0px_rgba(255,255,255,0.25)_inset,-1.82px_-0.91px_3.64px_0px_rgba(0,0,0,0.6)] md:shadow-[0px_2.73px_6.64px_0px_rgba(0,0,0,0.68),5.46px_-5.46px_3.64px_0px_rgba(0,0,0,0.25)_inset,-3.64px_4.55px_3.64px_0px_rgba(255,255,255,0.25)_inset,-1.82px_-0.91px_3.64px_0px_rgba(0,0,0,0.6)]`}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: D.orange,
        cursor: "pointer",
        animation: hov ? "none" : "floatBounce 2s ease-in-out infinite",
        transform: hov
          ? `scale(1.08) rotate(${rotateDir})`
          : "scale(1) rotate(0deg)",
        transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        willChange: "transform",
      }}
    >
      <span className="font-montserrat font-black text-[8px] md:text-[18px] xl:text-[23px] uppercase text-white tracking-wide [text-shadow:0.5_1px_0.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)] md:[text-shadow:1px_3px_1.6px_rgba(0,0,0,0.82),0_0_6px_rgba(255,255,255,0.25)]">
        {" "}
        {label}
      </span>
      <Image
        src={isVideoWatch ? "/arrow-right-filled.png" : "/arrow-right.png"}
        alt="arrow right"
        width={100}
        height={100}
        priority
        className={`object-contain ${isVideoWatch ? 'w-3.5 md:w-8.25 h-3.5 md:h-10.25' : 'w-4.5 md:w-11.25 h-4.5 md:h-11.25'}`}
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
  const shadowClipPath = mirrored
    ? "polygon(0% 3.5%, 1.5% 0%, 100% 0%, 100% 100%, 14% 100%, 0% 88%)"
    : "polygon(0% 0%, 98.5% 0%, 100% 3.5%, 100% 88%, 86% 100%, 0% 100%)";
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
        perspective: "clamp(1400px, 489vw, 2200px)",
        WebkitPerspective: "clamp(1400px, 489vw, 2200px)",
        perspectiveOrigin: "50% 45%",
        WebkitPerspectiveOrigin: "50% 45%",
        isolation: "isolate",
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
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          containerType: "inline-size",
          // height: "clamp(245px, 140cqw, 750px)",
        }}
        className="book-wrapper h-64 sm:h-90 md:h-140 lg:h-187.5"
      >
        {/* BASE SHELL shadow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: -10,
            left: -10,
            borderRadius: "15px",
            filter: "blur(3px)",
            transform: "translate(6px, -5px) translateZ(-6px)",
            WebkitTransform: "translate(6px, -5px) translateZ(-6px)",
            background: "rgba(0,0,0,0.84)",
            pointerEvents: "none",
          }}
        />

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
          }}
          className="shadow-[inset_0_0_0_1px_#014E57,inset_0_6px_4px_rgba(255,255,255,0.25),inset_-5px_-6px_4px_rgba(0,0,0,0.25)] md:shadow-[inset_0_0_0_1px_#014E57,inset_0_6px_4px_rgba(255,255,255,0.25),inset_-5px_-6px_4px_rgba(0,0,0,0.25),4px_-4px_15.1px_rgba(0,0,0,0.90),-2px_6px_16.3px_rgba(0,0,0,0.98)]"
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
              className="p-2 md:p-4"
            >
              <BlogHero
                bannerImage={bannerImage}
                title={title}
                authorName={authorName}
                authorAvatar={authorAvatar}
                mirrored={mirrored}
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
            WebkitTransition: coverTransition,
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
            {/* Edge shadow */}
            <div
              className="-bottom-2 md:-bottom-3.75"
              style={{
                position: "absolute",
                top: 0,
                right: mirrored ? -10 : -2,
                // bottom: -15,
                left: mirrored ? -2 : -10,
                pointerEvents: "none",
                zIndex: 0,
                filter: "blur(4px)",
                transform: `translate(${mirrored ? "-1.35%" : "1.35%"}, -1.15%)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: "rgba(0,0,0,0.74)",
                  clipPath: shadowClipPath,
                  WebkitClipPath: shadowClipPath,
                  borderRadius: 20,
                }}
              />
            </div>

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
              <div className="absolute left-0 right-0 flex flex-col items-center justify-start h-full  md:p-6 p-3 md:gap-6 gap-2.5">
                <div
                  className={` w-full relative  overflow-hidden transition-all duration-300 rounded-lg md:rounded-xl border-[#FE7702] border md:border-4 shadow-[0_0_4px_3px_rgba(0,0,0,0.6)] md:shadow-[0_0_16px_4px_rgba(0,0,0,0.8)]`}
                  style={{
                    height: "clamp(90px, 50cqw, 275px)",
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
                  className="font-montserrat text-black  font-semibold pl-1 md:pl-2 "
                  style={{ fontSize: "clamp(6px, 4cqw, 24px)" }}
                >
                  {title}
                </h2>
                {/* Author Name */}
                <div className="w-full lg:mt-5 -mt-1 md:mt-2">
                  <hr className="w-full h-[2px] border-[#14b3c2] border rounded-full" />
                  <div className="flex items-center gap-1 md:gap-3 w-full justify-start mt-1 md:mt-2">
                    <img
                      src={'/avatar.png'}
                      alt={authorName}
                      className="border-primary border-[0.5px] md:border-2 w-3.5 md:w-10"
                      style={{
                        aspectRatio: "1/1",
                        borderRadius: "50%",
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
                        fontSize: "clamp(.4rem, 3cqw, 21px)",
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
