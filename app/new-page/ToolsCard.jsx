"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Tool.css";
import Image from "next/image";
export function LearnMoreButton({ onClick, label = "Use Tool" }) {
  const [hov, setHov] = useState(false);
  const rotateDir = "-3deg";
  return (
    <button
      className={`bc-btns inline-flex items-center gap-1.5  rounded-[4px] `}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#FE7702",
        cursor: "pointer",
        boxShadow:
          "0px 2.73px 6.64px 0px #000000AD, inset 5.46px -5.46px 3.64px 0px #00000040, inset -3.64px 4.55px 3.64px 0px #FFFFFF40, -1.82px -0.91px 3.64px 0px #00000099",
        // animation: hov ? "none" : "floatBounce 2s ease-in-out infinite",
        // transform: hov
        //   ? `scale(1.08) rotate(${rotateDir})`
        //   : "scale(1) rotate(0deg)",
        // transition: "transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        // willChange: "transform",
      }}
    >
      <span className="bc-btn-texts  font-montserrat font-black sm:text-[13px] lg:text-[15px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
        {" "}
        {label}
      </span>
      <Image
        src="/arrow-right.png"
        alt="arrow right"
        width={50}
        height={50}
        priority
        className="bc-btn-arrows object-contain  lg:h-[22px] lg:w-[22px]"
      />
    </button>
  );
}

export default function ToolsCard({ id, icon, title, description, href }) {
  const router = useRouter();
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    setIsSafariBrowser(/^((?!chrome|android).)*safari/i.test(ua));
  }, []);

  const handleClick = (e) => {
    if (!href) return;
    e.stopPropagation();
    router.push(href);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-[4px] bg-[#129fb0] tools-card-shadow-wrapper md:h-[350px]"
      style={{
        transformStyle: "preserve-3d",
        boxShadow: `
        0px 0.57px 6.09px 2.3px #000000D4,
        2.87px -2.87px 3.68px 0px #00000040 inset,
        -0.57px 3.45px 2.3px 0px #FFFFFF40 inset
      `,
      }}
    >
      {/* ── ORANGE DECORATIVE SHAPE — behind inner panel ── */}
      <div
        className="absolute left-0 top-0 h-[300px] w-full"
        style={{
          backgroundColor: "#FE7702",
          clipPath: "polygon(0 0, 100% 0, 100% 28%, 66% 49%, 35% 49%, 0 28%)",
        }}
        aria-hidden="true"
      />

      {/* ── SHADOW WRAPPER — sits above orange ── */}
      <div
        className="absolute top-0 md:left-8 md:right-8 left-[9%] right-[9%] md:px-0 bottom-[10%] sm:bottom-8 z-20"
        style={{
          filter: "drop-shadow(0px 8px 10px #000000)",
        }}
      >
        {/* ── INNER CONTENT PANEL ── */}
        <div
          className="relative bg-[#0b8fa0] h-full w-full"
          style={{
            clipPath:
              "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 88% 100%, 15% 100%, 0% 85%, 0% 15%)",
            WebkitClipPath:
              "polygon(12% 0%, 88% 0%, 100% 12%, 100% 84%, 88% 100%, 12% 100%, 0% 84%, 0% 12%)",
          }}
        >
          <div className="relative z-50 h-full sm:p-4  p-2  inner-content-panel flex flex-col justify-between items-center">
            <div className="flex flex-col items-center justify-start text-white gap-1  sm:gap-2 h-full">
              <Image
                src={icon}
                alt="Footer logo"
                width={60}
                height={60}
                className="object-cover hover:rotate-3 hover:scale-110 cursor-pointer h-8 md:h-16 w-auto  "
              />
              <h2 className="text-xs sm:text-lg font-poppins text-center font-bold ">
                {title}
              </h2>

              <p className="text-[8px] sm:text-xs font-montserrat  text-center">
                {description}
              </p>
              {/* <img src="/svgs/use_tool.svg" /> */}
            </div>
            <div>
              <LearnMoreButton onClick={handleClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
