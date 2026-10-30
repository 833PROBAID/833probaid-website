import ScaledCardContent from "./ScaledCardContent";

export default function ContactCard() {
  return (
    <div className="flex w-full justify-center">
      <div className="relative -top-0.75 -left-1.25 w-full" style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 566 586"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "translate3d(0,0,0)", willChange: "transform", isolation: "isolate" }}
        >
          <g filter="url(#filter0_dii_273_12)">
            <rect x="14.6001" y="13.5996" width="541" height="556" rx="22" fill="#0097A7" />
            <rect x="15.1001" y="14.0996" width="540" height="555" rx="21.5" stroke="#005E68" />
          </g>
          <g filter="url(#filter1_d_273_12)">
            <rect x="45.6001" y="40.5996" width="479" height="506" fill="#0097A7" />
          </g>
          <g filter="url(#filter2_d_273_12)">
            <rect x="45.6001" y="40.5996" width="479" height="508" fill="#0097A7" />
          </g>
          <path d="M442.6 40.5996H524.6V168.647L442.6 228.6V40.5996Z" fill="#FE7702" />
          <path d="M134.6 40.5996H45.6001V168.647L134.6 228.6V40.5996Z" fill="#FE7702" />
          <g filter="url(#filter3_dd_273_12)">
            <path
              d="M76.6001 121.97L130.684 40.5996H442.044L493.095 122.672L493.6 447.453L442.044 517.6H130.794L76.6001 450.96V121.97Z"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_dii_273_12"
              x="-8"
              y="-8"
              width="573.2"
              height="591.2"
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
              <feOffset dx="0" dy="0" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_273_12"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_273_12"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="0" dy="0" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect2_innerShadow_273_12"
              />
            </filter>
            <filter id="filter1_d_273_12" x="6" y="4" width="558" height="586" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feMorphology radius="4.8" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_273_12" />
              <feOffset dy="4.8" />
              <feGaussianBlur stdDeviation="10.74" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_273_12" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_273_12" result="shape" />
            </filter>
            <filter id="filter2_d_273_12" x="14" y="6" width="538" height="576" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="-4.8" />
              <feGaussianBlur stdDeviation="9.6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_273_12" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_273_12" result="shape" />
            </filter>
            <filter id="filter3_dd_273_12" x="48.238" y="31.2396" width="473.722" height="518.722" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-12" dy="11.8" />
              <feGaussianBlur stdDeviation="11.02" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.864 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_273_12" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="12" dy="5.8" />
              <feGaussianBlur stdDeviation="11.016" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.864 0" />
              <feBlend mode="normal" in2="effect1_dropShadow_273_12" result="effect2_dropShadow_273_12" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_273_12" result="shape" />
            </filter>
          </defs>
        </svg>
        <ScaledCardContent x={100} y={40} width={370} height={320}>
          <div className="flex flex-col items-center justify-center pt-[calc(80*var(--u))] w-full">
            <h2 className="text-secondary text-center text-[length:calc(30*var(--u))] font-bold">Contact Us</h2>
            <div className="flex flex-col justify-center items-start gap-[1em] mt-[calc(24*var(--u))] text-[length:calc(19*var(--u))]">
              <div className="flex items-start gap-[calc(12*var(--u))]">
                <img src="/svgs/location-pin.svg" style={{ width: "calc(35*var(--u))" }} alt="Location" />
                <p className="font-bold text-left">
                  311 N. Robertson Blvd #444, <br /> Beverly Hills, CA 90211
                </p>
              </div>
              <a href="tel:8337762243" className="flex items-center gap-[calc(12*var(--u))]">
                <img src="/svgs/phone-icon.svg" style={{ width: "calc(32*var(--u))", marginTop: "-0.8em", marginLeft: "calc(1*var(--u))" }} alt="Phone" />
                <div className="leading-[1.1] text-[length:calc(19*var(--u))]">
                  <span className="text-secondary font-bold">
                    (833)&nbsp;
                    <span className="tracking-[0.07em]">PROBAID</span>
                  </span>
                  <br/>
                  <span className="font-bold text-primary !ml-[2.9em] tracking-[0.17em]" >
                    7762243
                  </span>
                </div>
              </a>
              <a href="mailto:info@833probaid.com" className="flex items-center gap-[calc(12*var(--u))]">
                <img src="/svgs/uiw_mail.svg" style={{ height: "calc(35*var(--u))", marginTop: "calc(-2*var(--u))" }} alt="Email" />
                <p className="font-bold text-[length:calc(19*var(--u))]">Info@833probaid.com</p>
              </a>
              <a href="https://www.833probaid.com" className="flex items-center gap-[calc(12*var(--u))]">
                <img src="/svgs/globe.svg" style={{ height: "calc(30*var(--u))", marginTop: "calc(2*var(--u))", marginLeft: "calc(3*var(--u))" }} alt="Website" />
                <p className="ml-[calc(2*var(--u))] font-bold text-[length:calc(19*var(--u))]">www.833probaid.com</p>
              </a>
            </div>
          </div>
        </ScaledCardContent>
      </div>
    </div>
  );
}
