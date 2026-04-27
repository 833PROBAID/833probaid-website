// components/HeroSection.jsx
import Image from "next/image";

export default function TEST() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={"/logo-BG.png"}
        alt="Background"
        fill
        priority
        className="object-contain z-0"
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-black px-20">
        <div className="flex flex-col items-center justify-cente">
          <Image
            src="/images/footer-logo.png"
            alt="Footer logo"
            width={1000}
            height={1000}
            className="h-[111px] w-full object-contain px-6 -mt-16"
          />
          <p className="text-left font-bold mt-4 font-montserrat text-[#2A2A2A] pl-6 text-[16px] leading-tight">
            Expert Probate, Conservatorship, and Trust Real Estate Services
            handled personally from start to finish. Trusted by attorneys.
            Relied on by families. Built to keep the process moving, even when
            things get complicated
          </p>
        </div>
      </div>
    </div>
  );
}
