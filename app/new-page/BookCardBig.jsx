"use client";

import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./book-card.css";

const D = {
  w: 1016,
  h: 440,
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
  coverPadV: "6%",
  hingeH: "9.33%",
  openH: "3.5%",
  stapleW: "1.7%",
  stapleH: "30%",
  bandH: "19.37%",
  spineW: "1.78%",
};

const INNER_PAD_NORMAL = "5% 7%";
const INNER_PAD_MIRRORED = "5%";

const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)";
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";


export function LearnMoreButton({
  onClick,
  label = "Learn More",
  mirrored = false,
  inView = false,
}) {
  const [hov, setHov] = useState(false);
  const rotateDir = mirrored ? "3deg" : "-3deg";
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        animation: hov ? "none" : "floatBounce 2s ease-in-out infinite",
        transform: hov ? `scale(1.08) rotate(${rotateDir})` : "scale(1) rotate(0deg)",
        transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        willChange: "transform",
      }}
    >
      {/* Learn More button shadow */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0, left: 0,
          borderRadius: "8px",
          pointerEvents: "none",
          boxShadow: "0px 2.73px 6.64px 0px #000000AD, 0px -0.91px 5px 3px #00000099",
        }}
      />
      <button
        className="inline-flex items-center gap-2 sm:gap-1 px-2 sm:h-[38px] lg:h-[55px] xl:h-[70px] lg:gap-3 rounded-[8px] pl-2.5"
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          zIndex: 1,
          background: D.orange,
          cursor: "pointer",
          boxShadow:
            "inset 5.46px -5.46px 3.64px 0px #00000040, inset -3.64px 4.55px 3.64px 0px #FFFFFF40",
        }}
      >
        <span className="font-poppins font-black sm:text-[13px] lg:text-[18px] xl:text-[23px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
          {label}
        </span>
        <Image
          src="/arrow-right.png"
          alt=""
          width={100}
          height={100}
          priority
          className="object-contain sm:h-[18px] sm:w-[18px] lg:h-[45px] lg:w-[45px]"
        />
      </button>
    </div>
  );
}

function BookCardInner({
  title,
  subtitle,
  description,
  imageSrc,
  slug,
  speed = D.flipDur,
  width = D.w,
  height = D.h,
  icon,
  mirrored = false,
  priority = false,
}) {
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const stageRef = useRef(null);
  const coverRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;

  const hingeH = mirrored ? "7%" : "4%";
  const hingeEdge = mirrored
    ? { right: hingeH, left: P.openH }
    : { left: hingeH, right: P.openH };
  const innerPageEdge = mirrored
    ? { right: hingeH, left: P.openH }
    : { left: hingeH, right: P.openH };
  const innerPadding = mirrored ? INNER_PAD_MIRRORED : INNER_PAD_NORMAL;

  const transformOrigin = mirrored ? "right center" : "left center";

  const flipAngle = mirrored ? "78deg" : "-78deg";

  const stapleEdge = mirrored ? { right: "7%" } : { left: "3.5%" };
  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";
  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };

  const shadowClipPath = mirrored
    ? "polygon(0% 3.5%, 0.5% 0%, 100% 0%, 100% 100%, 14% 100%, 0% 88%)"
    : "polygon(0% 0%, 99.5% 0%, 100% 3.5%, 100% 75%, 90% 100%, 0% 100%)";

  const coverTransition = `
    transform ${speed}ms cubic-bezier(0.7,0,0.3,1),
    opacity   ${D.fadeDur}ms ease ${speed - D.fadeDur}ms
  `;
  const coverTransform = open
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";

  const handleLearnMore = (e) => {
    e.stopPropagation();
    setOpen(true);
    if (slug && coverRef.current) {
      const el = coverRef.current;
      const onTransitionEnd = (evt) => {
        if (evt.propertyName !== "transform") return;
        el.removeEventListener("transitionend", onTransitionEnd);
        router.push(`/homebooks/${slug}`);
      };
      el.addEventListener("transitionend", onTransitionEnd);
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative flex items-center w-full box-border py-[4%] justify-center"
      style={{
        perspective: "clamp(1400px, 489vw, 2200px)",
        WebkitPerspective: "clamp(1400px, 489vw, 2200px)",
        perspectiveOrigin: "50% 45%",
        WebkitPerspectiveOrigin: "50% 45%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          aspectRatio: `${width} / ${height}`,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
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

        {/* BASE SHELL */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: "7px",
            transform: "translateZ(-4px)",
            WebkitTransform: "translateZ(-4px)",
            background: `linear-gradient(135deg, ${D.tealDark}, ${D.tealDeep})`,
            boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset -5px -6px 4px rgba(0,0,0,0.25)
            `,
          }}
        />

        {/* STAPLES */}
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
              borderRadius: "7px",
              clipPath,
              WebkitClipPath: clipPath,
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

              <div className="relative w-full h-full bg-white rounded-2xl border-4 border-secondary shadow-lg shadow-black/30 sm:shadow-xl my-6 sm:shadow-black/40 md:shadow-2xl md:shadow-black/50">
                <img
                  src={imageSrc || "/images/hero.png"}
                  alt={title}
                  className="h-[250px] w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
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

        {/* COVER PAGE */}
        <div
          ref={coverRef}
          style={{
            position: "absolute",
            top: P.coverPadV,
            bottom: P.coverPadV,
            ...hingeEdge,
            transformOrigin,
            WebkitTransformOrigin: transformOrigin,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            borderRadius: "3%",
            transform: coverTransform,
            WebkitTransform: coverTransform,
            opacity: open ? 0.5 : 1,
            transition: coverTransition,
            WebkitTransition: coverTransition,
            pointerEvents: open ? "none" : "auto",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
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
              style={{
                position: "absolute",
                top: 0, right: mirrored ? -7 : -3, bottom: -14, left: mirrored ? -3 : -7,
                pointerEvents: "none",
                zIndex: 0,
                filter: "blur(3px)",
                transform: `translate(${mirrored ? "-3px" : "3px"}, -6px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, right: 0, bottom: 0, left: 0,
                  background: "rgba(0,0,0,0.64)",
                  clipPath: shadowClipPath,
                  WebkitClipPath: shadowClipPath,
                  borderRadius: 14
                }}
              />
            </div>

            {/* COVER SURFACE */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                background: "#0097A7",
                borderRadius: "8px",
                clipPath,
                WebkitClipPath: clipPath,
                overflow: "hidden",
                transform: "translateZ(0.01px)",
                WebkitTransform: "translateZ(0.01px)",
              }}
            >

              {/* UPPER HALF — icon + title */}
              <div className="flex flex-col items-center justify-start pt-2 lg:pt-6">
                <div className="sm:h-[50px] md:h-[60px] lg:h-[70px] xl:h-[90px]">
                  <Image
                    src={icon}
                    alt={title}
                    width={120}
                    height={120}
                    priority={priority}
                    style={{
                      animationPlayState: inView ? "running" : "paused",
                    }}
                    className={`object-contain w-full sm:h-[50px] md:h-[60px] lg:h-[70px] xl:h-[90px] floating-text cursor-pointer hover:scale-[1.1] transition-all duration-300 ${
                      mirrored ? "hover:rotate-10" : "hover:-rotate-10"
                    }`}
                  />
                </div>
                <h1 className="pt-3 text-white font-bold text-center uppercase leading-[1.2] font-montserrat sm:text-[11px] lg:text-[16px] xl:text-[22px] px-[5%] drop-shadow-[0px_2px_1px_rgba(0,0,0,0.85)] tracking-wider">
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
                      )
                    )}
                </h1>
              </div>

              {/* ORANGE BAND */}
              <div
                style={{
                  padding: "15px 0",
                  margin: "10px 0",
                  background: "#FE7702",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), 0px 4px 5.6px 0px #00000060, 0px -3px 6.2px 0px #00000099",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <p className="text-white text-center tracking-wider font-extrabold font-montserrat leading-[1.3] sm:text-[10px] lg:text-sm xl:text-lg 2xl:text-xl px-[4%] [text-shadow:1px_1px_2.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
                  {subtitle}
                </p>
              </div>

              {/* LOWER HALF — description + button */}
              <div
                className="flex items-center justify-between flex-col gap-4"
                style={{ padding: "0% 6% 2.5%" }}
              >
                <p className="text-white tracking-wider text-center font-montserrat leading-[1.3] font-semibold sm:text-[10px] lg:text-[12px] xl:text-[16px] px-[1%] [text-shadow:1px_0px_2.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
                  {description}
                </p>
                <LearnMoreButton
                  size="md"
                  label="Learn More"
                  mirrored={mirrored}
                  inView={inView}
                  onClick={handleLearnMore}
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
              WebkitTransition: `opacity ${speed}ms ease`,
              zIndex: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const BookCardBig = memo(BookCardInner);
export default BookCardBig;
