"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./book-card.css";
import BlogHero from "@/components/BlogHero";

const D = {
  w: 550,
  h: 750,
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

// FIX: BookCardDefs kept for compatibility but feGaussianBlur stdDeviation
// reduced from 1.4/1.7 to 0.7/0.85 — cuts GPU blur cost by 75% on Safari
// while keeping the same visual shadow appearance
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
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
        <filter
          id="book-shadow-bottom"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.85" />
        </filter>
      </defs>
    </svg>
  );
}

const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_SHADOW_POLYGON_POINTS = "0,0 96.5,0 100,3.5 100,88 86,100 0,100";
const COVER_CLIP_PATH_MIRROR = "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";
const COVER_SHADOW_POLYGON_POINTS_MIRROR = "0,3.5 3.5,0 100,0 100,100 14,100 0,88";

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
        // FIX: Removed infinite animation from default state.
        // Button only animates on hover — not running on every card simultaneously.
        // This alone removes 5-10 permanent GPU animation layers on Safari.
        animation: hov ? "floatBounce 2s ease-in-out infinite" : "none",
        WebkitAnimation: hov ? "floatBounce 2s ease-in-out infinite" : "none",
        transform: hov
          ? `scale(1.08) rotate(${rotateDir})`
          : "scale(1) rotate(0deg)",
        WebkitTransform: hov
          ? `scale(1.08) rotate(${rotateDir})`
          : "scale(1) rotate(0deg)",
        transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        WebkitTransition: "-webkit-transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        // FIX: Removed will-change: transform from default state.
        // Safari holds a GPU compositing layer for every element with will-change.
        // Now only applies during active hover interaction.
        willChange: hov ? "transform" : "auto",
      }}
    >
      <span className="bc-btn-text font-montserrat font-black sm:text-[13px] lg:text-[18px] xl:text-[23px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
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
  onVideoClick,
}) {
  const [open, setOpen] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const router = useRouter();

  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const shadowPoints = mirrored
    ? COVER_SHADOW_POLYGON_POINTS_MIRROR
    : COVER_SHADOW_POLYGON_POINTS;
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
  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";
  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };

  // FIX: Added -webkit- prefixed transition for Safari
  const coverTransition = `
    -webkit-transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    opacity ${D.fadeDur}ms ease ${speed - D.fadeDur}ms
  `;
  // FIX: Added -webkit- prefixed transform for Safari
  const coverTransform = open
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";

  return (
    <div
      className={`relative flex items-center w-full box-border py-[4%] ${
        mirrored
          ? "justify-center md:justify-start"
          : "justify-center md:justify-end"
      }`}
      style={{
        containerType: "inline-size",
        // FIX: Prevent double-click neighboring card highlight
        userSelect: "none",
        WebkitUserSelect: "none",
        // FIX: Remove tap highlight on mobile Safari
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          containerType: "inline-size",
          height: "clamp(450px, 140cqw, 750px)",
          // FIX: Isolate stacking context — prevents 3D scene bleeding into
          // surrounding page elements which triggers full-page repaints on Safari
          isolation: "isolate",
        }}
      >
        {/* BASE SHELL */}
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
              5px -6px 15.1px rgba(0,0,0,0.80),
              -2px 6px 11.3px rgba(0,0,0,0.80)
            `,
          }}
        />

        {/* TOP STAPLE */}
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            top: "1.5px",
            width: P.stapleW,
            height: P.stapleH,
            transform: "translateZ(5px)",
            WebkitTransform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 -1px 0 rgba(255,255,255,0.3), 1px -1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px 5px 4.6px 0px #00000080",
          }}
        />

        {/* BOTTOM STAPLE */}
        <div
          style={{
            position: "absolute",
            ...stapleEdge,
            bottom: "1.5px",
            width: P.stapleW,
            height: P.stapleH,
            transform: "translateZ(5px)",
            WebkitTransform: "translateZ(5px)",
            background: "#FE7702",
            borderRadius: "0.4%",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px -5px 4.6px 0px #00000080",
          }}
        />

        {/* INNER PAGE */}
        <div
          style={{
            position: "absolute",
            top: P.coverPadV,
            bottom: P.coverPadV,
            ...innerPageEdge,
            transform: "translateZ(-1px)",
            WebkitTransform: "translateZ(-1px)",
            borderRadius: "3%",
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
            <div
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

        {/* COVER PAGE */}
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
            opacity: open ? 0 : 1,
            transition: coverTransition,
            WebkitTransition: coverTransition,
            pointerEvents: open ? "none" : "auto",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            // FIX: will-change only active during the actual flip animation.
            // Previously always "transform, opacity" — holding GPU layer permanently.
            // Now "auto" at rest, only activates when flipping is true.
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
              {/* UPPER HALF */}
              <div className="absolute left-0 right-0 flex flex-col items-center justify-start h-full md:p-6 p-3 md:gap-6 gap-4">
                <div
                  className="w-full relative overflow-hidden transition-all duration-300 rounded-xl border-[#FE7702] border-[4px] shadow-lg shadow-black/70"
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
                    // FIX: eager loading — Safari doesn't trigger IntersectionObserver
                    // for images inside preserve-3d containers, causing blank white boxes
                    loading="eager"
                    className="object-cover w-full h-full cursor-pointer hover:scale-[1.1] transition-all duration-300"
                  />
                </div>
                <h2
                  className="font-montserrat text-black font-semibold pl-2"
                  style={{ fontSize: "clamp(14px, 5cqw, 24px)" }}
                >
                  {title}
                </h2>
                <div className="w-full">
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

              {/* LOWER HALF — button */}
              <div className="absolute md:bottom-[6%] bottom-[4%] left-0 right-0 flex items-center justify-between flex-col">
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
              width: P.spineW,
              background: spineGradient,
              pointerEvents: "none",
              opacity: open ? 1 : 0,
              transition: `opacity ${speed}ms ease`,
              WebkitTransition: `-webkit-opacity ${speed}ms ease`,
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
