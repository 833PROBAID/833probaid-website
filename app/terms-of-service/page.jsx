import { Fragment } from "react";
import BooksHero from "@/components/BooksHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { scopeCSS } from "@/app/utils/scopeCSS";
import publicPageStyles from "@/components/GrapesJSEditor/publicPageStyles";
import { EFFECTIVE_DATE, TERMS_SECTIONS } from "./termsContent";

/**
 * Same design system the homebook pages (e.g. /homebooks/your-resource-center)
 * render with, scoped to the content container. Comments are stripped first
 * because scopeCSS would fold them into the following selector.
 */
const designSystemCSS = scopeCSS(
  publicPageStyles.replace(/\/\*[\s\S]*?\*\//g, ""),
  ".homebook-content"
);

const PAGE_TITLE = "Terms of Use, Privacy Policy & Professional Disclosure";
const PAGE_DESCRIPTION =
  "833PROBAID® website terms of use, privacy policy, and professional disclosures for probate, trust, conservatorship, and fiduciary real estate services.";

export const metadata = {
  title: `${PAGE_TITLE} | 833PROBAID`,
  description: PAGE_DESCRIPTION,
  robots: "index, follow",
  alternates: { canonical: "https://833probaid.com/terms-of-service" },
  openGraph: {
    title: `${PAGE_TITLE} | 833PROBAID`,
    description: PAGE_DESCRIPTION,
    url: "https://833probaid.com/terms-of-service",
    type: "website",
  },
};

/**
 * Paints the words "teal" and "orange" in their brand colors and turns
 * "(833) PROBAID" into a teal phone link. Inline styles (not
 * text-primary/secondary) so the parent hover color swap doesn't flip them.
 */
const BRAND_WORD_COLORS = {
  teal: "var(--primary)",
  orange: "var(--secondary)",
};
const HIGHLIGHT_REGEX = /(\(833\) PROBAID|\bteal\b|\borange\b)/i;

function withBrandColors(text) {
  if (!text || !HIGHLIGHT_REGEX.test(text)) return text;
  return text.split(new RegExp(HIGHLIGHT_REGEX, "gi")).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("(833)")) {
      return (
        <a
          key={i}
          href="tel:+18337762243"
          className="whitespace-nowrap"
          style={{ color: "var(--primary)" }}
        >
          {part}
        </a>
      );
    }
    return (
      <span key={i} style={{ color: BRAND_WORD_COLORS[part.toLowerCase()] }}>
        {part}
      </span>
    );
  });
}

/** Renders "®" as a superscript, matching the homebook content markup. */
function withReg(text) {
  if (!text?.includes("833PROBAID®")) return withBrandColors(text);
  const regex = /833PROBAID®(?= |,|\.)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    const end = match.index + match[0].length;
    const nextChar = text[end];

    parts.push(
      <Fragment key={key++}>
        {withBrandColors(text.slice(lastIndex, match.index))}
        <span
          className={`text-primary inline-block whitespace-nowrap after:relative after:bottom-1.5 ${
            nextChar === " "
              ? "after:content-['®\\00a0']"
              : "after:content-['®']"
          }`}
        >
          833PROBAID
        </span>
      </Fragment>
    );

    lastIndex = end + (nextChar === " " ? 1 : 0);
  }

  parts.push(
    <Fragment key={key++}>{withBrandColors(text.slice(lastIndex))}</Fragment>
  );

  return parts;
}

function Block({ block }) {
  switch (block.type) {
    case "block":
      return (
        <div
          className={`content-block shadow-card !p-[1.5rem]`}
          style={{
            marginBottom: block.marginBottom ?? "2.5rem",
          }}
        >
          {block.items.map((item, i) => (
            <Block key={i} block={item} />
          ))}
        </div>
      );
    case "lead":
      return (
        <p
          className="body-text text-bold"
          style={{ marginTop: "-0.3em", marginBottom: "1.5rem" }}
        >
          {withReg(block.text)}
        </p>
      );
    case "heading":
      return (
        <h2 className="section-title text-secondary !mb-[1.5rem] !text-[2.25rem] font-anton uppercase">
          {withReg(block.text)}
        </h2>
      );
    case "points":
      return (
        <div className="points-wrapper" style={{ marginBottom: "1rem" }}>
          {block.items.map((item, i) => (
            <div key={i} className="point-item shadow-card">
              <img src="/images/arrow.png" className="point-icon" alt="" />
              <div>
                {item.label && (
                  <p className="body-text text-primary text-bold">
                    {withReg(item.label)}
                  </p>
                )}
                <p className="body-text text-bold">{withReg(item.text)}</p>
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <p
          className={`body-text text-bold ${block.primary && "text-primary"} ${
            block.secondary && "!text-secondary group-hover:!text-primary"
          }`}
          style={{
            marginTop: block.top ? block.top : "-0.3em",
            marginBottom: block.last ? "-0.3em" : "1.5rem",
          }}
        >
          {withReg(block.text)}
        </p>
      );
  }
}

export default function TermsOfServicePage() {
  return (
    <section className="font-montserrat">
      <Navbar />
      <section className="mx-auto mt-5 max-w-7xl px-4 md:px-0">
        <BooksHero
          bannerImage="/images/hero-image.png"
          title="Terms of Use & Privacy Policy"
          subtitle={`Professional Disclosure • Effective Date: ${EFFECTIVE_DATE}`}
        />

        <div className="mt-[12rem] mb-3">
          <style dangerouslySetInnerHTML={{ __html: designSystemCSS }} />
          <div
            className="homebook-content flex flex-col gap-10 group"
            style={{
              contain: "layout style",
              isolation: "isolate",
              position: "relative",
              zIndex: 1,
            }}
          >
            <section>
              <div className="content-block shadow-card">
                <h2 className="section-title text-secondary !mb-[2.5rem] !mt-0 !text-[4rem]">
                  WEBSITE TERMS OF USE, PRIVACY POLICY, AND PROFESSIONAL
                  DISCLOSURE
                </h2>
                {TERMS_SECTIONS.map((section, index) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className="content-block shadow-card !p-[1.5rem]"
                    style={{
                      marginBottom: section.marginBottom ?? "2.5rem",
                    }}
                  >
                    <h2 className="section-title text-primary !mt-0 !mb-[1.5rem] !text-[3rem]">
                      {section.title}
                    </h2>
                    {section.blocks.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section id="contact-information">
              <div className="conclusion-block">
                <div className="conclusion-content">
                  <h2 className="section-title text-secondary !mb-[1.5rem] !text-[3rem]">
                    Contact Information
                  </h2>
                  <p
                    className="body-text text-bold"
                    style={{ marginBottom: "1.5rem", marginTop: "-0.3em" }}
                  >
                    If you have questions regarding these Terms of Use, Privacy
                    Policy, or Disclosures, please contact us at:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div className="contact-item">
                      <img
                        src="/images/footer-logo.png"
                        alt=""
                        style={{ height: 100, width: "auto", objectFit: "contain"}}
                      />
                    </div>
                    <div
                      className="contact-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <img
                        src="/svgs/location-pin.svg"
                        alt=""
                        style={{
                          width: "2rem",
                          height: "2rem",
                          flexShrink: 0,
                          margin: "-2.1em -1px 0px 1px",
                        }}
                      />
                      <p className="body-text text-bold !leading-[1.4]">
                        311 N. Robertson Blvd, Suite 444
                        <br />
                        Beverly Hills, CA 90211
                      </p>
                    </div>
                    <div
                      className="contact-item probaid-phone"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <img
                        src="/svgs/phone-icon.svg"
                        alt=""
                        style={{ width: "2rem", height: "2rem", flexShrink: 0 }}
                        className="!relative !mt-[-0.1em] left-[0.1em]"
                      />
                      <div className="body-text text-bold !leading-[1.1]">
                        <span className="text-bold text-secondary">
                          (833){" "}
                          <span className="tracking-[0.07em]">PROBAID</span>
                        </span>
                        <br />
                        <span className="text-bold text-primary !ml-16 tracking-[0.17em]">
                          7762243
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="content-block shadow-card">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src="/svgs/location-pin.svg"
                      alt=""
                      style={{ width: "2rem", height: "2rem", flexShrink: 0 }}
                    />
                    <p className="body-text text-bold">
                      <span className="text-secondary">
                        833PROBAID<sup>®</sup>
                      </span>
                      <br />
                      311 N. Robertson Blvd, Suite 444
                      <br />
                      Beverly Hills, CA 90211
                    </p>
                  </div>
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src="/svgs/phone-icon.svg"
                      alt=""
                      style={{ width: "2rem", height: "2rem", flexShrink: 0 }}
                    />
                    <a href="tel:+18337762243" className="body-text text-bold">
                      <span className="text-secondary">(833) PROBAID</span>{" "}
                      &#8212;{" "}
                      <span className="text-primary">(833) 776-2243</span>
                    </a>
                  </div>
                </div>
              </div> */}
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
}
