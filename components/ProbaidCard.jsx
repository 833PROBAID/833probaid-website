"use client";
export default function ProbateCard() {
    /* ── color tokens ────────────────────────────────────────────── */
    const TEAL_TOP      = "#0A8F9E";   // slightly deeper / more saturated
    const TEAL_BOTTOM   = "#006F7C";
    const TEAL_BORDER   = "#00737F";
    const ORANGE        = "#FE7702";
    const ORANGE_SHADOW = "#B85500";
  
    /* ── shadow tokens ───────────────────────────────────────────── */
    // Tighter, punchier shadow matching Figma — stronger, less blurry.
    const OUTER_DROP_SHADOWS =
      "drop-shadow(0px 14px 14px rgba(0,0,0,0.80)) " +
      "drop-shadow(2px 6px 4px rgba(0,0,0,0.80))";
  
    const OUTER_INSET_BEVEL =
      "inset 0px 4px 3px 0px rgba(255,255,255,0.28), " +
      "inset -4px -5px 4px 0px rgba(0,0,0,0.28)";
  
    const INNER_PANEL_SHADOW =
      "drop-shadow(3px -6px 10px rgba(0,0,0,0.75))";
  
    /* ── shape tokens ────────────────────────────────────────────── */
    // Identical chamfer used for BOTH outer and inner so the silhouette
    // matches Figma end-to-end.
    const PANEL_CLIP =
      "polygon(0 0, 100% 0, 100% 100%, 17% 100%, 0 83%)";
  
    return (
      <div
        className="flex items-center justify-center"
        style={{
          fontFamily:
            "'Montserrat', 'Inter', system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Outer wrapper: carries drop-shadow so the chamfer casts properly */}
        <div
          className="w-full max-w-[340px]"
          style={{ filter: OUTER_DROP_SHADOWS }}
        >
          {/* ═════════════════════════════════════════════════════
              1) MAIN CONTAINER — now chamfered to match Figma
             ════════════════════════════════════════════════════ */}
          <div
            className="relative"
            style={{
              background: `linear-gradient(135deg, ${TEAL_TOP} 0%, ${TEAL_BOTTOM} 100%)`,
              borderRadius: "13.5px",
              boxShadow: OUTER_INSET_BEVEL,
              aspectRatio: "880 / 1300",
              padding: "14px 14px 14px 14px",
              border: "1px solid #014E57",
              // NOTE: outer container stays rectangular-rounded; chamfer
              // lives on the inner panel so we preserve the visible bevel
              // frame shown in the Figma reference.
            }}
          >
            {/* ═════════════════════════════════════════════════════
                3a) RIGHT-SIDE ORANGE TABS — rectangular, asymmetric
                   radius (sharp on left, slight round on right)
               ════════════════════════════════════════════════════ */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                right: "4px",
                top: "10%",
                width: "14px",
                height: "18%",
                background: ORANGE,
                borderRadius: "0 3px 3px 0",   // flat left, rounded right
                boxShadow:
                  "-1px 2px 3px rgba(0,0,0,0.45), inset 1px 0 0 rgba(0,0,0,0.15)",
                zIndex: 3,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                right: "4px",
                bottom: "12%",
                width: "14px",
                height: "14%",
                background: ORANGE,
                borderRadius: "0 3px 3px 0",
                boxShadow:
                  "-1px 2px 3px rgba(0,0,0,0.45), inset 1px 0 0 rgba(0,0,0,0.15)",
                zIndex: 3,
              }}
            />
  
            {/* ═════════════════════════════════════════════════════
                2) INNER CHISELED PANEL
               ════════════════════════════════════════════════════ */}
            <div className="h-full" style={{ filter: INNER_PANEL_SHADOW }}>
              <div
                className="relative h-full flex flex-col"
                style={{
                  background: TEAL_TOP,
                  border: `1px solid ${TEAL_BORDER}`,
                  clipPath: PANEL_CLIP,
                  WebkitClipPath: PANEL_CLIP,
                  padding: "24px 20px 22px 20px",
                }}
              >
                {/* Clock icon */}
                <div className="flex justify-center mb-3">
                  <ClockIcon />
                </div>
  
                {/* ── Heading — forced 4-line wrap ───────────── */}
                <h2
                  className="text-white text-center uppercase mb-5"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(1.05rem, 4.4vw, 1.32rem)",
                    lineHeight: 1.1,
                    letterSpacing: "0.015em",
                    textShadow: "0 1px 1px rgba(0,0,0,0.30)",
                  }}
                >
                  STREAMLINING
                  <br />
                  PROBATE REAL ESTATE
                  <br />
                  SALES WITH
                  <br />
                  PRECISION.
                </h2>
  
                {/* ═════════════════════════════════════════════
                    3b) ORANGE CENTER RIBBON
                   ════════════════════════════════════════════ */}
                <div
                  className="text-center"
                  style={{
                    background: ORANGE,
                    padding: "12px 16px",
                    margin: "0 -20px",
                    boxShadow:
                      "0 4px 6px rgba(0,0,0,0.35), 0 -1px 2px rgba(0,0,0,0.20)",
                  }}
                >
                  <p
                    className="text-white leading-snug"
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(0.95rem, 3.7vw, 1.1rem)",
                      letterSpacing: "0.01em",
                      textShadow: "0 1px 1px rgba(0,0,0,0.30)",
                    }}
                  >
                    — From Listing To Closing
                    <br />
                    Without The Excuses
                  </p>
                </div>
  
                {/* ── Body copy ──────────────────────────────── */}
                <p
                  className="text-white text-center mt-5 mb-5 px-1 flex-1 flex items-center justify-center"
                  style={{
                    fontWeight: 600,
                    fontSize: "clamp(0.9rem, 3.4vw, 1rem)",
                    lineHeight: 1.5,
                  }}
                >
                  Get Your Probate Property SOLD Fast—No Delays, No Surprises,
                  Just Results.
                </p>
  
                {/* ── Learn More button ──────────────────────── */}
                <div className="flex justify-center">
                  <LearnMoreButton orange={ORANGE} edge={ORANGE_SHADOW} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  /* ─────────────────────────── ICONS / BUTTON ─────────────────────────── */
  
  function ClockIcon() {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: "78px",
          height: "78px",
          filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.35))",
        }}
      >
        <svg
          width="78"
          height="78"
          viewBox="0 0 78 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* outer white ring */}
          <circle
            cx="39"
            cy="39"
            r="31"
            stroke="white"
            strokeWidth="5"
          />
          {/* hour hand — pointing up to 12 */}
          <rect
            x="37"
            y="16"
            width="4"
            height="24"
            rx="2"
            fill="white"
          />
          {/* minute hand — pointing right to 3 */}
          <rect
            x="38"
            y="37"
            width="20"
            height="4"
            rx="2"
            fill="white"
          />
          {/* center pin */}
          <circle cx="39" cy="39" r="2.8" fill="white" />
        </svg>
      </span>
    );
  }
  
  function LearnMoreButton({ orange, edge }) {
    return (
      <button
        type="button"
        className="group relative flex items-center gap-3 rounded-full transition-transform active:translate-y-[1px]"
        style={{
          background: orange,
          borderBottom: `3px solid ${edge}`,
          paddingLeft: "24px",
          paddingRight: "6px",
          paddingTop: "6px",
          paddingBottom: "6px",
          boxShadow:
            "0 6px 10px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.30)",
        }}
        onClick={() => {
          /* hook up navigation here */
        }}
      >
        <span
          className="text-white uppercase"
          style={{
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "0.18em",       // widened tracking per Figma
            textShadow: "0 1px 1px rgba(0,0,0,0.25)",
          }}
        >
          Learn More
        </span>
  
        {/* arrow badge */}
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: "38px",
            height: "38px",
            background: "white",
            boxShadow:
              "inset 0 -2px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.30)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9h11M9.5 4.5L14 9l-4.5 4.5"
              stroke={orange}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    );
  }