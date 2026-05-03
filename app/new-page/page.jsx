import BookCard, { BookCardDefs } from "./BookCard";
import { getPublishedHomeBooksForHomepage } from "@/app/services/homeBookService";
import Image from "next/image";
import Footer from "@/components/Footer";

// ══════════════════════════════════════════════════════════════════════
//  Static fallback cards — shown when the DB returns nothing.
//  — title       : shown in the orange band + inner page heading
//  — subtitle    : italic line shown above the band and on inner page
//  — description : body copy on the inner page (not on the cover)
//  — imageSrc    : path to image shown on inner page; "" = placeholder
//  — tag         : small badge top-left on inner page ("SERVICE", "TOOL"…)
// ══════════════════════════════════════════════════════════════════════
const FALLBACK_CARDS = [
  {
    id: "fallback-1",
    title: "Probate Consulting",
    subtitle: "Trusted guidance for every estate",
    description:
      "End-to-end support navigating probate court, property valuations, and heir coordination.",
    imageSrc: "",
    tag: "SERVICE",
  },
  {
    id: "fallback-2",
    title: "Estate Planning",
    subtitle: "Plan ahead, protect your legacy",
    description:
      "Comprehensive estate planning services to ensure your assets are distributed according to your wishes.",
    imageSrc: "",
    tag: "SERVICE",
  },
  {
    id: "fallback-3",
    title: "Property Valuation",
    subtitle: "Accurate valuations you can trust",
    description:
      "Professional appraisals for probate properties, trust sales, and conservatorship estates.",
    imageSrc: "",
    tag: "SERVICE",
  },
  {
    id: "fallback-4",
    title: "Court Confirmation",
    subtitle: "Navigate the overbid process",
    description:
      "Expert guidance through court-confirmed sales, overbid procedures, and probate auction strategy.",
    imageSrc: "",
    tag: "TOOL",
  },
];
// ══════════════════════════════════════════════════════════════════════

export const revalidate = 300;

function mapHomeBookForCard(homeBook) {
  const id = homeBook?._id?.toString?.() || homeBook?.id || "";
  return {
    id,
    title: homeBook?.title || "Untitled",
    subtitle: homeBook?.subtitle || "",
    description: homeBook?.description || "",
    imageSrc: homeBook?.image || "",
    icon: homeBook?.icon || "",
    slug: homeBook?.slug || "",
  };
}

export default async function NewPage() {
  let cards = [];

  try {
    const homeBooks = await getPublishedHomeBooksForHomepage();
    const mapped = (homeBooks || []).map(mapHomeBookForCard);
    cards = mapped.length > 0 ? mapped : FALLBACK_CARDS;
  } catch (error) {
    console.error("Failed to load homepage home books:", error);
    cards = FALLBACK_CARDS;
  }
  return (
    <main className="min-h-screen bg-[#e8f0f2] py-20">
      <BookCardDefs />
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 place-items-center">
        {cards.slice(1, 7).map((card, index) => (
          <BookCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            imageSrc={card.imageSrc}
            icon={card.icon}
            slug={card.slug}
            mirrored={index % 2 !== 0}
            speed={3000}
            // ← change flip animation speed (ms)
            // width="320px"  ← change card width
            // height="480px" ← change card height
          />
        ))}
      </section>

      <footer className="flex justify-center items-center w-full max-w-[1400px] mx-auto px-4 mt-20">
        {/* ── Layer 1: outermost teal frame── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center justify-center">
          <div
            className="relative mx-auto w-full max-w-4xl rounded-[13px] bg-[#129fb0] p-[20px] h-[500px]"
            style={{
              boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset -5px -6px 4px rgba(0,0,0,0.25),
              5px -6px 15.1px rgba(0,0,0,0.80),
              -2px 6px 11.3px rgba(0,0,0,0.80)
            `,
            }}
          >
            {/* ── Layer 2: drop-shadow applied directly on clip-path element for Safari ── */}
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative bg-[#0b8fa0] h-full w-full"
                style={{
                  clipPath:
                    "polygon(8% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 8%)",
                  WebkitClipPath:
                    "polygon(8% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 8%)",
                  filter:
                    "drop-shadow(1.02px 4px 12.06px #000) drop-shadow(3px 0px 3.7px #00000099) drop-shadow(0px -5px 8.06px #00000090) drop-shadow(-7px 0px 6.7px #00000066)",
                  WebkitFilter:
                    "drop-shadow(1.02px 4px 12.06px #000) drop-shadow(3px 0px 3.7px #00000099) drop-shadow(0px -5px 8.06px #00000090) drop-shadow(-7px 0px 6.7px #00000066)",
                }}
              >
                {/* Orange left-edge accent stripe — #FE7702 */}

                <div
                  className="absolute bottom-0 left-0 top-0 w-[18px] z-30"
                  style={{ backgroundColor: "#FE7702" }}
                  aria-hidden="true"
                />

                {/* Corner fold — white triangle, top-left of Layer 2 */}
                <div
                  className="absolute left-0 top-0 z-40 h-[72px] w-[72px]"
                  style={{
                    backgroundColor: "#0097A7",
                    clipPath: "polygon(40% 0, 100% 0%, 0 100%, 0 40%)",
                    filter:
                      "drop-shadow(1.02px 16px 13.06px #000000AD) drop-shadow(12px 0px 11.7px #00000080)",
                    backdropFilter: "blur(9.1px)",
                    WebkitBackdropFilter: "blur(9.1px)",
                  }}
                  aria-hidden="true"
                />

                {/* ── Layer 3: white octagon content panel
                  Outer shadows via filter:drop-shadow so clip-path is preserved. ── */}
                <div
                  className="h-full w-full"
                  style={{
                    filter:
                      "drop-shadow(1.02px 16px 13.06px #000000AD) drop-shadow(12px 0px 11.7px #00000080)",
                  }}
                >
                  <div
                    className="relative bg-white p-6 sm:p-10 md:p-12 h-full w-full pr-10"
                    style={{
                      clipPath:
                        "polygon(80% 0, 80% 14%, 94% 25%, 94% 75%, 65% 100%, 29% 100%, 0 65%, 0 0)",
                      WebkitClipPath:
                        "polygon(80% 0, 80% 14%, 94% 25%, 94% 75%, 65% 94%, 29% 94%, 0 65%, 0 0)",
                    }}
                  >
                    {/* ── PLACEHOLDER: swap this block with real logo + copy ── */}
                    <div className="relative z-10">
                      <div className="flex flex-col items-center justify-center pt-20 ">
                        <Image
                          src="/images/footer-logo.png"
                          alt="Footer logo"
                          width={1000}
                          height={1000}
                          className="h-[111px] w-full object-contain px-6 sm:-mt-16 -mt-10"
                        />

                        <p className="text-left font-bold md:mt-4 font-montserrat text-[#2A2A2A] pl-6 text-[16px] leading-tight max-w-[350px]">
                          Expert Probate, Conservatorship, and Trust Real Estate
                          Services handled personally from start to finish.
                          Trusted by attorneys. Relied on by families. Built to
                          keep the process moving, even when things get
                          complicated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative mx-auto w-full overflow-hidden rounded-[13px] bg-[#129fb0] p-[20px] h-full "
            style={{
              boxShadow:
                "0px 1px 10.6px 4px #000000D4, 5px -5px 6.4px 0px #00000040 inset, -1px 6px 4px 0px #FFFFFF40 inset",
            }}
          >
            {/* Layer 2: inner teal frame — individual shadows via box-shadow (no clip-path here) */}
            <div
              className="relative rounded-[18px] bg-[#0b8fa0] px-[25px] pb-6 h-full"
              style={{
                boxShadow:
                  "inset 0 0 0 1px #014E57, inset 0px 6px 4px rgba(255,255,255,0.25), inset -5px -6px 4px rgba(0,0,0,0.25), 3px -3px 10.6px 0px #000000D4, 2px -8px 5.6px 0px #00000087, 0px -6px 13.7px 0px #0000006E, -8px -7px 4px 0px #00000040, 8px -7px 4px 0px #00000040, 10px 11px 10.1px 0px #0000007D, 7px 11px 4px 0px #0000004A, -12px -5px 8px 0px #00000078, -8px 9px 11px 0px #000000BF, 8px -6px 5.5px 0px #000000",
              }}
            >
              {/* Layer 3: orange corner accents — behind the white panel */}
              {/* Orange top-left corner accent */}
              <div
                className="absolute left-0 top-0 z-10 h-[300px] w-full"
                style={{
                  backgroundColor: "#FE7702",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 28%, 66% 49%, 35% 49%, 0 28%)",
                }}
                aria-hidden="true"
              />
              {/* Orange top-right corner accent */}
              {/* Layer 4: white octagon — topmost (z-20).
                  clip-path clips box-shadow, so outer shadows live on a
                  filter:drop-shadow wrapper instead. ── */}
              <div
                className="relative z-20 h-full"
                style={{
                  filter:
                    "drop-shadow(1.02px 16px 13.06px #000000AD) drop-shadow(12px 0px 11.7px #00000080)",
                }}
              >
                <div
                  className="relative bg-white px-8 py-10 sm:px-8 sm:py-14 h-full"
                  style={{
                    clipPath:
                      "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 88% 100%, 15% 100%, 0% 85%, 0% 15%)",
                    WebkitClipPath:
                      "polygon(12% 0%, 88% 0%, 100% 12%, 100% 84%, 88% 100%, 12% 100%, 0% 84%, 0% 12%)",
                  }}
                >
                  {/* ── Contact Us heading ── */}
                  <div className="relative pt-8 h-full">
                    <div className="flex flex-col items-center justify-center h-full -mt-4 md:-mt-4">
                      <h2 className="text-secondary text-center text-[30px] font-bold floating-text">
                        Contact Us
                      </h2>
                      <div className="flex flex-col justify-center items-start">
                        <div className="mb-4 flex items-start gap-3 ">
                          <img
                            src="/svgs/location-pin.svg"
                            style={{ width: "28px", marginTop: "4px" }}
                            alt="Location"
                          />
                          <p className="font-bold text-left text-sm md:text-[17px]">
                            311 N. Robertson Blvd #444, Beverly Hills, CA 90211
                          </p>
                        </div>
                        <a
                          href="tel:8337762243"
                          className="mb-8 flex items-center gap-3"
                        >
                          <img
                            src="/svgs/phone-icon.svg"
                            style={{ width: "28px" }}
                            alt="Phone"
                          />
                          <div className="flex flex-row items-start justify-start text-xl  md:text-3xl">
                            <b className="text-secondary font-bold ">
                              (833)&nbsp;
                            </b>
                            <div className="flex flex-col gap-3">
                              <b className="text-secondary tracking-[0.1rem] font-bold ">
                                PROBAID
                              </b>
                              <b className="text-primary leading-0.5 tracking-[0.28rem] font-bold ml-2 md:ml-1">
                                7762243
                              </b>
                            </div>
                          </div>
                        </a>

                        <a
                          href="mailto:info@833probaid.com"
                          className="sm:mb-4 mb-2 flex items-center gap-3"
                        >
                          <img
                            src="/svgs/uiw_mail.svg"
                            style={{ width: "28px" }}
                            alt="Email"
                          />
                          <p className="font-bold md:text-lg">
                            Info@833probaid.com
                          </p>
                        </a>

                        <a
                          href="https://www.833probaid.com"
                          className="flex items-center gap-3"
                        >
                          <img
                            className="ml-0.5"
                            src="/svgs/globe.svg"
                            style={{ width: "25px" }}
                            alt="Website"
                          />
                          <p className="ml-0.5 font-bold md:text-lg">
                            www.833probaid.com
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* closes filter wrapper */}
            </div>
            {/* closes Layer 2 */}
          </div>
          <div
            className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[13px] bg-[#129fb0] p-[20px] h-[500px]"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: `
              inset 0 0 0 1px #014E57,
              inset 0px 6px 4px rgba(255,255,255,0.25),
              inset 5px -6px 4px rgba(0,0,0,0.25),
              -5px -6px 15.1px rgba(0,0,0,0.80),
              2px 6px 11.3px rgba(0,0,0,0.80)
            `,
            }}
          >
            {/* ── Layer 2: inner teal frame
                render outside the clip-path boundary (box-shadow is clipped). ── */}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                filter:
                  "drop-shadow(-1.02px 4px 12.06px #000) drop-shadow(-3px 0px 3.7px #00000099) drop-shadow(0px -5px 8.06px #00000090) drop-shadow(7px 0px 6.7px #00000066)",
              }}
            >
              <div
                className="relative bg-[#0b8fa0] h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: `
                inset 0 0 0 1px #014E57,
                inset 0px 6px 4px rgba(255,255,255,0.25),
                inset 5px -6px 4px rgba(0,0,0,0.25)
              `,
                  clipPath:
                    "polygon(0 0, 92% 0, 100% 8%, 100% 100%, 10% 100%, 0 90%)",
                }}
              >
                {/* Orange right-edge accent stripe — #FE7702 */}

                <div
                  className="absolute bottom-0 right-0 top-0 w-[18px] z-30"
                  style={{ backgroundColor: "#FE7702" }}
                  aria-hidden="true"
                />

                {/* Corner fold — teal triangle, top-right of Layer 2 */}
                <div
                  className="absolute right-0 top-0 z-40 h-[72px] w-[72px]"
                  style={{
                    backgroundColor: "#0097A7",
                    clipPath: "polygon(0 0, 60% 0, 100% 40%, 100% 100%)",
                    filter:
                      "drop-shadow(-1.02px 16px 13.06px #000000AD) drop-shadow(-12px 0px 11.7px #00000080)",
                    backdropFilter: "blur(9.1px)",
                    WebkitBackdropFilter: "blur(9.1px)",
                  }}
                  aria-hidden="true"
                />

                {/* ── Layer 3: white octagon content panel
                  Outer shadows via filter:drop-shadow so clip-path is preserved. ── */}
                <div
                  className="h-full w-full"
                  style={{
                    filter:
                      "drop-shadow(-1.02px 16px 13.06px #000000AD) drop-shadow(-12px 0px 11.7px #00000080)",
                  }}
                >
                  <div
                    className="relative bg-white px-8 py-10 sm:px-8 sm:py-14 h-full"
                    style={{
                      clipPath:
                        "polygon(20% 0, 20% 14%, 6% 25%, 6% 75%, 35% 100%, 71% 100%, 100% 65%, 100% 0)",
                      WebkitClipPath:
                        "polygon(20% 0, 20% 14%, 6% 25%, 6% 75%, 35% 94%, 71% 94%, 100% 65%, 100% 0)",
                    }}
                  >
                    {/* ── PLACEHOLDER: swap this block with real logo + copy ── */}
                    <div className="relative z-10 w-full h-full">
                      <div className="flex flex-col items-center justify-center pt-8 h-full md:-mt-3 -mt-6">
                        <h2 className="text-[#0097A7] text-center text-2xl md:text-[30px] font-bold floating-text  font-roboto mb-6 md:mb-0 pl-6">
                          Join Our Newsletter
                        </h2>

                        <div className="flex flex-col gap-3 text-left pl-4">
                          <p className="font-bold text-sm md:text-[17px]">
                            Stay up to date with the latest news and updates
                            from{" "}
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
                          <p className="font-bold text-sm md:text-[17px] ">
                            Subscribe to our newsletter.
                          </p>
                          <form>
                            <div className="border-secondary  mt-2 mb-5 w-[100%] sm:w-[95%] border-b-3">
                              <input
                                type="email"
                                placeholder="Enter your E-mail"
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
                                className="footer-btn-float w-full mx-auto mt-6 sm:mr-0"
                                aria-label="Subscribe"
                              >
                                <img
                                  src="/svgs/subscribe.svg"
                                  alt="Subscribe"
                                  fill
                                  className="footer-subscribe-btn w-[150px] sm:w-[200px] mx-auto"
                                />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Footer />

      {/* ══════════════════════════════════════════════════════════════
          Contact Us section — same 3-layer card structure.
          Differences from footer card:
            · Layer 2 has orange triangles at BOTH top corners (not a white fold)
            · White panel uses a symmetric 8-point octagon clip-path
            · No left stripe — content is centered
          ══════════════════════════════════════════════════════════════ */}
    </main>
  );
}
