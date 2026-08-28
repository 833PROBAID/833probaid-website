"use client"
import { useState, useEffect, useRef } from "react";
import ContactCard from "./ContactCard";
import LogoCard from "./LogoCard";
import NewsletterCard from "./NewsletterCard";
const MARQUEE_TEXT =
  " PROBATE · TRUST · CONSERVATORSHIP · SUCCESSOR IN INTEREST · PARTITION ACTIONS · RECEIVERSHIP ·  PROBATE · TRUST · CONSERVATORSHIP · SUCCESSOR IN INTEREST · PARTITION ACTIONS · RECEIVERSHIP · PROBATE · TRUST · CONSERVATORSHIP · SUCCESSOR IN INTEREST · PARTITION ACTIONS · RECEIVERSHIP ·  PROBATE · TRUST · CONSERVATORSHIP · SUCCESSOR IN INTEREST · PARTITION ACTIONS · RECEIVERSHIP  ";
export default function Footer() {
  const [isInView, setIsInView] = useState(false);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "-100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-primary/35 border-primary !mt-[4rem] border-y-2 pt-12">
      <div
        className="bg-secondary  py-2 mt-0.5"
        style={{
          boxShadow:
            "0 4px 4.6px rgba(0,0,0,0.62), 0 0 6px rgba(255,255,255,0.25), 0px 10px 12.7px 0px #000000A1, 0px -8px 12.7px 0px #000000A1",
        }}
      >
        <div className="overflow-hidden" ref={marqueeRef}>
          <div
            className="animate-marquee font-montserrat font-bold text-white text-[40px] lg:text-[60px] xl:text-[90px]"
            style={{ animationPlayState: isInView ? "running" : "paused" }}
          >
            <span className="[text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]">
              {MARQUEE_TEXT}
            </span>
            <span className="ml-4 [text-shadow:0_4px_4.6px_rgba(0,0,0,0.62),0_0_6px_rgba(255,255,255,0.25)]"></span>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px]  mx-auto">
        <div className="py-8">
          <div className="font-montserrat">
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 md:gap-1">
              <LogoCard />
              <ContactCard />
              <NewsletterCard />
            </div>
          </div>
        </div>

        <hr className="text-black/36" />
        <div id="terms-of-service" className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-4 font-bold md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-secondary">
              833PROBAID
              <span
                style={{
                  position: "relative",
                  top: "-5.5px",
                  lineHeight: "0",
                }}
              >
                ®
              </span>
            </span>{" "}
            . All rights reserved.
          </p>
          <a className="text-secondary" href="#">
            Privacy Policy & Terms of Service/Disclosure
          </a>
        </div>
      </div>
    </footer>
  );
}
