// components/HeroSection.jsx
import Image from "next/image";

/**
 * @param {{ children?: import("react").ReactNode, content?: import("react").ReactNode }} props
 */
export default function TEST({ children, content } = {}) {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={"/CARD_BG.png"}
        alt="Background"
        fill
        priority
        className="object-contain z-0"
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-black px-20">
        <div>{children ?? content ?? null}</div>{" "}
      </div>
    </div>
  );
}
