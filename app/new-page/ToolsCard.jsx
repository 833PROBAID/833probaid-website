import BookCard, { BookCardDefs } from "./BookCard";
import { getPublishedHomeBooksForHomepage } from "@/app/services/homeBookService";
import Image from "next/image";

// ══════════════════════════════════════════════════════════════════════
//  Static fallback cards — shown when the DB returns nothing.
//  — title       : shown in the orange band + inner page heading
//  — subtitle    : italic line shown above the band and on inner page
//  — description : body copy on the inner page (not on the cover)
//  — imageSrc    : path to image shown on inner page; "" = placeholder
//  — tag         : small badge top-left on inner page ("SERVICE", "TOOL"…)
// ══════════════════════════════════════════════════════════════════════
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
    <div
      className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[13px] bg-[#129fb0] p-6 pt-0! h-[500px]"
      style={{
        transformStyle: "preserve-3d",
        boxShadow: `
      inset 0 0 0 1px #014E57,
      inset 0px 6px 4px rgba(255,255,255,0.25),
      inset -5px -6px 4px rgba(0,0,0,0.25),
      5px -6px 15.1px rgba(0,0,0,0.80),
      -2px 6px 11.3px rgba(0,0,0,0.9)
    `,
      }}
    >
      {/* ── ORANGE DECORATIVE SHAPE — behind inner panel ── */}
      <div
        className="absolute left-0 top-0 h-[300px] w-full"
        style={{
          backgroundColor: "#FE7702",
          clipPath: "polygon(0 0, 100% 0, 100% 28%, 66% 49%, 35% 49%, 0 28%)",
        }}
        aria-hidden="true"
      />

      {/* ── SHADOW WRAPPER — sits above orange ── */}
      <div
        className="absolute top-0 left-6 right-6 bottom-6 sm:left-10 sm:right-10 sm:bottom-10 md:left-12 md:right-12 md:bottom-12 z-20"
        style={{
          filter:
            "drop-shadow(1.02px 16px 13.06px #000000AD) drop-shadow(12px 0px 11.7px #00000080)",
        }}
      >
        {/* ── INNER CONTENT PANEL ── */}
        <div
          className="relative bg-[#0b8fa0] p-6 sm:p-10 md:p-12 h-full w-full pr-10"
          style={{
            clipPath:
              "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 88% 100%, 15% 100%, 0% 85%, 0% 15%)",
            WebkitClipPath:
              "polygon(12% 0%, 88% 0%, 100% 12%, 100% 84%, 88% 100%, 12% 100%, 0% 84%, 0% 12%)",
          }}
        >
          <div className="relative z-50">
            <div className="flex flex-col items-center justify-center pt-20">
              <Image
                src="/images/footer-logo.png"
                alt="Footer logo"
                width={1000}
                height={1000}
                className="h-[111px] w-full object-contain px-6 sm:-mt-16 -mt-10 z-50"
              />
              <p className="text-left font-bold md:mt-4 font-montserrat text-[#2A2A2A] pl-6 text-[16px] leading-tight max-w-[350px]">
                Expert Probate, Conservatorship, and Trust Real Estate Services
                handled personally from start to finish. Trusted by attorneys.
                Relied on by families. Built to keep the process moving, even
                when things get complicated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
