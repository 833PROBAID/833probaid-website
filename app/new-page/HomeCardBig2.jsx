"use client";

import { memo } from "react";
import "./book-card.css";

const D = {
  w: 1016,
  h: 480,
};

function BookCardInner2({ width = D.w, height = D.h }) {
  const hingeEdge = { left: "4%", right: "3.5%" };

  return (
    <div
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
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: "16px",
            background: "#0097A7",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "6%",
            bottom: "6%",
            ...hingeEdge,
            borderRadius: "3%",
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
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: -3,
                bottom: -14,
                left: -7,
                pointerEvents: "none",
                zIndex: 0,
                filter: "blur(3px)",
                transform: `translate(3px, -6px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: "rgba(0,0,0,0.64)",
                  clipPath:
                    "polygon(0% 0%, 99.5% 0%, 100% 3.5%, 100% 75%, 90% 100%, 0% 100%)",
                  WebkitClipPath:
                    "polygon(0% 0%, 99.5% 0%, 100% 3.5%, 100% 75%, 90% 100%, 0% 100%)",
                  borderRadius: 14,
                }}
              />
            </div>
            {/* CONTENT DIV */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                background: "#ffffff",
                padding: "20px",
                borderRadius: "8px",
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)",
                WebkitClipPath:
                  "polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)",
                overflow: "hidden",
                transform: "translateZ(0.01px)",
                WebkitTransform: "translateZ(0.01px)",
              }}
            >
              dsdds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BookCardBig2 = memo(BookCardInner2);
export default BookCardBig2;
