export default function ContactCard() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full" style={{ position: "relative", aspectRatio: "566 / 586" }}>

        {/* ── SVG 1 of 2: Background frame (outer teal + inner teal + orange) ── */}
        {/* Replaces old filter0_dii + filter1_d + filter2_d = was 3 feGaussianBlur, still 3 here but isolated */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 566 586"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          {/* Outer teal rounded rect */}
          <g filter="url(#f0)">
            <rect x="14.6001" y="13.5996" width="541" height="556" rx="22" fill="#0097A7" />
            <rect x="15.1001" y="14.0996" width="540" height="555" rx="21.5" stroke="#005E68" fill="none" />
          </g>
          {/* Inner teal rect — bottom shadow */}
          <g filter="url(#f1)">
            <rect x="45.6001" y="40.5996" width="479" height="506" fill="#0097A7" />
          </g>
          {/* Inner teal rect — top shadow */}
          <g filter="url(#f2)">
            <rect x="45.6001" y="40.5996" width="479" height="508" fill="#0097A7" />
          </g>
          {/* Orange rect LEFT */}
          <rect x="45.6001" y="40.5996" width="89" height="188" fill="#FE7702" />
          {/* Orange rect RIGHT */}
          <rect x="431.4001" y="40.5996" width="89" height="188" fill="#FE7702" />

          <defs>
            {/* filter0: outer card drop shadow + 2 inner shadows */}
            <filter id="f0" x="0" y="0" width="570.2" height="585.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="e1" />
              <feOffset dy="1.2" />
              <feGaussianBlur stdDeviation="6.36" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="s1" />
              <feBlend mode="normal" in="SourceGraphic" in2="s1" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" dy="-6" />
              <feGaussianBlur stdDeviation="3.84" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
              <feBlend mode="normal" in2="shape" result="i1" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-1.2" dy="7.2" />
              <feGaussianBlur stdDeviation="2.4" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
              <feBlend mode="normal" in2="i1" result="i2" />
            </filter>
            {/* filter1: inner teal downward shadow */}
            <filter id="f1" x="6" y="4" width="558" height="586" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feMorphology radius="4.8" operator="dilate" in="SourceAlpha" result="e1" />
              <feOffset dy="4.8" />
              <feGaussianBlur stdDeviation="10.74" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="s1" />
              <feBlend mode="normal" in="SourceGraphic" in2="s1" result="shape" />
            </filter>
            {/* filter2: inner teal upward shadow */}
            <filter id="f2" x="14" y="6" width="538" height="576" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="-4.8" />
              <feGaussianBlur stdDeviation="9.6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="s1" />
              <feBlend mode="normal" in="SourceGraphic" in2="s1" result="shape" />
            </filter>
          </defs>
        </svg>

        {/* ── SVG 2 of 2: White octagon front panel only ── */}
        {/* Replaces old filter3_dd = was 2 feGaussianBlur, still 2 here but fully isolated */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 566 586"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <g filter="url(#f3)">
            <path
              d="M76.6001 121.97L130.684 40.5996H442.044L493.095 122.672L493.6 447.453L442.044 517.6H130.794L76.6001 450.96V121.97Z"
              fill="white"
            />
          </g>
          <defs>
            {/* filter3: white panel double drop shadow */}
            <filter id="f3" x="48.238" y="31.2396" width="473.722" height="518.722" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-12" dy="11.8" />
              <feGaussianBlur stdDeviation="11.02" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.864 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="e1" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="12" dy="5.8" />
              <feGaussianBlur stdDeviation="11.016" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.864 0" />
              <feBlend mode="normal" in2="e1" result="e2" />
              <feBlend mode="normal" in="SourceGraphic" in2="e2" result="shape" />
            </filter>
          </defs>
        </svg>

        {/* ── HTML Content — sits on top, no foreignObject, pure JSX ── */}
        {/* Your dev works ONLY in here. SVGs above never need to be touched. */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "17%",
          right: "17%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <h2 className="text-secondary text-center text-[30px] font-bold mb-4">
            Contact Us
          </h2>
          <div className="flex flex-col justify-center items-start w-full gap-4 text-[19px]">

            <div className="flex items-start gap-3">
              <img src="/svgs/location-pin.svg" style={{ width: "35px", flexShrink: 0 }} alt="Location" />
              <p className="font-bold text-left m-0">
                311 N. Robertson Blvd #444, <br /> Beverly Hills, CA 90211
              </p>
            </div>

            <a href="tel:8337762243" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <img src="/svgs/phone-icon.svg" style={{ width: "32px", flexShrink: 0 }} alt="Phone" />
              <div className="flex flex-row items-start justify-start text-xl md:text-3xl">
                <b className="text-secondary font-bold">(833)&nbsp;</b>
                <div className="flex flex-col gap-3">
                  <b className="text-secondary tracking-[0.1rem] font-bold">PROBAID</b>
                  <b className="text-primary md:tracking-[0.28rem] tracking-[0.2rem] font-bold ml-0.5" style={{ lineHeight: "2px" }}>
                    7762243
                  </b>
                </div>
              </div>
            </a>

            <a href="mailto:info@833probaid.com" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <img src="/svgs/uiw_mail.svg" style={{ height: "35px", flexShrink: 0 }} alt="Email" />
              <p className="font-bold text-[19px] m-0">Info@833probaid.com</p>
            </a>

            <a href="https://www.833probaid.com" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <img className="ml-0.5" src="/svgs/globe.svg" style={{ height: "30px", flexShrink: 0 }} alt="Website" />
              <p className="ml-0.5 font-bold text-[19px] m-0">www.833probaid.com</p>
            </a>

          </div>
        </div>

      </div>
    </div>
  );
}
