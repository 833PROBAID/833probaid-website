"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CTAButton from "@/components/CTAButton";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { Calculator, Gavel } from "lucide-react";
import { useMemo, useState } from "react";

const shellShadow =
  "rgba(0, 0, 0, 0.5) 0px 8px 12px, rgba(0, 0, 0, 0.7) 0px -5px 12px 1px";
// const heroPanelShadow =
//   "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const heroPanelShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px,rgba(0, 0, 0, 0.4) 0px -5px 12px 1px,rgba(0, 0, 0, 0.25) 5.46px -5.46px 3.64px 0px inset,rgba(255, 255, 255, 0.25) -3.64px 4.55px 3.64px 0px inset";
const sectionCardShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const metricCardShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const fieldShadow =
  "0 clamp(4px, 1.1vw, 6px) clamp(8px, 2.4vw, 14px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.5) inset";

const CONTACT_NAME = "833PROBAID";
const CONTACT_PHONE = "(833) PROBAID";
const CONTACT_HREF = "tel:8337762243";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const parseAmount = (value) => {
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

// California Probate Code section 10311: the first overbid must exceed the
// accepted offer by 10% of the first $10,000 plus 5% of the balance.
const buildOverbid = (acceptedOffer) => {
  const firstTierBase = Math.min(acceptedOffer, 10000);
  const firstTierIncrease = firstTierBase * 0.1;
  const remainingBalance = Math.max(acceptedOffer - 10000, 0);
  const remainingIncrease = remainingBalance * 0.05;
  const requiredIncrease = firstTierIncrease + remainingIncrease;

  return {
    acceptedOffer,
    firstTierIncrease,
    remainingBalance,
    remainingIncrease,
    requiredIncrease,
    minimumOverbid: acceptedOffer + requiredIncrease,
  };
};

const Page = () => {
  const [offerPrice, setOfferPrice] = useState("");

  const acceptedOffer = parseAmount(offerPrice);
  const hasOffer = acceptedOffer > 0;
  const results = useMemo(() => buildOverbid(acceptedOffer), [acceptedOffer]);

  const renderLabelText = (text) =>
    text.split("").map((char, index) => {
      if (char === "(" || char === ")" || char === ":") {
        return (
          <span
            key={`${char}-${index}`}
            style={{ color: "var(--color-secondary)" }}
          >
            {char}
          </span>
        );
      }

      return <span key={`${char}-${index}`}>{char}</span>;
    });

  const breakdownRows = [
    { label: "10% of First $10,000", value: results.firstTierIncrease },
    { label: "Remaining Balance", value: results.remainingBalance },
    { label: "5% of Remaining Balance", value: results.remainingIncrease },
    {
      label: "Required Overbid Increase",
      value: results.requiredIncrease,
      emphasis: true,
    },
  ];

  const handleReset = () => {
    setOfferPrice("");
  };

  const handleCall = () => {
    window.location.href = CONTACT_HREF;
  };

  return (
    <div>
      <Navbar />
      <ToolLeadCaptureModal
        toolPage="court-confirmation-overbid-calculator"
        title="Before You Run The Overbid Model"
      />
      <section className="min-h-screen py-8 sm:py-12 lg:py-16 font-montserrat">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="overflow-hidden rounded-3xl border-[3px] border-secondary group hover:translate-y-[-5px] hover:![box-shadow:rgba(0,0,0,0.6)_0px_12px_20px,rgba(0,0,0,0.7)_0px_-8px_16px_2px]"
            style={{ boxShadow: shellShadow }}
          >
            <div
              className="p-10"
              style={{
                background:
                  "linear-gradient(to bottom right, var(--color-primary), var(--color-primaryDark))",
              }}
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-8 -mb-[0.3em]">
                <div
                  className="flex-1"
                  style={{
                    filter: "drop-shadow(2px 3px 0px rgba(0,0,0,0.5))",
                  }}
                >
                  <p className="mb-3 text-[1.375rem] font-bold tracking-[1px] text-white -mt-[0.3em]">
                    COURT CONFIRMATION TOOLKIT
                  </p>
                  <h1 className="mb-3 leading-tight font-bold text-white text-[40px]">
                    California Probate Minimum Overbid Calculator
                  </h1>
                  <p className="max-w-2xl font-bold text-white/95 text-[1.375rem]">
                    Enter the current accepted offer to calculate the statutory
                    minimum first overbid under California Probate Code §10311.
                  </p>
                </div>

                <div className="w-full xl:w-120.5">
                  <div
                    className="rounded-2xl px-6 py-6 backdrop-blur-sm hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px,rgba(0,0,0,0.25)_5.46px_-5.46px_3.64px_0px_inset,rgba(255,255,255,0.25)_-3.64px_4.55px_3.64px_0px_inset] group/second"
                    style={{
                      backgroundColor: "rgba(0, 151, 167, 0.32)",
                      boxShadow: heroPanelShadow,
                    }}
                  >
                    <div className="p-2 w-max rounded-full bg-[linear-gradient(to_bottom,white_0%,rgb(255,180,100)_15%,rgb(254,119,2)_70%,rgb(254,119,2)_100%)] [box-shadow:0px_4px_6px_5px_rgba(0,0,0,0.7)] absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/4">
                      <div className="bg-secondary w-max p-5 rounded-full shadow-[inset_0px_0px_12px_rgba(0,0,0,0.5)]">
                        <img
                          src="/icons/tool1.png"
                          className="w-14 h-14 [box-shadow:0px_0px_5px_2px_rgba(0,0,0,0.7)] rounded-lg group-hover/second:-rotate-12 duration-200"
                        />
                      </div>
                    </div>
                    <div
                      className="flex justify-center items-center gap-4 mt-20"
                      style={{
                        filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.5))",
                      }}
                    >
                      <div className="w-10 h-1 bg-secondary"></div>
                      <h2 className="text-center font-bold tracking-[1px] text-secondary text-[1.375rem]">
                        MINIMUM OVERBID
                      </h2>
                      <div className="w-10 h-1 bg-secondary"></div>
                    </div>
                    <p
                      className="text-center font-bold leading-tight text-white text-[40px]"
                      style={{
                        filter: "drop-shadow(2.5px 3px 0px rgba(0,0,0,0.5))",
                      }}
                    >
                      {hasOffer
                        ? formatCurrency(results.minimumOverbid)
                        : "Ready to calculate"}
                    </p>
                    <div className="flex justify-center mt-3">
                      <div
                        className="w-40 h-1"
                        style={{
                          background:
                            "linear-gradient(to right, rgb(254, 119, 2) 0%, rgb(254, 119, 2) 35%, rgb(255, 255, 255) 50%, rgb(254, 119, 2) 65%, rgb(254, 119, 2) 100%)",
                          clipPath:
                            "polygon(0 36.67%, 50% 0, 100% 36.67%, 100% 83.33%, 50% 100%, 0 83.33%)",
                        }}
                      ></div>
                    </div>
                    <p
                      className="mt-3 text-center font-bold text-white/95 text-[1.375rem]"
                      style={{
                        filter: "drop-shadow(2.5px 3px 0px rgba(0,0,0,0.5))",
                      }}
                    >
                      {hasOffer
                        ? `Required overbid increase ${formatCurrency(
                            results.requiredIncrease
                          )}`
                        : "Enter the accepted offer and every other line updates automatically."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-10">
              <div
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-10 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                style={{ boxShadow: sectionCardShadow }}
              >
                <div className="mb-8 flex gap-3">
                  <Calculator
                    className="shrink-0 text-secondary h-8 w-8 mt-[-0.45em] ml-[-0.2em] group-hover:text-primary"
                    strokeWidth={2.5}
                    aria-hidden="true"
                    style={{
                      filter: "drop-shadow(0px 2px 0px rgba(0,0,0,0.25))",
                    }}
                  />

                  <div>
                    <h2 className="text-[1.375rem] mt-[-0.3em] font-bold uppercase text-primary group-hover:text-secondary">
                      Accepted Offer
                    </h2>
                    <p className="mt-1 text-[1.375rem] text-black font-bold">
                      The statutory model uses 10% of the first $10,000 of the
                      accepted offer plus 5% of the balance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="accepted-offer"
                    className="text-[1.375rem] font-bold"
                  >
                    {renderLabelText("Accepted Offer ($):")}
                  </label>
                  <input
                    id="accepted-offer"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    placeholder="e.g., 1000000"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full rounded-2xl border-2 px-4 py-3.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2 md:max-w-md font-bold placeholder:text-secondary"
                    style={{
                      borderColor: "var(--color-primary)",
                      boxShadow: fieldShadow,
                      "--tw-ring-color": "rgba(0, 151, 167, 0.25)",
                    }}
                  />
                  <p className="text-[1.375rem] font-bold">
                    Every amount below is calculated automatically from this
                    offer.
                  </p>
                </div>

                {/* <div className='mt-7 flex justify-center sm:justify-end'>
									<button
										type='button'
										onClick={handleReset}
										className='transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
										aria-label='Reset overbid calculation'>
										<img
											src='/svgs/reset.svg'
											alt='Reset overbid calculation'
											className='h-13.25'
										/>
									</button>
								</div> */}

                <div className="mt-8 space-y-8">
                  <div
                    className="rounded-2xl border border-gray-200 bg-white p-6 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <h3 className="text-[1.375rem] font-bold text-primary group-hover:text-secondary">
                      Calculation Breakdown
                    </h3>
                    <div className="mt-5 space-y-4 text-[1.375rem]">
                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="font-bold">Accepted Offer</span>
                        <span className="font-bold text-gray-900">
                          {hasOffer
                            ? formatCurrency(results.acceptedOffer)
                            : "—"}
                        </span>
                      </div>

                      {breakdownRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
                        >
                          <span className="font-bold text-black">
                            {row.label}
                          </span>
                          <span
                            className={
                              row.emphasis
                                ? "font-bold text-secondary group-hover:text-primary"
                                : "font-bold text-black"
                            }
                          >
                            {hasOffer ? formatCurrency(row.value) : "—"}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold">Minimum Overbid</span>
                        <span className="text-primary font-bold group-hover:text-secondary">
                          {hasOffer
                            ? formatCurrency(results.minimumOverbid)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl bg-secondary p-6 text-white hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: metricCardShadow }}
                  >
                    <p className="text-[1.375rem] font-bold tracking-[1px] uppercase text-white/80 -mt-[0.15em]">
                      Minimum Overbid
                    </p>
                    <p className="mt-2 text-4xl font-black sm:text-5xl">
                      {hasOffer ? formatCurrency(results.minimumOverbid) : "—"}
                    </p>
                    <p className="mt-2 text-[1.375rem] text-white/85 font-bold -mb-[0.3em]">
                      Accepted offer plus the statutory increase of{" "}
                      {hasOffer
                        ? formatCurrency(results.requiredIncrease)
                        : "—"}
                      .
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-gray-200 bg-white p-6 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <h3 className="font-bold text-primary text-[1.375rem] group-hover:text-secondary -mt-[0.2em]">
                      Planning to Overbid at the Court Confirmation Hearing?
                    </h3>
                    <div className="mt-4 space-y-4 !text-[1.375rem] leading-relaxed sm:text-base font-bold -mb-[0.3em]">
                      <p>
                        The amount above represents the statutory minimum
                        initial overbid based on the accepted offer entered,
                        using the formula in California Probate Code §10311.
                      </p>
                      <p>
                        Court procedures, deposit requirements, acceptable forms
                        of payment, bidding increments, financing terms, and
                        other requirements may vary depending on the court and
                        the specific probate sale.
                      </p>
                      <p>
                        Before attending the hearing, confirm the required
                        deposit amount and form of payment with the listing
                        agent, estate representative/counsel, and applicable
                        court instructions.
                      </p>
                      <p>
                        This calculator is provided for informational purposes
                        only and is not legal advice. Final bid requirements and
                        acceptance are determined by the court.
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 rounded-2xl border border-secondary bg-secondary/10 py-5 px-6 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <Gavel
                      className="mt-1 h-6 w-6 shrink-0 text-secondary"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <p className="text-[1.375rem] leading-relaxed font-semibold text-secondary">
                      The calculated amount is the minimum opening overbid — not
                      necessarily the final purchase price. Additional
                      competitive bidding may occur at the confirmation hearing.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border-[3px] border-secondary bg-white p-6 text-center sm:p-8 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <p className="text-2xl font-bold tracking-[1px] text-secondary group-hover:text-primary uppercase">
                      Need A Second Set Of Eyes?
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-primary group-hover:text-secondary">
                      Have questions about overbidding on a probate property?
                    </h3>
                    <div className="mt-8 flex justify-center">
                      <CTAButton
                        label={`Call ${CONTACT_PHONE}`}
                        onClick={handleCall}
                        // bg='#0097A7'
                        icon="/arrow-right.png"
                        className="px-5 h-12 lg:h-14"
                        aria-label={`Call ${CONTACT_PHONE}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Page;
