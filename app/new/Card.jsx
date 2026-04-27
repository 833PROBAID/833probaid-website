import React, { memo, useLayoutEffect, useRef, useState } from "react";
import "./card.css";

/**
 * useFitScale — measures the host element's width and returns a scale
 * factor relative to a native design width. Updates on resize.
 */
function useFitScale(nativeWidth = 620) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || nativeWidth;
      setScale(w / nativeWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [nativeWidth]);

  return [ref, scale];
}

/**
 * ProBaidCard
 * --------------------------------------------------------------
 * 1:1 recreation of the Figma "833PROBAID Card" design.
 *
 * Props:
 *   title      — top headline   (e.g. "Contact Us")
 *   subtitle   — secondary line (e.g. "—Get in Touch")
 *   body       — paragraph copy
 *   ctaLabel   — text inside the orange button
 *   onCtaClick — click handler
 *   bgSrc      — exported decorative orange BG image (PNG/WebP/SVG)
 *   icon       — optional ReactNode (defaults to ContactBookIcon)
 *
 * The component is React.memo'd so re-rendering 18 of them
 * costs nothing when parent state changes.
 */
function ProBaidCardImpl({
  title = "Contact Us",
  subtitle = "—Get in Touch",
  body = "Get in touch with our team for any inquiries or further assistance.",
  ctaLabel = "Learn More",
  onCtaClick,
  icon,
  className = "",
  style,
}) {
  const [hostRef, scale] = useFitScale(620);
  return (
    <article
      ref={hostRef}
      className={`pb-card ${className}`.trim()}
      style={{ ...style, "--pb-scale": scale }}
      aria-label={title}
    >
      <div className="pb-card__stage">
        {/* Layer 1 — outer teal frame */}
        <div className="pb-card__frame" aria-hidden="true" />

        {/* Layer 2 — inner cut-corner panel */}
        <div className="pb-card__panel" aria-hidden="true" />

        {/* Layer 3 — exported decorative BG image (sits above the panel) */}
          <img
            className="Card_BG"
            src="/Card_BG.png"
            alt=""
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />

        {/* Orange header ribbon */}
        <div className="pb-card__ribbon" aria-hidden="true" />

        {/* Orange tabs on the left edge */}
        <div className="pb-card__tab--left-top" aria-hidden="true" />
        <div className="pb-card__tab--left-bottom" aria-hidden="true" />

        {/* Text content */}
        <h2 className="pb-card__title">{title}</h2>
        <p className="pb-card__subtitle">{subtitle}</p>

        {/* Icon */}
        <div className="pb-card__icon">
          {icon ?? <ContactBookIcon />}
        </div>

        <p className="pb-card__body">{body}</p>

        {/* CTA */}
        <button
          type="button"
          className="pb-card__cta"
          onClick={onCtaClick}
        >
          <span className="pb-card__cta-bg" aria-hidden="true" />
          <span className="pb-card__cta-label">{ctaLabel}</span>
          <svg
            className="pb-card__cta-arrow"
            viewBox="0 0 45 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 12h40m0 0L31 2m11 10L31 22"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}

const ProBaidCard = memo(ProBaidCardImpl);
export default ProBaidCard;

/* ----------------------------------------------------------------
   ContactBookIcon — inline SVG fallback (no external file needed).
   Keeps you to ONE network request per card (the BG image).
   ---------------------------------------------------------------- */
export function ContactBookIcon() {
  return (
    <svg
      viewBox="0 0 153 163"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* book body */}
      <rect
        x="13"
        y="10"
        width="127"
        height="143"
        rx="10"
        fill="#fff"
        stroke="#000"
        strokeWidth="6"
      />
      {/* spine */}
      <path d="M22 10 V153" stroke="#000" strokeWidth="6" />
      {/* head */}
      <circle cx="78" cy="60" r="15" fill="#fff" stroke="#000" strokeWidth="6" />
      {/* shoulders */}
      <path
        d="M55 110 C55 92 101 92 101 110 V120 H55 Z"
        fill="#fff"
        stroke="#000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
