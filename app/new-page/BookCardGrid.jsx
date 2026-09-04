"use client";

import { useEffect, useState } from "react";
import BookCard from "./NewBook";
import BookCardBig from "./BookCardBig";
import CTAButton from "@/components/CTAButton";

const INITIAL_COUNT = 7;

export default function BookCardGrid({ cards = [] }) {
  // Starts collapsed so the client's first render matches the server's, then
  // syncs to the persisted preference after mount.
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // try {
    //   setShowAll(
    //     JSON.parse(localStorage.getItem("bookCardGridShowAll") ?? "false")
    //   );
    // } catch {
    //   // ignore unreadable/corrupt storage — stay collapsed
    // }
  }, []);

  const toggleShowAll = () => {
    setShowAll((prev) => {
      const next = !prev;
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("bookCardGridShowAll", JSON.stringify(next));
      // }
      return next;
    });
  };

  const visible = showAll ? cards : cards.slice(0, INITIAL_COUNT);
  const hasOverflow = cards.length > INITIAL_COUNT;

  // The last visible book always renders as the big card, so the section ends
  // on a full-width book no matter how many are expanded.
  const lastIndex = visible.length - 1;
  const gridCards = visible.slice(0, lastIndex < 0 ? 0 : lastIndex);
  const lastCard = lastIndex >= 0 ? visible[lastIndex] : null;

  return (
    <>
      {gridCards.length > 0 && (
        <section
          className="mx-auto w-full px-2 grid grid-cols-1 md:grid-cols-2 place-items-center justify-center gap-10 md:px-16 md:gap-24
           lg:px-22 lg:gap-24 xl:px-30 xl:gap-24"
        >
          {gridCards.map((card, index) => (
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
              priority={index < 2}
            />
          ))}
        </section>
      )}

      {lastCard && (
        <section
          className={`mx-auto w-full px-2 grid grid-cols-1 place-items-center justify-center md:px-16 lg:px-22 xl:px-30 mt-0`}
        >
          <BookCardBig
            key={lastCard.id}
            title={lastCard.title}
            subtitle={lastCard.subtitle}
            description={lastCard.description}
            imageSrc={lastCard.imageSrc}
            icon={lastCard.icon}
            slug={lastCard.slug}
            mirrored={lastIndex % 2 !== 0}
            speed={3000}
            priority={lastIndex < 2}
          />
        </section>
      )}

      {hasOverflow && (
        <div className="flex justify-center mt-12">
          <CTAButton
            label={showAll ? "Show Less" : "Show More"}
            onClick={toggleShowAll}
            bg="#0097A7"
            icon="/arrow-right.png"
            iconClassName={`w-8 lg:w-10 h-8 lg:h-10 ${
              showAll ? "-rotate-90" : "rotate-90"
            }`}
            className="px-5 h-12 lg:h-14"
            aria-expanded={showAll}
            aria-label={
              showAll ? "Show fewer home books" : "Show all home books"
            }
          />
        </div>
      )}
    </>
  );
}
