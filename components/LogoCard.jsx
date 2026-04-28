// components/HeroSection.jsx
import Image from "next/image";

export default function LogoCard() {
  return (
    <div>
      <div className="relative  h-[500px] overflow-hidden sm:w-[450px] w-[350px] mx-auto ">
        {/* Background Image */}
        <Image
          src={"/logo-BG.png"}
          alt="Background"
          fill
          priority
          className="object-contain z-0"
        />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-black px-14 sm:px-20">
          <div className="flex flex-col items-center justify-center ">
            <Image
              src="/images/footer-logo.png"
              alt="Footer logo"
              width={1000}
              height={1000}
              className="h-[111px] w-full object-contain px-6 sm:-mt-16 -mt-10"
            />
            <Image
              src={"/left-dark.png"}
              alt="Right Dark"
              width={400}
              height={200}
              priority
              className="absolute z-10 h-[100px] object-contain left-[4%] top-[14%] w-[22%] sm:left-[5.5%] sm:top-[5.5%] sm:w-[20%]"
            />
            <Image
              src={"/left-staple.png"}
              alt="Left Stable Footer"
              width={400}
              height={200}
              priority
              className="absolute z-20 h-[80px] object-contain left-[7%] top-[15%] w-[16%] sm:left-[7.5%] sm:top-[7%] sm:w-[15%]"
            />

            <p className="text-left font-bold md:mt-4 font-montserrat text-[#2A2A2A] pl-6 text-xs md:text-[16px] leading-tight max-w-[350px]">
              Expert Probate, Conservatorship, and Trust Real Estate Services
              handled personally from start to finish. Trusted by attorneys.
              Relied on by families. Built to keep the process moving, even when
              things get complicated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
