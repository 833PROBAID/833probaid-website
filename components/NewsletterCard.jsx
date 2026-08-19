"use client";

import { useEffect, useState } from "react";
import AnimatedText from "./AnimatedText";
import NewsletterSubscriptionModal from "./NewsletterSubscriptionModal";
import CTAButton from "./CTAButton";
import { isValidEmail } from "@/app/utils/formValidation";

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
    } else if (!isValidEmail(normalizedEmail)) {
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
        <div className="w-full relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 566 586"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform-gpu backface-hidden"
          >
            <g filter="url(#filter0_dii_273_11)">
              <path
                d="M10.5996 31.5996C10.5996 19.4493 20.4493 9.59961 32.5996 9.59961H533.4C545.55 9.59961 555.4 19.4493 555.4 31.5996V541.6C555.4 553.75 545.55 563.6 533.4 563.6H32.5996C20.4493 563.6 10.5996 553.75 10.5996 541.6V31.5996Z"
                fill="#0097A7"
              />
              <path
                d="M32.5996 10.0996H533.4C545.274 10.0996 554.9 19.7255 554.9 31.5996V541.6C554.9 553.474 545.274 563.1 533.4 563.1H32.5996C20.7255 563.1 11.0996 553.474 11.0996 541.6V31.5996C11.0996 19.7255 20.7255 10.0996 32.5996 10.0996Z"
                stroke="#005E68"
              />
            </g>
            <g filter="url(#filter1_d_273_11)">
              <path
                d="M510.257 50.5823L496.114 36.5996H50.3996V497.699L71.1371 520.149L94.4139 542.6H524.4V64.6627L510.257 50.5823Z"
                fill="url(#paint0_linear_273_11)"
              />
            </g>
            <g filter="url(#filter2_d_273_11)">
              <path
                d="M510.257 50.5823L496.114 36.5996H50.3996V497.699L71.1371 520.149L94.4139 542.6H524.4V64.6627L510.257 50.5823Z"
                fill="#0097A7"
              />
            </g>
            <g filter="url(#filter3_dd_273_11)">
              <path
                d="M500.595 97.6414L437.77 36.5996L135.863 37.0177V104.749L81.3277 159.101V383.618L207.85 511.973H357.058L500.595 363.131V97.6414Z"
                fill="white"
              />
            </g>
            <g filter="url(#filter4_i_273_11)">
              <path
                d="M500.404 96.7871L524.247 121.736L523.348 543.597H500.404V96.7871Z"
                fill="#FE7702"
              />
            </g>
            <g filter="url(#filter5_f_273_11)">
              <path
                d="M524.4 66.2467V126.6L432.4 36.5996H494.271L524.4 66.2467Z"
                fill="black"
                fillOpacity="0.984"
              />
            </g>
            <path
              d="M524.4 64.5996V121.6L438.4 36.5996H496.236L524.4 64.5996Z"
              fill="#0097A7"
            />
            <foreignObject
              x="70"
              y="90"
              width="450"
              height="370"
              className="overflow-visible"
            >
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center pt-10">
                  <h2 className="text-[#0097A7] text-center text-[30px] font-bold  font-montserrat mb-6  pl-6">
                    Join Our Newsletter
                  </h2>
                  <div className="flex flex-col gap-3 pr-6">
                    <div className="pl-10">
                      <p className="font-bold text-[19px]">
                        Stay up to date with the latest news and updates from{" "}
                        <b className="text-primary">
                          833PROBAID
                          <span
                            style={{
                              verticalAlign: "super",
                              lineHeight: "0",
                            }}
                          >
                            ®
                          </span>
                        </b>
                        <b>.</b>
                      </p>
                      <p className="font-bold text-[19px] mt-4 ">
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
            <defs>
              <filter
                id="filter0_dii_273_11"
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
                  result="effect2_innerShadow_273_11"
                />
              </filter>
              <filter
                id="filter1_d_273_11"
                x="17.4"
                y="3.6"
                width="543.6"
                height="577"
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
                <feOffset dx="3.6" dy="8.4" />
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
                x="27.0996"
                y="14.29961"
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
                x="57.6273"
                y="28.8996"
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
                <feOffset dx="-1.22" dy="16.6" />
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
                <feOffset dx="-14.4" dy="-0.2" />
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
                x="500.404"
                y="96.7871"
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
                x="428.4"
                y="32.5996"
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
          <div className="absolute left-[32.80%] top-[68.58%] w-[35.84%] h-[10.63%] flex items-center justify-center">
            <CTAButton
              label="Subscribe"
              className="gap-2 sm:gap-1 xl:gap-3 px-4 sm:px-1 lg:px-4 h-full rounded-lg sm:rounded-sm lg:rounded-lg"
              textClassName="text-[14px] sm:text-[7px] lg:text-[11px] xl:text-[14px]"
              iconClassName="w-7 sm:w-4 lg:w-7 h-7 sm:h-4 lg:h-7"
              onClick={(event) => {
                if (isOpen) return;
                handleOpen(event);
              }}
            />
          </div>
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
