import BookCard, { BookCardDefs } from "./BookCard";
import { getPublishedHomeBooksForHomepage } from "@/app/services/homeBookService";

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
        {cards.slice(1, 18).map((card, index) => (
          <BookCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            imageSrc={card.imageSrc}
            icon={card.icon}
            mirrored={index % 2 !== 0}
            // speed={1400}   ← change flip animation speed (ms)
            // width="320px"  ← change card width
            // height="480px" ← change card height
          />
        ))}
      </section>
    </main>
  );
}
