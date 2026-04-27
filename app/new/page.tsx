"use client";
import "./card.css";
import ProBaidCard, { ContactBookIcon } from "./Card";
/**
 * CardsGrid
 * Drop this anywhere in your home page:
 *   <CardsGrid onCardClick={(card) => router.push(card.href)} />
 *
 * Performance notes:
 *  - The grid is a single GPU layer (translateZ(0) on .pb-grid).
 *  - Each card has content-visibility:auto, so cards offscreen
 *    skip painting until they enter the viewport.
 *  - ProBaidCard is React.memo'd — no unnecessary re-renders.
 */
const   CARDS = [
    { id: 1,  title: "Service One",     subtitle: "—Get in Touch", body: "Card 1 description goes here. Replace with real copy.",  ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-1.webp"  },
    { id: 2,  title: "Service Two",     subtitle: "—Get in Touch", body: "Card 2 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-2.webp"  },
    { id: 3,  title: "Service Three",   subtitle: "—Get in Touch", body: "Card 3 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-3.webp"  },
    { id: 4,  title: "Service Four",    subtitle: "—Get in Touch", body: "Card 4 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-4.webp"  },
    { id: 5,  title: "Service Five",    subtitle: "—Get in Touch", body: "Card 5 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-5.webp"  },
    { id: 6,  title: "Service Six",     subtitle: "—Get in Touch", body: "Card 6 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-6.webp"  },
    { id: 7,  title: "Service Seven",   subtitle: "—Get in Touch", body: "Card 7 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-7.webp"  },
    { id: 8,  title: "Service Eight",   subtitle: "—Get in Touch", body: "Card 8 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-8.webp"  },
    { id: 9,  title: "Service Nine",    subtitle: "—Get in Touch", body: "Card 9 description goes here.",                          ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-9.webp"  },
    { id: 10, title: "Service Ten",     subtitle: "—Get in Touch", body: "Card 10 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-10.webp" },
    { id: 11, title: "Service Eleven",  subtitle: "—Get in Touch", body: "Card 11 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-11.webp" },
    { id: 12, title: "Service Twelve",  subtitle: "—Get in Touch", body: "Card 12 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-12.webp" },
    { id: 13, title: "Service 13",      subtitle: "—Get in Touch", body: "Card 13 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-13.webp" },
    { id: 14, title: "Service 14",      subtitle: "—Get in Touch", body: "Card 14 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-14.webp" },
    { id: 15, title: "Service 15",      subtitle: "—Get in Touch", body: "Card 15 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-15.webp" },
    { id: 16, title: "Service 16",      subtitle: "—Get in Touch", body: "Card 16 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-16.webp" },
    { id: 17, title: "Service 17",      subtitle: "—Get in Touch", body: "Card 17 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-17.webp" },
    { id: 18, title: "Service 18",      subtitle: "—Get in Touch", body: "Card 18 description goes here.",                         ctaLabel: "Learn More", bgSrc: "/assets/cards/bg-18.webp" },
  ];
  
export default function CardsGrid({ items = CARDS, onCardClick }: { items: typeof CARDS, onCardClick: (card: typeof CARDS[0]) => void }) {
  return (
    <section className="pb-grid">
      {items.map((c) => (
        <ProBaidCard
          key={c.id}
          title={c.title}
          subtitle={c.subtitle}
          body={c.body}
          ctaLabel={c.ctaLabel}
          onCtaClick={() => onCardClick?.(c)}
          icon={<ContactBookIcon />}
          style={{ width: "100%", height: "100%" }}
        />
      ))}
    </section>
  );
}
