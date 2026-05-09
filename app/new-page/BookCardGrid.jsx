"use client";

import { useState } from "react";
import Image from "next/image";
import BookCard from "./BookCard";

const INITIAL_COUNT = 6;

export default function BookCardGrid({ cards = [] }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? cards : cards.slice(0, INITIAL_COUNT);

  const hasOverflow = cards.length > INITIAL_COUNT;

  return (
    <>
      <section
        className="mx-auto w-full px-2 grid grid-cols-1 md:grid-cols-2 place-items-center justify-center gap-10 md:px-16 md:gap-24
           lg:px-22 lg:gap-24 xl:px-30 xl:gap-24"
      >
        {visible.map((card, index) => (
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

      {hasOverflow && (
        <div className="flex justify-center mt-12">
          <style>{`
						.book-card-grid-toggle {
							animation: bookCardGridToggleFloat 2.5s ease-in-out infinite;
						}
						.book-card-grid-toggle img {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
						}
						.book-card-grid-toggle:hover img {
							transform: rotate(-2deg) scale(1.08);
						}
						@keyframes bookCardGridToggleFloat {
							0%, 100% { transform: translateY(0px); }
							50% { transform: translateY(-8px); }
						}
					`}</style>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
            aria-label={
              showAll ? "Show fewer home books" : "Show all home books"
            }
            className="cursor-pointer w-51.25 book-card-grid-toggle"
          >
            {showAll ? (
              <Image
                src="/svgs/show-less.svg"
                alt="Show Less"
                width={1000}
                height={1000}
              />
            ) : (
              <Image
                src="/svgs/show-more.svg"
                alt="Show All"
                width={1000}
                height={1000}
              />
            )}
          </button>
        </div>
      )}
    </>
  );
}
