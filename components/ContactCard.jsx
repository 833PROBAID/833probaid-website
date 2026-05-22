"use client";

export default function ContactCard() {
  return (
    <div className="flex w-full justify-center p-4">
      <div
        className="relative w-full max-w-[566px] min-h-[586px] rounded-[22px] bg-[#0097A7] overflow-hidden"
        style={{
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.35), inset 6px -6px 10px rgba(0,0,0,0.25), inset -4px 4px 8px rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="absolute inset-[30px] bg-[#0097A7]"
          style={{
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.45), inset 0 0 12px rgba(0,0,0,0.25)",
          }}
        />

        <div
          className="absolute left-[30px] top-[30px] w-[90px] h-[190px] bg-[#FE7702]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 70%)",
          }}
        />

        <div
          className="absolute right-[30px] top-[30px] w-[90px] h-[190px] bg-[#FE7702]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
          }}
        />

        <div
          className="absolute left-[62px] right-[62px] top-[40px] bottom-[40px] bg-white px-8 py-14 flex flex-col items-center"
          style={{
            clipPath:
              "polygon(14% 0%, 86% 0%, 100% 14%, 100% 86%, 86% 100%, 14% 100%, 0% 86%, 0% 14%)",
            boxShadow:
              "-12px 12px 22px rgba(0,0,0,0.28), 12px 6px 18px rgba(0,0,0,0.18)",
          }}
        >
          <h2 className="text-[#FE7702] text-[34px] font-bold mb-10">
            Contact Us
          </h2>

          <div className="w-full flex items-start gap-4 mb-8">
            <img
              src="/svgs/location-pin.svg"
              className="w-[34px] mt-1"
              alt="Location"
            />

            <p className="font-bold text-[22px] leading-[1.35] text-black">
              311 N. Robertson Blvd #444,
              <br />
              Beverly Hills, CA 90211
            </p>
          </div>

          <a
            href="tel:8337762243"
            className="w-full flex items-center gap-4 mb-10"
          >
            <img
              src="/svgs/phone-icon.svg"
              className="w-[34px]"
              alt="Phone"
            />

            <div className="flex flex-col leading-none">
              <span className="text-[#FE7702] font-bold text-[22px]">
                (833) PROBAID
              </span>

              <span className="text-[#0097A7] font-bold text-[44px] tracking-[0.22rem] mt-2">
                7762243
              </span>
            </div>
          </a>

          <a
            href="mailto:info@833probaid.com"
            className="w-full flex items-center gap-4 mb-8"
          >
            <img
              src="/svgs/uiw_mail.svg"
              className="w-[34px]"
              alt="Email"
            />

            <p className="font-bold text-[22px] text-black">
              Info@833probaid.com
            </p>
          </a>

          <a
            href="https://www.833probaid.com"
            className="w-full flex items-center gap-4"
          >
            <img
              src="/svgs/globe.svg"
              className="w-[32px]"
              alt="Website"
            />

            <p className="font-bold text-[22px] text-black">
              www.833probaid.com
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
