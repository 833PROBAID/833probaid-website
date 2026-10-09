"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { D, LearnMoreButton, P } from "@/app/blogs/BlogCardNew";

/**
 * The guide download block that follows the authored `.guide-cards` row in the
 * Resource Center home book.
 *
 * Shell, staples, chamfer and palette are the /blogs book card's — imported
 * from it rather than restated, so the two stay in step. The opening is the
 * home page grid book's (`app/new-page/NewBook.jsx`), layer for layer: a
 * `perspective` stage, a `preserve-3d` wrapper, and depth handed to each layer
 * by `translateZ` rather than `z-index`.
 *
 *   stage            perspective: clamp(1400px, 489vw, 2200px)
 *   ├─ shell shadow  translateZ(-6px)
 *   ├─ base shell    translateZ(-4px)   — never moves; the back of the book
 *   ├─ staples       translateZ(+5px)   — float above the turning cover
 *   ├─ inner sheet   translateZ(-1px)   — revealed as the cover swings off,
 *   │                                     carrying the guide's first interior
 *   │                                     page (`<guide>-guide-inside.jpg`)
 *   └─ cover         rotateY(0 → ∓85deg), fading to 0.5 at the end
 *
 * The cover is driven by a plain CSS transition on `transform`, so there are no
 * keyframes involved — the `hc-*` skew/scaleX animations in global.css belong
 * to the retired HomeCard and are deliberately not used here.
 */

const COVER_CLIP_PATH = "polygon(0 0, 100% 0, 100% 88%, 86% 100%, 0 100%)";
const COVER_CLIP_PATH_MIRROR =
  "polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 88%)";

/** The home page grid passes `speed={3000}` to every book. */
const FLIP_MS = 3000;

/**
 * NewBook hands over at `speed - 800`, mid-flip, because `router.push` is a
 * client-side transition the cover keeps turning through. Ours is a document
 * navigation to the PDF, which would freeze the cover where it stood, so both
 * the save and the hand-off wait for the flip to land: the click only opens the
 * book, then the file is saved, then the viewer follows it.
 */
const SAVE_MS = FLIP_MS - 700;

/**
 * The gap between firing the save and leaving the page. The download is handed
 * to the browser's download manager rather than the navigation stack, so it
 * outlives the hand-off — but only once it has actually been handed over, which
 * is a task or two after `link.click()` returns.
 */
const HANDOFF_MS = FLIP_MS - 500;

const GUIDES = [
  {
    key: "seller",
    mirrored: false,
    cover: "/seller-guide.png",
    alt: "Luxury Collective Home Seller's Guide cover",
    inside: "/seller-guide.png",
    insideAlt: "A page from the Luxury Collective Home Seller's Guide",
    caption:
      "How we position your property for faster sales, stronger offers, and maximum value.",
    label: "Download Sellers Guide",
    href: "/books/seller-guide.pdf",
    fileName: "833PROBAID-Sellers-Guide.pdf",
  },
  {
    key: "buyer",
    mirrored: true,
    cover: "/buyer-guide.png",
    alt: "Luxury Collective Home Buyer's Guide cover",
    inside: "/buyer-guide.png",
    insideAlt: "A page from the Luxury Collective Home Buyer's Guide",
    caption:
      "What to expect from the first showing to closing day, and how to navigate it with full confidence.",
    label: "Download Buyers Guide",
    href: "/books/buyer-guide.pdf",
    fileName: "833PROBAID-Buyers-Guide.pdf",
  },
];

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
	  className="w-4 md:w-12"
    >
      <g clipPath="url(#clip0_2220_40)">
        <g filter="url(#filter0_dd_2220_40)">
          <path
            d="M36 51L17.25 32.25L22.5 26.8125L32.25 36.5625V6H39.75V36.5625L49.5 26.8125L54.75 32.25L36 51ZM13.5 66C11.4375 66 9.6725 65.2662 8.205 63.7987C6.7375 62.3312 6.0025 60.565 6 58.5V47.25H13.5V58.5H58.5V47.25H66V58.5C66 60.5625 65.2663 62.3287 63.7988 63.7987C62.3312 65.2687 60.565 66.0025 58.5 66H13.5Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dd_2220_40"
          x="2"
          y="4"
          width="69"
          height="70"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.96 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2220_40"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_2220_40"
            result="effect2_dropShadow_2220_40"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_2220_40"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_2220_40">
          <rect width="72" height="72" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function GuideCard({ guide }) {
  const { mirrored } = guide;
  const [isOpening, setIsOpening] = useState(false);
  // Set for the single frame that shuts the book on a bfcache restore, so the
  // cover snaps back instead of taking the full 3s turning itself closed.
  const [snapShut, setSnapShut] = useState(false);
  // Every pending timer of the current open, so a bfcache restore or an
  // unmount can cancel both the save and the hand-off at once.
  const timersRef = useRef([]);

  /**
   * The hand-off is a document navigation, so coming back from the PDF is a
   * back/forward-cache restore, not a fresh load: React never remounts and the
   * card is handed back exactly as it left — cover open, `isOpening` still
   * true. `pageshow` is the only signal for that restore (no mount, no
   * `popstate` for a document navigation), so close the book there.
   */
  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted) return;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setSnapShut(true);
      setIsOpening(false);
    };

    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // Hand the transition back once the closed transform has been painted. Two
  // frames: the first is the commit that applies `transition: none` together
  // with rotateY(0), the second re-arms the turn for the next click.
  useEffect(() => {
    if (!snapShut) return;
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSnapShut(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [snapShut]);

  const clipPath = mirrored ? COVER_CLIP_PATH_MIRROR : COVER_CLIP_PATH;
  const hingeEdge = mirrored
    ? { right: P.hingeH, left: P.openH }
    : { left: P.hingeH, right: P.openH };
  const stapleEdge = mirrored ? { right: "7%" } : { left: "7%" };
  const spineEdge = mirrored ? { right: 0 } : { left: 0 };
  const shadowClipPath = mirrored
    ? "polygon(0% 3.5%, 1.5% 0%, 100% 0%, 100% 100%, 14% 100%, 0% 88%)"
    : "polygon(0% 0%, 98.5% 0%, 100% 3.5%, 100% 88%, 86% 100%, 0% 100%)";

  // The cover is already inset to the staple line, so its own leading edge is
  // the hinge the rotation turns on.
  const transformOrigin = mirrored ? "right center" : "left center";
  const flipAngle = mirrored ? "85deg" : "-85deg";

  const coverTransform = isOpening
    ? `translate3d(0, 0, 0.01px) rotateY(${flipAngle})`
    : "translate3d(0, 0, 0.01px) rotateY(0deg)";
  const coverTransition = snapShut
    ? "none"
    : `transform ${FLIP_MS}ms cubic-bezier(0.7,0,0.3,1), opacity ${
        D.fadeDur
      }ms ease ${FLIP_MS - D.fadeDur}ms`;
  const spineTransition = snapShut ? "none" : `opacity ${FLIP_MS}ms ease`;

  const spineGradient = mirrored
    ? "linear-gradient(270deg, rgba(0,0,0,0.4), transparent)"
    : "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)";
  const innerBoxShadow = mirrored
    ? "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset 4px 0 10px rgba(0,0,0,0.12), inset -2px 0 8px rgba(180,160,120,0.18)"
    : "inset 0 0 0 1px rgba(0,0,0,0.07), inset 0px 6px 6px rgba(255,255,255,0.14), inset 0px -6px 10px rgba(0,0,0,0.18), inset -4px 0 10px rgba(0,0,0,0.12), inset 2px 0 8px rgba(180,160,120,0.18)";

  const staple = (edge) => (
    <div
      key={edge}
      aria-hidden="true"
      style={{
        position: "absolute",
        ...stapleEdge,
        [edge]: "1.5px",
        width: P.stapleW,
        height: P.stapleH,
        transform: "translateZ(5px)",
        WebkitTransform: "translateZ(5px)",
        background: D.orange,
        borderRadius: "0.4%",
        pointerEvents: "none",
        boxShadow:
          edge === "top"
            ? "inset 0 -1px 0 rgba(255,255,255,0.3), 1px -1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px 5px 4.6px 0px #00000080"
            : "inset 0 1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,0.25), 4px 0px 4.22px 0px #0000009C, -4px 0px 4.22px 0px #0000009C, inset 0px -5px 4.6px 0px #00000080",
      }}
    />
  );

  /**
   * Opens the book, saves the PDF as the cover lands, then hands the viewer the
   * file. Nothing but the turn happens on click — the save is held back to the
   * end of the flip so the book opening, the file arriving and the viewer
   * following read as one gesture in that order; `download` is honoured because
   * the PDFs are served from /public, same origin.
   */
  const handleDownload = (e) => {
    e.stopPropagation();
    if (isOpening) return;

    setIsOpening(true);

    timersRef.current.push(
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = guide.href;
        link.download = guide.fileName;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, SAVE_MS),
      setTimeout(() => {
        window.location.href = guide.href;
      }, HANDOFF_MS)
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {/* ── STAGE: the perspective every layer below is read through ── */}
      <div
        className={`relative flex items-center w-full box-border ${
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
        {/* ── BOOK WRAPPER: holds the 3D rendering context ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            // maxWidth: D.w,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            containerType: "inline-size",
          }}
          className="h-130 md:h-140 lg:h-164 xl:h-180"
        >
          {/* BASE SHELL shadow */}
          <div
            aria-hidden="true"
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

          {/* BASE SHELL: the teal frame stays put — it is the back of the book */}
          <div
            aria-hidden="true"
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

          {/* ── SPINE STAPLES: +5px, so they ride over the turning cover ── */}
          {staple("top")}
          {staple("bottom")}

          {/* ── INNER SHEET: sits just behind the cover, revealed as it swings ── */}
          <div
            style={{
              position: "absolute",
              top: P.coverPadV,
              bottom: P.coverPadV,
              ...hingeEdge,
              transform: "translateZ(-1px)",
              WebkitTransform: "translateZ(-1px)",
              borderRadius: "3%",
              clipPath,
              WebkitClipPath: clipPath,
              pointerEvents: "none",
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
                background: `linear-gradient(135deg, ${D.paper} 0%, #f6f4f1 100%)`,
                borderRadius: "1.1%",
                boxShadow: innerBoxShadow,
                overflow: "hidden",
              }}
            >
              {/* The revealed page. Contained rather than cropped: the
							    scan is 8.5×11 and the sheet is squatter, so covering it
							    would cut the footer off — the leftover paper gradient
							    reads as the page's margin. */}
              <div className="absolute inset-0 flex items-center justify-center p-[3%]">
                <Image
                  src={guide.inside}
                  alt={guide.insideAlt}
                  width={935}
                  height={1210}
                  sizes="(max-width: 768px) 45vw, 30vw"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* ── COVER PAGE: the one layer that turns ── */}
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
              opacity: isOpening ? 0.5 : 1,
              transition: coverTransition,
              WebkitTransition: coverTransition,
              pointerEvents: "none",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: isOpening ? "transform, opacity" : "auto",
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
                  left: mirrored ? -2 : -10,
                  pointerEvents: "none",
                  zIndex: 0,
                  filter: "blur(4px)",
                  transform: `translate(${
                    mirrored ? "-1.35%" : "1.35%"
                  }, -1.15%)`,
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

              {/* COVER SURFACE */}
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
                <div className="absolute inset-0 flex flex-col items-center px-3 md:px-4 top-[3%]">
                  {/* Cover art — the PNG carries its own orange frame, so it is
									    contained rather than cropped into a bordered well. */}
                  <div className="flex min-h-0 w-full items-center justify-center pb-[3%]">
                    <Image
                      src={guide.cover}
                      alt={guide.alt}
                      width={519}
                      height={619}
                      className="h-auto w-full"
                    />
                  </div>

                  <hr className="w-full h-[0.5px] border-[#14b3c2] border [box-sizing:unset] px-6.25 bg-primary" />

                  <p
                    className={`${mirrored ? 'pl-4 pr-1' : 'pr-4 pl-1'} font-montserrat flex-1 w-full text-center flex items-center mt-[-0.3em] leading-[1.6] font-bold text-[1rem] md:text-[1.2rem] lg:text-[1.275rem]`}
                  >
                    {guide.caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Spine shadow strip — fades in across the turn */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                ...spineEdge,
                top: 0,
                bottom: 0,
                width: P.spineW,
                background: spineGradient,
                pointerEvents: "none",
                opacity: isOpening ? 1 : 0,
                transition: spineTransition,
                WebkitTransition: spineTransition,
                zIndex: 2,
              }}
            />
          </div>
        </div>
      </div>

      <LearnMoreButton
        size="md"
        label={guide.label}
        mirrored={mirrored}
        icon={<DownloadIcon />}
        // Three words where the blog grid has two, so the type steps down a
        // tier; past that the label wraps rather than clipping, since the
        // button shrink-to-fits inside the column.
        textClassName="text-[12px] md:text-[15px] lg:text-[18px] xl:text-[21px] leading-tight text-center"
		wrapperClassName={`${!mirrored ? 'flex-row-reverse' : ''} w-full justify-center`}
        onClick={handleDownload}
      />
    </div>
  );
}

export default function GuideDownloadCards() {
  return (
    <div className="font-montserrat mt-8 mb-4">
      <div className="grid md:grid-cols-2 gap-10 xl:gap-16 mx-1">
        {GUIDES.map((guide) => (
          <GuideCard key={guide.key} guide={guide} />
        ))}
      </div>
    </div>
  );
}
