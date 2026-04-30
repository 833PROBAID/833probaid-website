"use client";

import { useEffect, useState } from "react";
import AnimatedText from "./AnimatedText";
import NewsletterSubscriptionModal from "./NewsletterSubscriptionModal";
import Image from "next/image";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORANGE = "#FE7702";
const ORANGE_SHADOW = "#B85500";

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
    <div>
      <div className="relative  h-[500px] overflow-hidden sm:w-[450px] w-[350px] mx-auto ">
        <Image
          src={"/newsLetter.png"}
          alt="Background"
          fill
          priority
          className="object-contain z-0 p-1"
        />

        <Image
          src={"/right-dark.png"}
          alt="Right Dark"
          width={400}
          height={200}
          priority
          className="absolute z-20 h-[80px] object-contain right-[7%] top-[15%] w-[16%]  sm:right-[3%] sm:top-[8%] sm:w-[26%]"
        />
        <Image
          src={"/new.png"}
          alt="Left Stable Footer"
          width={400}
          height={200}
          priority
          className="absolute z-20 h-[80px] object-contain right-[6%] top-[15%] w-[18%] sm:right-[5.5%] sm:top-[7%] sm:w-[20%]"
        />
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center text-left text-black sm:px-14 ">
          <div className="-mt-6 ">
            <h2 className="text-[#0097A7] text-center text-xl md:text-[30px] font-bold floating-text pl-8 font-roboto">
              Join Our Newsletter
            </h2>

            <div className="flex flex-col gap-3 text-left pl-4">
              <p className="font-bold pl-6 sm:pl-2 text-xs md:text-[17px]">
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
              <p className="font-bold text-sm md:text-[17px] sm:pl-2 pl-6">
                Subscribe to our newsletter.
              </p>
              <form onSubmit={handleOpen}>
                <div className="border-secondary mx-auto mt-2 mb-5 w-[80%] sm:w-[95%] border-b-3">
                  <input
                    type="email"
                    placeholder="Enter your E-mail"
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      if (subscriptionNotice) setSubscriptionNotice("");
                    }}
                    className="placeholder-secondary bg-transparent pt-2 text-[18px] font-semibold outline-none placeholder:font-extrabold"
                  />
                </div>
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
                <div className="mt-2 flex justify-center mx-auto items-center">
                  <button
                    type="submit"
                    className="footer-btn-float w-full mx-auto mr-8 sm:mr-0"
                    aria-label="Subscribe"
                    disabled={isOpen}
                  >
                    <img
                      src="/svgs/subscribe.svg"
                      alt="Subscribe"
                      fill
                      className="footer-subscribe-btn w-[120px] sm:w-[200px] mx-auto"
                    />
                  </button>
                </div>
              </form>
            </div>
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
    </div>
  );
}
