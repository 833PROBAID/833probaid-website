// components/HeroSection.jsx
import Image from "next/image";

export default function TEST() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={"/contact-bg.png"}
        alt="Background"
        fill
        priority
        className="object-contain z-0"
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-black px-20">
        <div>
          <div className="relative max-w-[350px] -mt-10">
            <h2 className="text-secondary text-center text-[30px] font-bold floating-text">
              Contact Us
            </h2>
            <div className="mb-4 mt-1 flex items-start gap-3 ">
              <img
                src="/svgs/location-pin.svg"
                style={{ width: "28px", marginTop: "4px" }}
                alt="Location"
              />
              <p className="font-bold text-left text-sm md:text-[17px]">
                311 N. Robertson Blvd #444, Beverly Hills, CA 90211
              </p>
            </div>
            <a href="tel:8337762243" className="mb-8 flex items-center gap-3">
              <img
                src="/svgs/phone-icon.svg"
                style={{ width: "28px" }}
                alt="Phone"
              />
              <div className="flex flex-row items-start justify-start text-xl  md:text-3xl">
                <b className="text-secondary font-bold ">(833)&nbsp;</b>
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
              className="mb-4 flex items-center gap-3"
            >
              <img
                src="/svgs/uiw_mail.svg"
                style={{ width: "28px" }}
                alt="Email"
              />
              <p className="font-bold md:text-xl">Info@833probaid.com</p>
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
              <p className="ml-0.5 font-bold md:text-xl">www.833probaid.com</p>
            </a>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
