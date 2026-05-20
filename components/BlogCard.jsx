/* eslint-disable @next/next/no-img-element */

"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import BlogHero from "./BlogHero";

export default function BlogCard({
  id: legacyId,
  alignIndex,
  uid,
  bannerImage,
  title,
  authorName,
  authorAvatar,
  slug,
  type = "read",
  onVideoClick = null,
}) {
  const router = useRouter();
  const reactId = useId();
  const [isOpening, setIsOpening] = useState(false);
  const computedAlignIndex =
    typeof alignIndex === "number" && Number.isFinite(alignIndex)
      ? alignIndex
      : typeof legacyId === "number" && Number.isFinite(legacyId)
        ? legacyId
        : 1;
  const isRightAligned = computedAlignIndex % 2 === 0;

  const svgUid = useMemo(() => {
    const raw =
      uid ?? (legacyId != null ? String(legacyId) : null) ?? slug ?? reactId;
    return String(raw).replace(/[^a-zA-Z0-9_-]/g, "_");
  }, [uid, legacyId, slug, reactId]);

  const id = svgUid;
  const pageAnimClass = isOpening
    ? isRightAligned
      ? "bc-open-right"
      : "bc-open-left"
    : "";
  const pageSideClass = isRightAligned ? "bc-page-right" : "bc-page-left";
  const bookLayerClass = `bc-book-layer ${pageSideClass} ${pageAnimClass}`;

  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick();
      return;
    }
    if (!slug) return;
    if (isOpening) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      router.push(`/blogs/${slug}`);
      return;
    }

    setIsOpening(true);
    setTimeout(() => {
      router.push(`/blogs/${slug}`);
    }, 500);
  };

  return (
    <div
      className={`${isOpening ? "" : "group"} flex w-full justify-center`}
      onClick={(e) => e.stopPropagation()}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div className="bc-card-wrapper w-full max-w-82.5 sm:max-w-100 md:max-w-120 lg:max-w-145">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 698 940"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <style>{`
            .bc-card-wrapper {
              filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
              isolation: isolate;
              -webkit-tap-highlight-color: transparent;
            }
            .bc-book-layer {
              transform-box: fill-box;
              -webkit-transform-box: fill-box;
            }
            .bc-content-clip { overflow: hidden; }
            .bc-content-clip foreignObject { overflow: hidden; }
            .bc-banner-border {
              stroke: #FE7702;
              stroke-width: 7px;
              fill: none;
              pointer-events: none;
            }
            .bc-banner-wrapper {
              -webkit-transition: -webkit-transform 0.65s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              transition: transform 0.65s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              transform-origin: center;
              -webkit-transform-origin: center;
              z-index: 2;
              position: relative;
            }
            .bc-card-wrapper:has(.bc-button-float:hover) .bc-banner-wrapper {
              -webkit-transform: scale(1.04);
              transform: scale(1.04);
            }
            .bc-title-wrapper {}
            .bc-title-text {
              font-family: "Montserrat", sans-serif;
              font-size: 28px;
              font-weight: 600;
              color: #000;
              line-height: 1.5;
              letter-spacing: 0.5px;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .bc-avatar-wrapper {
              -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.06s;
              transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.06s;
            }
            .bc-author-text {
              font-family: "Montserrat", sans-serif;
              font-size: 25px;
              font-weight: 600;
              color: #666;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .bc-button-float {
              transform-box: fill-box;
              -webkit-transform-box: fill-box;
              transform-origin: center center;
              -webkit-transform-origin: center center;
              outline: none;
              will-change: transform;
            }
            .bc-card-wrapper:hover .bc-button-float {
              -webkit-animation: bcBtnFloat 2.5s ease-in-out infinite;
              animation: bcBtnFloat 2.5s ease-in-out infinite;
            }
            .bc-card-wrapper:hover .bc-book-layer,
            .bc-card-wrapper:hover .bc-holder-lip-layer,
            .bc-card-wrapper:hover .bc-thickness,
            .bc-card-wrapper:hover .bc-spine-round {
              will-change: transform, opacity;
            }
            .bc-button-wrapper {
              -webkit-transition: -webkit-transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
              transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
              transform-box: fill-box;
              -webkit-transform-box: fill-box;
              transform-origin: center center;
              -webkit-transform-origin: center center;
            }
            .bc-button-float:hover .bc-button-wrapper {
              -webkit-transform: rotate(-2deg) scale(1.08);
              transform: rotate(-2deg) scale(1.08);
            }
            @-webkit-keyframes bcBtnFloat {
              0%, 100% { -webkit-transform: translateY(0px); }
              50% { -webkit-transform: translateY(-8px); }
            }
            @keyframes bcBtnFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            .bc-holder-lip-layer {
              transform-box: fill-box;
              -webkit-transform-box: fill-box;
            }
            .bc-holder-lip-left { transform-origin: 100% 50%; -webkit-transform-origin: 100% 50%; }
            .bc-holder-lip-right { transform-origin: 0% 50%; -webkit-transform-origin: 0% 50%; }
            .bc-holder-lip-open-left {
              -webkit-animation: bcHolderLipLeft 0.5s linear forwards;
              animation: bcHolderLipLeft 0.5s linear forwards;
            }
            .bc-holder-lip-open-right {
              -webkit-animation: bcHolderLipRight 0.5s linear forwards;
              animation: bcHolderLipRight 0.5s linear forwards;
            }
            .bc-holder-layer { transform-box: fill-box; -webkit-transform-box: fill-box; }
            .bc-holder-shade { opacity: 0; }
            .bc-holder-open {
              -webkit-animation: bcHolderDepth 0.5s linear forwards;
              animation: bcHolderDepth 0.5s linear forwards;
            }
            .bc-holder-shade-open {
              -webkit-animation: bcHolderShade 0.5s linear forwards;
              animation: bcHolderShade 0.5s linear forwards;
            }
            .bc-spine-round { opacity: 0; transform-box: fill-box; -webkit-transform-box: fill-box; }
            .bc-spine-round-open {
              -webkit-animation: bcSpineRound 0.5s linear forwards;
              animation: bcSpineRound 0.5s linear forwards;
            }
            .bc-page-left { transform-origin: 0% 50%; -webkit-transform-origin: 0% 50%; }
            .bc-page-right { transform-origin: 100% 50%; -webkit-transform-origin: 100% 50%; }
            .bc-page-shadow { opacity: 0; }
            .bc-thickness {
              opacity: 0;
              transform-box: fill-box;
              -webkit-transform-box: fill-box;
            }
            .bc-thickness-left {
              transform-origin: left center;
              -webkit-transform-origin: left center;
              -webkit-transform: scaleX(0.08);
              transform: scaleX(0.08);
            }
            .bc-thickness-right {
              transform-origin: right center;
              -webkit-transform-origin: right center;
              -webkit-transform: scaleX(0.08);
              transform: scaleX(0.08);
            }
            .bc-thickness-open-left {
              -webkit-animation: bcThicknessLeft 0.5s linear forwards;
              animation: bcThicknessLeft 0.5s linear forwards;
            }
            .bc-thickness-open-right {
              -webkit-animation: bcThicknessRight 0.5s linear forwards;
              animation: bcThicknessRight 0.5s linear forwards;
            }
            .bc-open-left {
              -webkit-animation: bcBookOpenLeft 0.5s linear forwards;
              animation: bcBookOpenLeft 0.5s linear forwards;
            }
            .bc-open-right {
              -webkit-animation: bcBookOpenRight 0.5s linear forwards;
              animation: bcBookOpenRight 0.5s linear forwards;
            }
            .bc-shadow-open-left {
              -webkit-animation: bcShadowLeft 0.5s linear forwards;
              animation: bcShadowLeft 0.5s linear forwards;
            }
            .bc-shadow-open-right {
              -webkit-animation: bcShadowRight 0.5s linear forwards;
              animation: bcShadowRight 0.5s linear forwards;
            }
            @media (prefers-reduced-motion: reduce) {
              .bc-open-left, .bc-open-right,
              .bc-shadow-open-left, .bc-shadow-open-right,
              .bc-thickness-open-left, .bc-thickness-open-right,
              .bc-holder-lip-open-left, .bc-holder-lip-open-right,
              .bc-card-wrapper:hover .bc-button-float {
                -webkit-animation: none !important;
                animation: none !important;
              }
            }
            @media (max-width: 767px) {
              .bc-card-wrapper:has(.bc-button-float:hover) .bc-banner-wrapper {
                -webkit-transform: none !important;
                transform: none !important;
              }
              .bc-button-float:hover .bc-button-wrapper {
                -webkit-transform: none !important;
                transform: none !important;
              }
            }
            @-webkit-keyframes bcBookOpenLeft {
              0%   { -webkit-transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { -webkit-transform: translateY(-0.35%) skewY(-85deg) scaleX(0.12); }
            }
            @keyframes bcBookOpenLeft {
              0%   { transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { transform: translateY(-0.35%) skewY(-85deg) scaleX(0.12); }
            }
            @-webkit-keyframes bcBookOpenRight {
              0%   { -webkit-transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { -webkit-transform: translateY(-0.35%) skewY(85deg) scaleX(0.12); }
            }
            @keyframes bcBookOpenRight {
              0%   { transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { transform: translateY(-0.35%) skewY(85deg) scaleX(0.12); }
            }
            @-webkit-keyframes bcShadowLeft {
              0% { opacity: 0; } 100% { opacity: 0.10; }
            }
            @keyframes bcShadowLeft {
              0% { opacity: 0; } 100% { opacity: 0.10; }
            }
            @-webkit-keyframes bcShadowRight {
              0% { opacity: 0; } 100% { opacity: 0.10; }
            }
            @keyframes bcShadowRight {
              0% { opacity: 0; } 100% { opacity: 0.10; }
            }
            @-webkit-keyframes bcThicknessLeft {
              0%   { opacity: 0; -webkit-transform: scaleX(0.20); }
              100% { opacity: 0.65; -webkit-transform: scaleX(1); }
            }
            @keyframes bcThicknessLeft {
              0%   { opacity: 0; transform: scaleX(0.20); }
              100% { opacity: 0.65; transform: scaleX(1); }
            }
            @-webkit-keyframes bcThicknessRight {
              0%   { opacity: 0; -webkit-transform: scaleX(0.20); }
              100% { opacity: 0.65; -webkit-transform: scaleX(1); }
            }
            @keyframes bcThicknessRight {
              0%   { opacity: 0; transform: scaleX(0.20); }
              100% { opacity: 0.65; transform: scaleX(1); }
            }
            @-webkit-keyframes bcHolderDepth {
              0% { opacity: 1; } 35% { opacity: 1; } 100% { opacity: 1; }
            }
            @keyframes bcHolderDepth {
              0% { opacity: 1; } 35% { opacity: 1; } 100% { opacity: 1; }
            }
            @-webkit-keyframes bcHolderShade {
              0% { opacity: 0; } 35% { opacity: 0.08; } 100% { opacity: 0.05; }
            }
            @keyframes bcHolderShade {
              0% { opacity: 0; } 35% { opacity: 0.08; } 100% { opacity: 0.05; }
            }
            @-webkit-keyframes bcSpineRound {
              0%   { opacity: 0; -webkit-transform: scaleX(0.70); }
              35%  { opacity: 0.55; -webkit-transform: scaleX(1); }
              100% { opacity: 0.40; -webkit-transform: scaleX(1); }
            }
            @keyframes bcSpineRound {
              0%   { opacity: 0; transform: scaleX(0.70); }
              35%  { opacity: 0.55; transform: scaleX(1); }
              100% { opacity: 0.40; transform: scaleX(1); }
            }
            @-webkit-keyframes bcHolderLipLeft {
              0%   { -webkit-transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { -webkit-transform: translateY(-0.15%) skewY(-16deg) scaleX(0.92); }
            }
            @keyframes bcHolderLipLeft {
              0%   { transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { transform: translateY(-0.15%) skewY(-16deg) scaleX(0.92); }
            }
            @-webkit-keyframes bcHolderLipRight {
              0%   { -webkit-transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { -webkit-transform: translateY(-0.15%) skewY(16deg) scaleX(0.92); }
            }
            @keyframes bcHolderLipRight {
              0%   { transform: translateY(0%) skewY(0deg) scaleX(1); }
              100% { transform: translateY(-0.15%) skewY(16deg) scaleX(0.92); }
            }
            .bc-book-text { opacity: 0; }
            .bc-book-text-open {
              -webkit-animation: bcBookTextFade 0.5s linear forwards;
              animation: bcBookTextFade 0.5s linear forwards;
            }
            @-webkit-keyframes bcBookTextFade {
              0% { opacity: 1; } 100% { opacity: 1; }
            }
            @keyframes bcBookTextFade {
              0% { opacity: 1; } 100% { opacity: 1; }
            }
          `}</style>
          <defs>
            <linearGradient
              id={`bc_shadow_left_${id}`}
              x1="66.2998"
              y1="72.1"
              x2="624.3"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`bc_shadow_right_${id}`}
              x1="624.3"
              y1="72.1"
              x2="66.2998"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`bc_thickness_left_${id}`}
              x1="66.2998"
              y1="72.1"
              x2="82.2998"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#E5E7EB" stopOpacity="0.35" />
              <stop offset="0.4" stopColor="#E5E7EB" stopOpacity="0.75" />
              <stop offset="1" stopColor="#9CA3AF" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient
              id={`bc_thickness_right_${id}`}
              x1="624.3"
              y1="72.1"
              x2="608.3"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#E5E7EB" stopOpacity="0.35" />
              <stop offset="0.4" stopColor="#E5E7EB" stopOpacity="0.75" />
              <stop offset="1" stopColor="#9CA3AF" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient
              id={`bc_spine_round_left_${id}`}
              x1="66.2998"
              y1="72.1"
              x2="90.2998"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#000000" stopOpacity="0.12" />
              <stop offset="0.55" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`bc_spine_round_right_${id}`}
              x1="624.3"
              y1="72.1"
              x2="600.3"
              y2="72.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#000000" stopOpacity="0.12" />
              <stop offset="0.55" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`bc_book_clip_${id}`}>
              <path
                d={
                  isRightAligned
                    ? "M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z"
                    : "M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z"
                }
              />
            </clipPath>
            <clipPath id={`bannerClip_${id}`}>
              <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" />
            </clipPath>
            <filter
              id={`filter0_ddii_202_3_${id}`}
              x="-0.000195503"
              y="9.72748e-05"
              width="697.4"
              height="939.4"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="effect1_dropShadow" />
              <feOffset dx="-2" dy="6" />
              <feGaussianBlur stdDeviation="5.65" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="effect2_dropShadow" />
              <feOffset dx="5" dy="-6" />
              <feGaussianBlur stdDeviation="7.55" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-5" dy="-6" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="effect3_innerShadow" result="effect4_innerShadow" />
            </filter>
            <filter
              id={`filter1_ddd_202_3_${id}`}
              x="45.2998" y="52.1001" width="601" height="841.8"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="10" dy="-8" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-9" dy="-5" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-6" dy="13" />
              <feGaussianBlur stdDeviation="6.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter1_ddd_202_3_${id}_right`}
              x="45.2998" y="52.1001" width="601" height="841.8"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="10" dy="-8" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-9" dy="-5" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-6" dy="13" />
              <feGaussianBlur stdDeviation="6.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter2_dd_202_3_${id}`}
              x="83.2998" y="86.9001" width="518.557" height="366.028"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-6" dy="7" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="-5" />
              <feGaussianBlur stdDeviation="6.1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter2_dd_202_3_${id}_right`}
              x="83.2998" y="86.9001" width="518.557" height="366.028"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-6" dy="7" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="-5" />
              <feGaussianBlur stdDeviation="6.1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter3_d_202_3_${id}`}
              x="46.0998" y="52.8808" width="34.4" height="238.439"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="2" />
              <feGaussianBlur stdDeviation="2.11" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter3_i_202_3_${id}`}
              x="613.081" y="18.8808" width="34.4386" height="42.4386"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="2" />
              <feGaussianBlur stdDeviation="2.11" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter3_extra_dd_202_3_${id}`}
              x="613.081" y="52.8808" width="34.4386" height="238.439"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="2" />
              <feGaussianBlur stdDeviation="2.11" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter_bar_shadow3d_top_${id}`}
              x="38.3998" y="15.1" width="59.8" height="225.4"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-4" dy="3" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="-2" />
              <feGaussianBlur stdDeviation="3.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="effect1_dropShadow_bar3d" result="effect2_dropShadow_bar3d" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_bar3d" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="shape" result="effect3_innerShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-3" dy="-3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="effect3_innerShadow_bar3d" result="effect4_innerShadow_bar3d" />
            </filter>
            <filter
              id={`filter_bar_shadow3d_bottom_${id}`}
              x="38.3998" y="708.1" width="59.8" height="225.4"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-4" dy="3" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="-2" />
              <feGaussianBlur stdDeviation="3.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="effect1_dropShadow_bar3d" result="effect2_dropShadow_bar3d" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_bar3d" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="shape" result="effect3_innerShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-3" dy="-3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="effect3_innerShadow_bar3d" result="effect4_innerShadow_bar3d" />
            </filter>
            <filter
              id={`filter6_i_202_3_${id}`}
              x="613.081" y="880.381" width="34.4386" height="42.4386"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="2" />
              <feGaussianBlur stdDeviation="2.11" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <filter
              id={`filter_bar_shadow3d_top_${id}_right`}
              x="595.4" y="15.1" width="59.8" height="225.4"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-4" dy="3" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="-2" />
              <feGaussianBlur stdDeviation="3.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="effect1_dropShadow_bar3d" result="effect2_dropShadow_bar3d" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_bar3d" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="shape" result="effect3_innerShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-3" dy="-3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="effect3_innerShadow_bar3d" result="effect4_innerShadow_bar3d" />
            </filter>
            <filter
              id={`filter_bar_shadow3d_bottom_${id}_right`}
              x="595.4" y="708.1" width="59.8" height="225.4"
              filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-4" dy="3" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="4" dy="-2" />
              <feGaussianBlur stdDeviation="3.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="effect1_dropShadow_bar3d" result="effect2_dropShadow_bar3d" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_bar3d" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="3" dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="shape" result="effect3_innerShadow_bar3d" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-3" dy="-3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0" />
              <feBlend mode="normal" in2="effect3_innerShadow_bar3d" result="effect4_innerShadow_bar3d" />
            </filter>
            <linearGradient
              id={`paint0_linear_202_3_${id}`}
              x1="4.4923" y1="195.387" x2="1300.63" y2="503.547"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0097A7" />
              <stop offset="1" stopColor="#007B88" />
            </linearGradient>
          </defs>

          <g filter={`url(#filter0_ddii_202_3_${id})`}>
            {isRightAligned ? (
              <>
                <rect width="658" height="895" rx="13.5393" transform="matrix(1 0 0 -1 16.2998 919.1)" fill={`url(#paint0_linear_202_3_${id})`} />
                <rect x="0.5" y="-0.5" width="657" height="894" rx="13.0393" transform="matrix(1 0 0 -1 16.2998 918.1)" stroke="#014E57" />
              </>
            ) : (
              <>
                <rect x="16.2998" y="24.1001" width="658" height="895" rx="13.5393" fill={`url(#paint0_linear_202_3_${id})`} />
                <rect x="16.7998" y="24.6001" width="657" height="894" rx="13.0393" stroke="#014E57" />
              </>
            )}
          </g>

          {isRightAligned ? (
            <g className={`bc-thickness bc-thickness-right ${isOpening ? "bc-thickness-open-right" : ""}`} aria-hidden="true">
              <rect x="608.3" y="72.1" width="16" height="796" rx="3" fill={`url(#bc_thickness_right_${id})`} />
              <g opacity="0.18">
                <path d="M609.8 140.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 220.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 300.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 380.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 460.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 540.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 620.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 700.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M609.8 780.1H622.8" stroke="#9CA3AF" strokeWidth="1" />
              </g>
            </g>
          ) : (
            <g className={`bc-thickness bc-thickness-left ${isOpening ? "bc-thickness-open-left" : ""}`} aria-hidden="true">
              <rect x="66.2998" y="72.1" width="16" height="796" rx="3" fill={`url(#bc_thickness_left_${id})`} />
              <g opacity="0.18">
                <path d="M67.8 140.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 220.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 300.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 380.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 460.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 540.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 620.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 700.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M67.8 780.1H80.8" stroke="#9CA3AF" strokeWidth="1" />
              </g>
            </g>
          )}

          <g className={`bc-book-text ${isOpening ? "bc-book-text-open" : ""}`}>
            <path
              d={isRightAligned
                ? "M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z"
                : "M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z"
              }
              fill="#F8F5ED"
            />
          </g>

          {isOpening && (
            <>
              <defs>
                <clipPath id={`bc_img_clip_${id}`}>
                  <path d={isRightAligned
                    ? "M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z"
                    : "M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z"
                  } />
                </clipPath>
              </defs>
              <foreignObject x="105" y="100" width="500" height="700" clipPath={`url(#bc_img_clip_${id})`}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
                  <BlogHero
                    bannerImage={bannerImage}
                    title={title}
                    authorName={authorName}
                    authorAvatar={authorAvatar}
                    wrapperStyle={{ width: "500px", height: "700px", aspectRatio: "unset" }}
                    isCard={true}
                  />
                </div>
              </foreignObject>
            </>
          )}

          {isRightAligned ? (
            <>
              <g className={bookLayerClass}>
                <g filter={`url(#filter1_ddd_202_3_${id}_right)`}>
                  <path d="M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z" fill="white" />
                </g>
                <g filter={`url(#filter1_ddd_202_3_${id}_right)`}>
                  <path d="M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z" fill="white" />
                  <path d="M624.3 85.6394C624.3 78.1619 618.238 72.1001 610.76 72.1001H79.8391C72.3615 72.1001 66.2998 78.1619 66.2998 85.6394V764.491C66.2998 767.687 67.4308 770.781 69.4928 773.224L145.519 863.294C148.091 866.342 151.877 868.1 155.865 868.1H610.76C618.238 868.1 624.3 862.038 624.3 854.561V85.6394Z" fill={`url(#bc_shadow_right_${id})`} className={`bc-page-shadow ${isOpening ? "bc-shadow-open-right" : ""}`} />
                </g>
                <rect x="608.3" y="72.1" width="20" height="796" rx="10" fill={`url(#bc_spine_round_right_${id})`} className={`bc-spine-round ${isOpening ? "bc-spine-round-open" : ""}`} aria-hidden="true" />
                <g filter={`url(#filter2_dd_202_3_${id}_right)`}>
                  <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" fill="white" />
                  <clipPath id={`bc_banner_clip_${id}`}>
                    <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" />
                  </clipPath>
                  <g clipPath={`url(#bc_banner_clip_${id})`}>
                    <image href={bannerImage} x="101.3" y="104.1" width="485.357" height="329.828" preserveAspectRatio="xMidYMid slice" className="bc-banner-wrapper" />
                    <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" className="bc-banner-border" fill="none" style={{ pointerEvents: "none" }} />
                  </g>
                </g>
              </g>
            </>
          ) : (
            <>
              <g className={bookLayerClass}>
                <g filter={`url(#filter1_ddd_202_3_${id})`}>
                  <path d="M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z" fill="white" />
                </g>
                <g filter={`url(#filter1_ddd_202_3_${id})`}>
                  <path d="M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z" fill="white" />
                  <path d="M66.2998 85.6394C66.2998 78.1619 72.3615 72.1001 79.8391 72.1001H610.76C618.238 72.1001 624.3 78.1619 624.3 85.6394V764.491C624.3 767.687 623.169 770.781 621.107 773.224L545.081 863.294C542.509 866.342 538.723 868.1 534.735 868.1H79.8391C72.3615 868.1 66.2998 862.038 66.2998 854.561V85.6394Z" fill={`url(#bc_shadow_left_${id})`} className={`bc-page-shadow ${isOpening ? "bc-shadow-open-left" : ""}`} />
                </g>
                <rect x="66.2998" y="72.1" width="20" height="796" rx="10" fill={`url(#bc_spine_round_left_${id})`} className={`bc-spine-round ${isOpening ? "bc-spine-round-open" : ""}`} aria-hidden="true" />
                <g filter={`url(#filter2_dd_202_3_${id})`}>
                  <clipPath id={`bc_banner_clip_left_${id}`}>
                    <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" />
                  </clipPath>
                  <g clipPath={`url(#bc_banner_clip_left_${id})`}>
                    <image href={bannerImage} x="101.3" y="104.1" width="485.357" height="329.828" preserveAspectRatio="xMidYMid slice" className="bc-banner-wrapper" />
                    <rect x="101.3" y="104.1" width="485.357" height="329.828" rx="13.4076" className="bc-banner-border" fill="none" style={{ pointerEvents: "none" }} />
                  </g>
                </g>
              </g>
            </>
          )}

          {!isRightAligned ? (
            <g aria-hidden="true" className={`bc-holder-lip-layer bc-holder-lip-left ${isOpening ? "bc-holder-lip-open-left" : ""}`}>
              <rect x="54.2998" y="24.1" width="12" height="197" rx="6" fill="#FE7702" />
              <rect x="54.2998" y="717.1" width="12" height="200" rx="6" fill="#FE7702" />
            </g>
          ) : (
            <g aria-hidden="true" className={`bc-holder-lip-layer bc-holder-lip-right ${isOpening ? "bc-holder-lip-open-right" : ""}`}>
              <rect x="625.3" y="24.1" width="12" height="197" rx="6" fill="#FE7702" />
              <rect x="625.3" y="717.1" width="12" height="200" rx="6" fill="#FE7702" />
            </g>
          )}

          <g aria-hidden="true" className={`bc-holder-layer ${isOpening ? "bc-holder-open" : ""}`}>
            {!isRightAligned ? (
              <>
                <g filter={`url(#filter_bar_shadow3d_top_${id})`}>
                  <rect width="26" height="197" transform="matrix(-1 0 0 1 80.2998 24.1)" fill="#FE7702" />
                  <rect width="26" height="197" transform="matrix(-1 0 0 1 80.2998 24.1)" fill="#000000" className={`bc-holder-shade ${isOpening ? "bc-holder-shade-open" : ""}`} />
                </g>
                <g filter={`url(#filter_bar_shadow3d_bottom_${id})`}>
                  <rect width="26" height="200" transform="matrix(-1 0 0 1 80.2998 717.1)" fill="#FE7702" />
                  <rect width="26" height="200" transform="matrix(-1 0 0 1 80.2998 717.1)" fill="#000000" className={`bc-holder-shade ${isOpening ? "bc-holder-shade-open" : ""}`} />
                </g>
              </>
            ) : (
              <>
                <g filter={`url(#filter_bar_shadow3d_top_${id}_right)`}>
                  <rect width="26" height="197" transform="matrix(-1 0 0 1 637.3 24.1)" fill="#FE7702" />
                  <rect width="26" height="197" transform="matrix(-1 0 0 1 637.3 24.1)" fill="#000000" className={`bc-holder-shade ${isOpening ? "bc-holder-shade-open" : ""}`} />
                </g>
                <g filter={`url(#filter_bar_shadow3d_bottom_${id}_right)`}>
                  <rect width="26" height="200" transform="matrix(-1 0 0 1 637.3 717.1)" fill="#FE7702" />
                  <rect width="26" height="200" transform="matrix(-1 0 0 1 637.3 717.1)" fill="#000000" className={`bc-holder-shade ${isOpening ? "bc-holder-shade-open" : ""}`} />
                </g>
              </>
            )}
          </g>

          <g className={bookLayerClass}>
            <g clipPath={`url(#bc_book_clip_${id})`} className="bc-content-clip">
              <line x1="103.3" y1="614.6" x2="585.3" y2="614.6" stroke="#0097A7" strokeWidth="3" />
              <foreignObject x="80" y="460" width="540" height="200">
                <div xmlns="http://www.w3.org/1999/xhtml" className="bc-title-wrapper flex h-full items-start justify-start px-8 pt-2 text-left">
                  <h2 className="bc-title-text">{title}</h2>
                </div>
              </foreignObject>
              <clipPath id={`bc_avatar_clip_${id}`}>
                <circle cx="125" cy="655" r="25" />
              </clipPath>
              <image href={authorAvatar} x="100" y="630" width="50" height="50" preserveAspectRatio="xMidYMid slice" clipPath={`url(#bc_avatar_clip_${id})`} className="bc-avatar-wrapper" />
              <circle cx="125" cy="655" r="25" fill="none" stroke="#0097A7" strokeWidth="2" />
              <foreignObject x="160" y="630" width="340" height="50">
                <div xmlns="http://www.w3.org/1999/xhtml" className="flex h-full items-center">
                  <p className="bc-author-text">{authorName}</p>
                </div>
              </foreignObject>
              <g
                className="bc-button-float"
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick();
                  }
                }}
                role={slug || onVideoClick ? "button" : undefined}
                tabIndex={slug || onVideoClick ? 0 : undefined}
                aria-label={slug || onVideoClick ? `Open ${title}` : undefined}
                aria-disabled={isOpening || (!slug && !onVideoClick) ? true : undefined}
                style={{ cursor: slug || onVideoClick ? "pointer" : "default" }}
              >
                <image
                  href={type === "read" ? "/svgs/read.svg" : "/svgs/watch.svg"}
                  x={isRightAligned ? "180" : "160"}
                  y="730"
                  width="350"
                  height="100"
                  preserveAspectRatio="xMidYMid meet"
                  className="bc-button-wrapper"
                />
              </g>
            </g>
          </g>

          {!isRightAligned ? (
            <>
              <g filter={`url(#filter_bar_shadow3d_top_${id})`}>
                <rect width="26" height="197" transform="matrix(-1 0 0 1 80.2998 24.1)" fill="#FE7702" />
              </g>
              <g filter={`url(#filter_bar_shadow3d_bottom_${id})`}>
                <rect width="26" height="200" transform="matrix(-1 0 0 1 80.2998 717.1)" fill="#FE7702" />
              </g>
            </>
          ) : (
            <>
              <g filter={`url(#filter_bar_shadow3d_top_${id}_right)`}>
                <rect width="26" height="197" transform="matrix(-1 0 0 1 637.3 24.1)" fill="#FE7702" />
              </g>
              <g filter={`url(#filter_bar_shadow3d_bottom_${id}_right)`}>
                <rect width="26" height="200" transform="matrix(-1 0 0 1 637.3 717.1)" fill="#FE7702" />
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
