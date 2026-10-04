"use client";

import CTAButton from "@/components/CTAButton";
import ServiceLayout from "@/components/ServiceLayout";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { Calculator, Gavel } from "lucide-react";
import { useMemo, useState } from "react";

const sectionCardShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const metricCardShadow =
  "rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const fieldShadow =
  "0 clamp(4px, 1.1vw, 6px) clamp(8px, 2.4vw, 14px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.5) inset";

const MAX_OFFER_DIGITS = 12;
const MAX_OFFER_DECIMALS = 2;

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
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const handleOfferChange = (event) => {
    // Drop anything that is not a digit or a decimal point (letters, "e", "+",
    // "-", spaces) so pasted or typed text can never reach the field.
    let nextValue = event.target.value.replace(/[^\d.]/g, "");

    // Keep only the first decimal point.
    const firstDot = nextValue.indexOf(".");
    if (firstDot !== -1) {
      nextValue =
        nextValue.slice(0, firstDot + 1) +
        nextValue.slice(firstDot + 1).replace(/\./g, "");
    }

    const [wholePart, decimalPart = ""] = nextValue.split(".");

    if (wholePart.length > MAX_OFFER_DIGITS) {
      setShowLimitWarning(true);
      return;
    }

    // Silently ignore anything past two decimal places.
    if (decimalPart.length > MAX_OFFER_DECIMALS) {
      return;
    }

    setShowLimitWarning(false);
    setOfferPrice(nextValue);
  };

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
    setShowLimitWarning(false);
  };

  const handleCall = () => {
    window.location.href = CONTACT_HREF;
  };

  return (
    <>
      <ToolLeadCaptureModal
        toolPage="court-confirmation-overbid-calculator"
        title="Before You Run The Overbid Model"
      />
      <ServiceLayout
        toolPage="court-confirmation-overbid-calculator"
        title="Court Confirmation Toolkit"
        mainHeading="California Court Confirmation Overbid Calculator"
        description="Enter the current Accepted Offer to calculate the minimum initial overbid under California Probate Code § 10311(a)(1)."
        logoImage="/icons/tool1.png"
        offerPrice={offerPrice}
      >
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
                    <h2 className="text-[1.375rem] mt-[-0.3em] font-bold text-primary group-hover:text-secondary">
                      Accepted Offer
                    </h2>
                    <p className="mt-1 text-[1.375rem] text-black font-bold">
                      The minimum initial overbid is calculated as 10% of the first
                      $10,000 of the Accepted Offer plus 5% of the remaining
                      balance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="accepted-offer"
                    className="text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary"
                  >
                    Accepted Offer Amount:
                  </label>
                  <div className="flex items-stretch">
                    <span className="grid shrink-0 place-items-center rounded-l-2xl border-2 border-r border-primary bg-slate-100 px-4 text-xl font-bold text-secondary select-none">
                      $
                    </span>
                    <input
                      id="accepted-offer"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      pattern="[0-9]*[.]?[0-9]*"
                      placeholder="e.g., 1000000"
                      value={offerPrice}
                      onChange={handleOfferChange}
                      aria-invalid={showLimitWarning}
                      aria-describedby={
                        showLimitWarning ? "accepted-offer-limit" : undefined
                      }
                      className="w-full rounded-r-2xl border-2 border-l-0 px-4 py-2.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2 md:max-w-md font-bold placeholder:text-secondary"
                      style={{
                        borderColor: showLimitWarning
                          ? "#dc2626"
                          : "var(--color-primary)",
                        boxShadow: fieldShadow,
                        "--tw-ring-color": showLimitWarning
                          ? "rgba(220, 38, 38, 0.25)"
                          : "rgba(0, 151, 167, 0.25)",
                      }}
                    />
                  </div>
                  {showLimitWarning && (
                    <p
                      id="accepted-offer-limit"
                      role="alert"
                      className="text-[1rem] font-bold text-red-600"
                    >
                      Maximum {MAX_OFFER_DIGITS} digits allowed for the Accepted
                      Offer Amount.
                    </p>
                  )}
                  <p className="text-[1.375rem] font-bold">
                    Every amount below is calculated automatically from
                    the Accepted Offer.
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
                        <span className="text-primary font-bold group-hover:text-secondary">
                          MINIMUM INITIAL OVERBID
                        </span>
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
                      MINIMUM INITIAL OVERBID
                    </p>
                    <p className="mt-2 text-4xl font-black sm:text-5xl">
                      {hasOffer ? formatCurrency(results.minimumOverbid) : "—"}
                    </p>
                    <p className="mt-2 text-[1.375rem] text-white/85 font-bold -mb-[0.3em]">
                      Accepted Offer plus the required overbid increase of{" "}
                      {hasOffer
                        ? formatCurrency(results.requiredIncrease)
                        : "—"}
                      .
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-gray-200 bg-white p-6 pb-8 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <h3 className="font-bold text-primary text-[1.375rem] group-hover:text-secondary -mt-[0.2em]">
                      Planning to Overbid at the Court Confirmation Hearing?
                    </h3>
                    <div className="mt-5 space-y-4 !text-[1.375rem] leading-relaxed sm:text-base font-bold">
                      <div className="[box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px] p-6 rounded-2xl flex items-start gap-6">
                        <img src="https://833probaid.com/images/arrow.png" />
                        <p>
                          The amount above represents the minimum initial
                          overbid calculated from the Accepted Offer entered,
                          using the formula set forth in California Probate Code
                          § 10311(a)(1).
                        </p>
                      </div>
                      <div className="[box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px] p-6 rounded-2xl flex items-start gap-6">
                        <img src="https://833probaid.com/images/arrow.png" />
                        <p>
                          Court procedures, deposit requirements, acceptable
                          forms of payment, bidding increments, financing terms,
                          and other requirements may vary depending on the court
                          and the specific court-confirmed sale.
                        </p>
                      </div>
                      <div className="[box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px] p-6 rounded-2xl flex items-start gap-6">
                        <img src="https://833probaid.com/images/arrow.png" />
                        <p>
                          Before attending the hearing, confirm the required
                          deposit amount and form of payment with the listing
                          agent or counsel, and review the applicable
                          court instructions.
                        </p>
                      </div>
                      <div className="[box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px] p-6 rounded-2xl flex items-start gap-6">
                        <img src="https://833probaid.com/images/arrow.png" />
                        <p>
                          This calculator is provided for informational purposes
                          only and is not to be considered as legal or financial
                          advice. Meeting the calculated minimum initial overbid amount
                          does not guarantee that an overbid will qualify or be
                          accepted. Additional statutory, court, and
                          sale-specific requirements may apply.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 rounded-2xl border-[3px] border-secondary py-5 px-6 hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]"
                    style={{ boxShadow: sectionCardShadow }}
                  >
                    <Gavel
                      className="mt-1 h-6 w-6 shrink-0 text-secondary"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <p className="text-[1.375rem] leading-relaxed font-bold text-secondary">
                      The calculated amount is the minimum initial overbid—not
                      necessarily the final purchase price. Additional
                      competitive bidding may occur at the court confirmation
                      hearing.
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
                      Have questions about overbidding on a court-confirmed real
                      estate sale?
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
    </ServiceLayout>
    </>
  );
};

export default Page;
