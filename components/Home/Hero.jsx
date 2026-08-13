import Image from "next/image";
import CTAButton from "../CTAButton";

const Hero = () => {
  return (
    <>
      <style>{`
			.hero-btn-float {
				animation: heroBtnFloat 2.5s ease-in-out infinite;
			}
			.hero-btn-float img {
				transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
			}
			.hero-btn-float:hover img {
				transform: rotate(2deg) scale(1.08);
			}
			@keyframes heroBtnFloat {
				0%, 100% { transform: translateY(0px); }
				50% { transform: translateY(-8px); }
			}
		`}</style>
      <section className="font-montserrat lg:container mx-auto -my-4">
        <div className="relative px-4 lg:px-0">
          <div className="mx-auto flex max-w-7xl px-5 md:px-9 lg:px-0 flex-col items-center lg:grid lg:grid-cols-2 lg:items-end">
            {/* Left Content Section */}
            <div className="relative z-20 flex flex-col justify-center py-8 w-[110%]">
              <Image
                src="/svgs/hero-left-banner.svg"
                alt="hero text"
                width={900}
                height={450}
                priority
                className="h-auto w-full transition-transform duration-500 ease-out hover:scale-105"
              />

              <div className="font-montserrat my-6 !mt-[4.5rem] space-y-3 font-bold lg:my-8 lg:space-y-4 lg:text-xl xl:text-2xl">
                <div className="flex items-center gap-3 lg:gap-4 group cursor-pointer">
                  <img
                    src="/icons/trust-icon.png"
                    alt="trust icon"
                    className="h-auto w-10 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 sm:w-12 lg:w-25"
                  />
                  <p className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                    Trusted by Attorneys
                  </p>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 group cursor-pointer">
                  <img
                    src="/icons/handshake-icon-v2.png"
                    alt="group icon"
                    className="h-auto w-10 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 sm:w-12 lg:w-25"
                  />
                  <p className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                    Preferred by Fiduciaries
                  </p>
                </div>
                <div className="flex items-center gap-3 lg:mb-45 lg:gap-4 group cursor-pointer">
                  <img
                    src="/icons/group-icon.png"
                    alt="group icon"
                    className="h-auto w-10 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 sm:w-12 lg:w-25"
                  />
                  <p className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                    Relied on by Families
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image Section - Hero Person */}
            <div className="relative flex items-end justify-end overflow-hidden">
              {/* Hero Person - Aligned to Bottom */}
              <Image
                src="/images/hero-person.png"
                alt="Tigran Tony"
                width={750}
                height={900}
                priority
                className="relative z-10 h-auto w-full max-w-[450px] cursor-pointer object-contain transition-transform duration-700 ease-out hover:scale-105 sm:max-w-[650px] lg:max-w-[750px]"
              />
            </div>
          </div>

          {/* Shape Hero - Global Bottom - All Screens */}
          <img
            src="/svgs/phone-shape-hero.svg"
            className="absolute -bottom-8 sm:bottom-0 left-0 w-full object-cover object-bottom z-50 lg:z-0 block lg:hidden"
            alt="shape-hero"
          />
          <img
            src="/images/shape-hero.svg"
            className="absolute bottom-0 left-0 w-full object-cover object-bottom hidden lg:block"
            alt="shape-hero"
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
