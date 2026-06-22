"use client";

import { useState } from "react";
import Image from "next/image";

// Reusable orange CTA button — same UI as the blog card's "Learn More" button.
// Sizing/spacing is controlled per-usage via the *ClassName props so it can be
// reused across the site (hero "Get Started", footer "Subscribe", etc.).
export default function CTAButton({
  label,
  onClick,
  type = "button",
  mirrored = false,
  icon = "/arrow-right.png",
  bg = "#FE7702",
  className = "",
  shadowClassName = "shadow-[2px_1.73px_6.64px_0px_rgba(0,0,0,1),5.46px_-5.46px_3.64px_0px_rgba(0,0,0,0.25)_inset,-3.64px_4.55px_3.64px_0px_rgba(255,255,255,0.25)_inset,-1.82px_-0.91px_3.64px_0px_rgba(0,0,0,0.7)]",
  textClassName = "text-[16px] lg:text-[22px]",
  iconClassName = "w-8 lg:w-10 h-8 lg:h-10",
  ...rest
}) {
  const [hov, setHov] = useState(false);
  const rotateDir = mirrored ? "3deg" : "-3deg";
  return (
    <button
      type={type}
      onClick={onClick}
      {...rest}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`inline-flex items-center gap-2 lg:gap-3 rounded-lg ${shadowClassName} ${className}`}
      style={{
        background: bg,
        cursor: "pointer",
        animation: hov ? "none" : "floatBounce 2s ease-in-out infinite",
        transform: hov ? `scale(1.08) rotate(${rotateDir})` : "scale(1) rotate(0deg)",
        transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        willChange: "transform",
      }}
    >
      <span
        className={`font-montserrat font-black uppercase text-white tracking-wide [text-shadow:1px_2px_1.6px_rgba(0,0,0,0.82),0_0_6px_rgba(255,255,255,0.25)] ${textClassName}`}
      >
        {label}
      </span>
      <Image
        src={icon}
        alt="arrow right"
        width={100}
        height={100}
        priority
        className={`object-contain ${iconClassName}`}
      />
    </button>
  );
}
