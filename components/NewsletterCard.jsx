"use client";

import { useEffect, useState } from "react";
import AnimatedText from "./AnimatedText";
import NewsletterSubscriptionModal from "./NewsletterSubscriptionModal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterCard() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscriptionNotice, setSubscriptionNotice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const active = document.activeElement;
    if (active && typeof active.blur === "function") {
      active.blur();
    }
  }, [isOpen]);

  const handleOpen = (event) => {
    event.preventDefault();
    const rawEmail = String(newsletterEmail || "").trim();
    const normalizedEmail = rawEmail.toLowerCase();
    if (!rawEmail) {
      setSubscriptionNotice("Add your email in the popup before submitting.");
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setSubscriptionNotice(
        "Your email looks invalid. Please correct it in the popup.",
      );
    } else {
      setSubscriptionNotice("");
    }
    setNewsletterEmail(normalizedEmail || rawEmail);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setSubscriptionNotice("");
    setNewsletterEmail("");
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 558 576"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_dii_273_11)">
              <path
                d="M10.5996 31.5996C10.5996 19.4493 20.4493 9.59961 32.5996 9.59961H524.6C536.75 9.59961 546.6 19.4493 546.6 31.5996V541.6C546.6 553.75 536.75 563.6 524.6 563.6H32.5996C20.4493 563.6 10.5996 553.75 10.5996 541.6V31.5996Z"
                fill="#0097A7"
              />
              <path
                d="M32.5996 10.0996H524.6C536.474 10.0996 546.1 19.7255 546.1 31.5996V541.6C546.1 553.474 536.474 563.1 524.6 563.1H32.5996C20.7255 563.1 11.0996 553.474 11.0996 541.6V31.5996C11.0996 19.7255 20.7255 10.0996 32.5996 10.0996Z"
                stroke="#005E68"
              />
            </g>
            <g filter="url(#filter1_d_273_11)">
              <path
                d="M501.457 40.5823L487.314 26.5996H41.5996V487.699L62.3371 510.149L85.6139 532.6H515.6V54.6627L501.457 40.5823Z"
                fill="url(#paint0_linear_273_11)"
              />
            </g>
            <g filter="url(#filter2_d_273_11)">
              <path
                d="M501.457 40.5823L487.314 26.5996H41.5996V487.699L62.3371 510.149L85.6139 532.6H515.6V54.6627L501.457 40.5823Z"
                fill="#0097A7"
              />
            </g>
            <g filter="url(#filter3_dd_273_11)">
              <path
                d="M491.795 87.6414L428.97 26.5996L127.063 27.0177V94.749L72.5277 149.101V373.618L199.05 501.973H348.258L491.795 353.131V87.6414Z"
                fill="white"
              />
            </g>
            <g filter="url(#filter4_i_273_11)">
              <path
                d="M491.604 86.7871L515.447 111.736L514.548 533.597H491.604V86.7871Z"
                fill="#FE7702"
              />
            </g>
            <g filter="url(#filter5_f_273_11)">
              <path
                d="M515.6 56.2467V116.6L423.6 26.5996H485.471L515.6 56.2467Z"
                fill="black"
                fillOpacity="0.984"
              />
            </g>
            <path
              d="M515.6 54.5996V111.6L429.6 26.5996H487.436L515.6 54.5996Z"
              fill="#0097A7"
            />
            <foreignObject
              x="60"
              y="70"
              width="450"
              height="370"
              className="overflow-visible"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center pt-8 h-full md:-mt-1 -mt-6">
                  <h2 className="text-[#0097A7] text-center text-[30px] font-bold  font-roboto mb-6 md:mb-0 pl-6">
                    Join Our Newsletter
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="pl-10 mt-2">
                      <p className="font-bold text-sm md:text-[17px]">
                        Stay up to date with the latest news and updates from{" "}
                        <b className="text-primary">
                          833PROBAID
                          <span
                            style={{
                              verticalAlign: "super",
                              fontSize: "0.9em",
                              lineHeight: "0",
                            }}
                          >
                            ®
                          </span>
                        </b>
                        .
                      </p>
                      <p className="font-bold text-sm md:text-[17px] mt-4 ">
                        Subscribe to our newsletter.
                      </p>
                    </div>
                    <form onSubmit={handleOpen} className="pl-5">
                      <div className="border-secondary mx-auto mt-4 mb-5 w-[90%] border-b-4">
                        <input
                          type="email"
                          placeholder="Enter your E-mail"
                          value={newsletterEmail}
                          onChange={(event) => {
                            setNewsletterEmail(event.target.value);
                            if (subscriptionNotice) setSubscriptionNotice("");
                          }}
                          className="placeholder-secondary bg-transparent py-2.5 text-[20px] font-semibold outline-none placeholder:font-extrabold"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </foreignObject>
            <style>{`
							.footer-btn-float {
								animation: footerBtnFloat 2.5s ease-in-out infinite;
								transform-box: fill-box;
								transform-origin: center center;
								cursor: pointer;
							}
							.footer-btn-float:focus,
							.footer-btn-float:focus-visible {
								outline: none;
							}
							.footer-subscribe-btn {
								transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
								transform-box: fill-box;
								transform-origin: center center;
							}
							.footer-btn-float:hover .footer-subscribe-btn {
								transform: rotate(-2deg) scale(1.08);
							}
							@keyframes footerBtnFloat {
								0%, 100% { transform: translateY(0px); }
								50% { transform: translateY(-8px); }
							}
						`}</style>
            <g
              className="footer-btn-float"
              onClick={(event) => {
                if (isOpen) return;
                handleOpen(event);
              }}
              onKeyDown={(event) => {
                if (isOpen) return;
                if (event.key === "Enter" || event.key === " ") {
                  handleOpen(event);
                }
              }}
              role="button"
              tabIndex={isOpen ? -1 : 0}
              aria-label="Subscribe"
            >
              <image
                href="/svgs/subscribe.svg"
                x="183"
                y="385"
                width="200"
                height="67"
                className="footer-subscribe-btn"
              />
            </g>
            <defs>
              <filter
                id="filter0_dii_273_11"
                x="-0.000391006"
                y="-0.000391006"
                width="557.2"
                height="575.2"
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
                <feOffset dy="1.2" />
                <feGaussianBlur stdDeviation="6.36" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_273_11"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_273_11"
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
                  result="effect2_innerShadow_273_11"
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
                  in2="effect2_innerShadow_273_11"
                  result="effect3_innerShadow_273_11"
                />
              </filter>
              <filter
                id="filter1_d_273_11"
                x="26.2996"
                y="20.2996"
                width="510.6"
                height="542.6"
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
                <feOffset dx="3.6" dy="14.4" />
                <feGaussianBlur stdDeviation="10.98" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_273_11"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_273_11"
                  result="shape"
                />
              </filter>
              <filter
                id="filter2_d_273_11"
                x="18.2996"
                y="4.29961"
                width="510.6"
                height="542.6"
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
                <feOffset dx="-6" dy="-4.8" />
                <feGaussianBlur stdDeviation="10.98" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.996 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_273_11"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_273_11"
                  result="shape"
                />
              </filter>
              <filter
                id="filter3_dd_273_11"
                x="48.8273"
                y="18.8996"
                width="455.005"
                height="514.131"
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
                <feOffset dx="-1.22" dy="21.6" />
                <feGaussianBlur stdDeviation="7.83" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.816 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_273_11"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-14.4" dy="4.8" />
                <feGaussianBlur stdDeviation="7.02" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_dropShadow_273_11"
                  result="effect2_dropShadow_273_11"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_273_11"
                  result="shape"
                />
              </filter>
              <filter
                id="filter4_i_273_11"
                x="491.604"
                y="86.7871"
                width="23.8438"
                height="450.957"
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
                <feOffset dy="4.98" />
                <feGaussianBlur stdDeviation="11.88" />
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
                  result="effect1_innerShadow_273_11"
                />
              </filter>
              <filter
                id="filter5_f_273_11"
                x="419.6"
                y="22.5996"
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
                  result="effect1_foregroundBlur_273_11"
                />
              </filter>
              <linearGradient
                id="paint0_linear_273_11"
                x1="278.6"
                y1="26.5996"
                x2="110.176"
                y2="518.329"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#28AEB5" />
                <stop offset="1" stopColor="#107C81" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <NewsletterSubscriptionModal
        isOpen={isOpen}
        initialEmail={newsletterEmail}
        entryMessage={subscriptionNotice}
        onClose={() => {
          setIsOpen(false);
          setSubscriptionNotice("");
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}
