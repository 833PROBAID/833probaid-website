import Image from "next/image";

export default function LogoCard() {
  return (
    <div
      className="flex w-full justify-center"
      // `transform: translateZ(0)` forces Safari to allocate a GPU layer for
      // this card at page-load time instead of waiting until scroll-into-view
      // (Safari, unlike Chrome, does not aggressively pre-rasterize off-screen
      // content during idle time). Once the layer is rasterised it composites
      // for free on scroll. `contain: paint` + `isolation` keep this card's
      // repaints from invalidating siblings or the marquee.
      style={{
        contain: "layout paint style",
        isolation: "isolate",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <div
        className="w-full relative"
        // The card now uses an aspect-ratio container: the SVG paints the
        // visual frame and the HTML content sits ABOVE it via absolute
        // positioning. The old structure put the HTML inside <foreignObject>,
        // which Safari paints in a separate pass after the SVG body — that
        // two-pass paint is what you saw as "first some part then full." With
        // the HTML lifted out, Safari paints the whole card in one go through
        // its regular HTML pipeline.
        style={{ aspectRatio: "566 / 586" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 566 586"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <g filter="url(#filter0_dii_273_13)">
            <rect
              x="14.6001"
              y="13.5996"
              width="536"
              height="556"
              rx="22"
              fill="#0097A7"
            />
            <rect
              x="15.1001"
              y="14.0996"
              width="535"
              height="555"
              rx="21.5"
              stroke="#005E68"
            />
          </g>
          <g filter="url(#filter1_d_273_13)">
            <path
              d="M59.743 56.5823L73.8858 42.5996H519.6V503.699L498.863 526.149L475.586 548.6H45.6001V70.6627L59.743 56.5823Z"
              fill="url(#paint0_linear_273_13)"
            />
          </g>
          <g filter="url(#filter2_dd_273_13)">
            <path
              d="M59.743 56.5823L73.8858 42.5996H519.6V503.699L498.863 526.149L475.586 548.6H45.6001V70.6627L59.743 56.5823Z"
              fill="#0097A7"
            />
          </g>
          <g filter="url(#filter3_dd_273_13)">
            <path
              d="M69.4009 103.6414L132.226 42.5996L434.133 43.0177V110.749L488.668 165.101V389.618L362.146 517.973H212.938L69.4009 369.131V103.6414Z"
              fill="white"
            />
          </g>
          <path
            d="M45.9399 133.39L130.471 45.655L132.65 42.5996H73.7363L45.9399 70.0996V133.39Z"
            fill="#0097A7"
          />
          <g filter="url(#filter4_i_273_13)">
            <path
              d="M69.4021 98.5996L45.9399 122.1L46.8248 548.582H69.4021V98.5996Z"
              fill="#FE7702"
            />
          </g>
          <g filter="url(#filter5_f_273_13)">
            <path
              d="M46.6001 72.2467V132.6L138.6 42.5996H76.7288L46.6001 72.2467Z"
              fill="black"
              fillOpacity="0.984"
            />
          </g>
          <path
            d="M45.6001 70.5996V127.6L131.6 42.5996H73.7638L45.6001 70.5996Z"
            fill="#0097A7"
          />
          <defs>
            <filter
              id="filter0_dii_273_13"
              x="9.72748e-05"
              y="-0.000391006"
              width="565.2"
              height="585.2"
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
              <feMorphology
                radius="3"
                operator="dilate"
                in="SourceAlpha"
                result="effect1_dropShadow_273_13"
              />
              <feOffset dy="1.2" />
              <feGaussianBlur stdDeviation="3.18" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_273_13"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_273_13"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="6" dy="-6" />
              <feGaussianBlur stdDeviation="3.84" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect2_innerShadow_273_13"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-1.2" dy="7.2" />
              <feGaussianBlur stdDeviation="2.4" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_273_13"
                result="effect3_innerShadow_273_13"
              />
            </filter>
            <filter
              id="filter1_d_273_13"
              x="10"
              y="10.6"
              width="542"
              height="576"
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
              <feOffset dx="-3.6" dy="5.4" />
              <feGaussianBlur stdDeviation="5.40" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_273_13"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_273_13"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_dd_273_13"
              x="30.6001"
              y="21.59961"
              width="510"
              height="542"
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
              <feOffset dx="3.6" dy="-2.4" />
              <feGaussianBlur stdDeviation="5.40" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_273_13"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="10.8" dy="-6" />
              <feGaussianBlur stdDeviation="2.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_273_13"
                result="effect2_dropShadow_273_13"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_273_13"
                result="shape"
              />
            </filter>
            <filter
              id="filter3_dd_273_13"
              x="57.3635"
              y="30.8996"
              width="455.004"
              height="516.131"
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
              <feOffset dx="1.22" dy="15.2" />
              <feGaussianBlur stdDeviation="3.92" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.816 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_273_13"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="14.4" />
              <feGaussianBlur stdDeviation="3.51" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_273_13"
                result="effect2_dropShadow_273_13"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_273_13"
                result="shape"
              />
            </filter>
            <filter
              id="filter4_i_273_13"
              x="45.9399"
              y="98.5996"
              width="23.4619"
              height="454.063"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4.9" />
              <feGaussianBlur stdDeviation="5.84" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_273_13"
              />
            </filter>
            <filter
              id="filter5_f_273_13"
              x="42.6001"
              y="38.5996"
              width="100"
              height="98"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="2.4"
                result="effect1_foregroundBlur_273_13"
              />
            </filter>
            <linearGradient
              id="paint0_linear_273_13"
              x1="282.6"
              y1="30.5996"
              x2="457.682"
              y2="512.969"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#28AEB5" />
              <stop offset="1" stopColor="#127E84" />
            </linearGradient>
          </defs>
        </svg>
        {/* HTML overlay — lifted out of <foreignObject> so Safari paints it
            in a single HTML pass instead of waiting for the SVG body. Position
            mirrors the old foreignObject (x=85 y=82 w=370 h=320 within a
            566×586 viewBox). */}
        <div
          className="absolute"
          style={{
            left: "15.02%",
            top: "13.99%",
            width: "65.37%",
            height: "54.61%",
          }}
        >
          <div className="flex flex-col items-center justify-center pt-16 h-full">
            <Image
              src="/images/footer-logo.png"
              alt="Footer logo"
              width={1000}
              height={1000}
              className="h-[111px] w-full object-contain px-6 sm:-mt-16 -mt-10"
            />
            <p className="text-left font-bold mt-6 font-montserrat text-[#2A2A2A] pl-8 text-[19px] leading-tight">
              Expert Probate, Conservatorship, and Trust Real Estate Services
              handled personally from start to finish. Trusted by attorneys.
              Relied on by families. Built to keep the process moving, even
              when things get complicated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
