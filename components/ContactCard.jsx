export default function ContactCard() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full" style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}>
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
          <foreignObject x="100" y="80" width="370" height="320" className="overflow-visible">
            <div className="flex flex-col items-center justify-center h-full pt-20 w-full">
              <h2 className="text-secondary text-center text-[30px] font-bold">Contact Us</h2>
              <div className="flex flex-col justify-center items-start mt-4 sm:mt-6 text-[19px]">
                <div className="mb-4 flex items-start gap-3">
                  <img src="/svgs/location-pin.svg" style={{ width: "35px" }} alt="Location" />
                  <p className="font-bold text-left">
                    311 N. Robertson Blvd #444, <br /> Beverly Hills, CA 90211
                  </p>
                </div>
                <a href="tel:8337762243" className="mb-8 flex items-center gap-3">
                  <img src="/svgs/phone-icon.svg" style={{ width: "32px" }} alt="Phone" />
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
                <a href="mailto:info@833probaid.com" className="sm:mb-6 mb-2 flex items-center gap-3">
                  <img src="/svgs/uiw_mail.svg" style={{ height: "35px" }} alt="Email" />
                  <p className="font-bold text-[19px]">Info@833probaid.com</p>
                </a>
                <a href="https://www.833probaid.com" className="flex items-center gap-3">
                  <img className="ml-0.5" src="/svgs/globe.svg" style={{ height: "30px" }} alt="Website" />
                  <p className="ml-0.5 font-bold text-[19px]">www.833probaid.com</p>
                </a>
              </div>
            </div>
          </foreignObject>
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
      </div>
    </div>
  );
}
