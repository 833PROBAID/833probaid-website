"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export function LearnMoreButton({ onClick, label = "Use Tool" }) {
  const [hov, setHov] = useState(false);

  const rotateDir = "-3deg";
  return (
    <button
      className={`bc-btn inline-flex items-center   gap-1.5 px-2 h-[42px]   rounded-[8px] pl-2.5`}
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
      <span className="bc-btn-text   font-montserrat font-black sm:text-[13px] lg:text-[15px] uppercase text-white tracking-wide [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
        {" "}
        {label}
      </span>
      <Image
        src="/arrow-right.png"
        alt="arrow right"
        width={50}
        height={50}
        priority
        className="bc-btn-arrow object-contain sm:h-[10px] sm:w-[10px] lg:h-[22px] lg:w-[22px]"
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
      className="relative mx-auto w-full overflow-hidden rounded-[4px] bg-[#129fb0] h-[350px]"
      style={{
        transformStyle: "preserve-3d",
        boxShadow: `
      inset 0 0 0 1px #014E57,
      inset 0px 6px 4px rgba(255,255,255,0.25),
      inset -5px -6px 4px rgba(0,0,0,0.25),
      5px -6px 15.1px rgba(0,0,0,0.80),
      -2px 6px 11.3px rgba(0,0,0,0.9)
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
        className="absolute top-0 left-8 right-8 bottom-8 z-20"
        style={{
          filter:
            "drop-shadow(1.02px 16px 13.06px #000000AD) drop-shadow(12px 0px 11.7px #00000080)",
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
          <div className="relative z-50 h-full p-4 ">
            <div className="flex flex-col items-center justify-between text-white gap-2 h-full">
              <Image
                src={icon}
                alt="Footer logo"
                width={60}
                height={60}
                className="object-cover hover:rotate-3 hover:scale-110 cursor-pointer "
              />
              <h2 className="text-lg font-poppins text-center font-bold ">
                {title}
              </h2>

              <p className="text-xs font-montserrat  text-center">
                {description}
              </p>
              <LearnMoreButton onClick={handleClick} />
              {/* <img src="/svgs/use_tool.svg" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
