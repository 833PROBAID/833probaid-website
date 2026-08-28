"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CTAButton from "@/components/CTAButton";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { Calculator, Gavel } from "lucide-react";
import { useMemo, useState } from "react";

const shellShadow =
	"0 clamp(12px, 2.5vw, 20px) clamp(26px, 5.5vw, 48px) rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255,255,255,0.3) inset";
const heroPanelShadow =
	"0 clamp(10px, 2vw, 16px) clamp(20px, 4.5vw, 32px) rgba(15, 23, 42, 0.17), 0 1px 0 rgba(255,255,255,0.24) inset";
const sectionCardShadow =
	"0 clamp(8px, 1.7vw, 14px) clamp(16px, 3.4vw, 30px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.45) inset";
const metricCardShadow =
	"0 clamp(8px, 1.6vw, 12px) clamp(14px, 3vw, 24px) rgba(15, 23, 42, 0.13)";
const fieldShadow =
	"0 clamp(4px, 1.1vw, 6px) clamp(8px, 2.4vw, 14px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.5) inset";

const CONTACT_NAME = "833PROBAID";
const CONTACT_PHONE = "(833) PROBAID 7762243";
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
						style={{ color: "var(--color-secondary)" }}>
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
				toolPage='court-confirmation-overbid-calculator'
				title='Before You Run The Overbid Model'
			/>
			<section className='min-h-screen py-8 sm:py-12 lg:py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div
						className='overflow-hidden rounded-[28px] border-[3px] border-secondary sm:rounded-[40px]'
						style={{ boxShadow: shellShadow }}>
						<div
							className='px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'
							style={{
								background:
									"linear-gradient(to bottom right, var(--color-primary), var(--color-primaryDark))",
							}}>
							<div className='flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-8'>
								<div className='flex-1'>
									<p className='mb-3 text-sm font-semibold tracking-[0.15em] text-white sm:text-base'>
										COURT CONFIRMATION TOOLKIT
									</p>
									<h1 className='mb-3 text-[30px] leading-tight font-extrabold text-white sm:text-[40px]'>
										California Probate Minimum Overbid Calculator
									</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Enter the current accepted offer to calculate the statutory
										minimum first overbid under California Probate Code §10311.
									</p>
								</div>

								<div className='w-full xl:w-132.5'>
									<div
										className='rounded-3xl border px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-8'
										style={{
											backgroundColor: "rgba(0, 151, 167, 0.32)",
											borderColor: "rgba(255, 255, 255, 0.18)",
											boxShadow: heroPanelShadow,
										}}>
										<h2 className='mb-3 text-center text-[18px] font-bold tracking-[0.08em] text-white sm:text-[20px]'>
											MINIMUM OVERBID
										</h2>
										<p className='text-center text-2xl font-extrabold leading-tight text-white sm:text-4xl'>
											{hasOffer
												? formatCurrency(results.minimumOverbid)
												: "Ready to calculate"}
										</p>
										<p className='mt-3 text-center text-sm font-bold leading-relaxed text-white/95 sm:text-lg'>
											{hasOffer
												? `Required overbid increase ${formatCurrency(results.requiredIncrease)}`
												: "Enter the accepted offer and every other line updates automatically."}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-linear-to-br from-gray-50 to-gray-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'>
							<div
								className='flex flex-col rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-10'
								style={{ boxShadow: sectionCardShadow }}>
								<div className='mb-8 flex items-center gap-3'>
									<Calculator
										className='h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8 lg:h-9 lg:w-9'
										strokeWidth={2.5}
										aria-hidden='true'
										style={{
											filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
										}}
									/>

									<div>
										<h2
											className='text-[20px] font-bold sm:text-[24px] lg:text-[28px]'
											style={{ color: "var(--color-primary)" }}>
											Accepted Offer
										</h2>
										<p className='mt-1 text-sm text-gray-500 sm:text-base'>
											The statutory model uses 10% of the first $10,000 of the
											accepted offer plus 5% of the balance.
										</p>
									</div>
								</div>

								<div className='flex flex-col gap-2'>
									<label
										htmlFor='accepted-offer'
										className='text-sm font-extrabold tracking-[0.04em] text-gray-900 uppercase'>
										{renderLabelText("Accepted Offer ($):")}
									</label>
									<input
										id='accepted-offer'
										type='number'
										inputMode='decimal'
										min='0'
										placeholder='e.g., 1000000'
										value={offerPrice}
										onChange={(e) => setOfferPrice(e.target.value)}
										className='w-full rounded-2xl border-2 px-4 py-3.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2 md:max-w-md font-bold'
										style={{
											borderColor: "var(--color-primary)",
											boxShadow: fieldShadow,
											"--tw-ring-color": "rgba(0, 151, 167, 0.25)",
										}}
									/>
									<p className='text-sm leading-relaxed text-gray-500'>
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

								<div className='mt-8 space-y-6'>
									<div
										className='rounded-3xl border border-gray-200 bg-white p-6'
										style={{ boxShadow: sectionCardShadow }}>
										<h3 className='text-xl font-bold text-primary'>
											Calculation Breakdown
										</h3>
										<div className='mt-5 space-y-4 text-sm sm:text-base'>
											<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
												<span className='font-semibold text-gray-500'>
													Accepted Offer
												</span>
												<span className='font-bold text-gray-900'>
													{hasOffer ? formatCurrency(results.acceptedOffer) : "—"}
												</span>
											</div>

											{breakdownRows.map((row) => (
												<div
													key={row.label}
													className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
													<span
														className={
															row.emphasis
																? "font-bold text-gray-700"
																: "font-semibold text-gray-500"
														}>
														{row.label}
													</span>
													<span
														className={
															row.emphasis
																? "font-black text-secondary"
																: "font-bold text-gray-900"
														}>
														{hasOffer ? formatCurrency(row.value) : "—"}
													</span>
												</div>
											))}

											<div className='flex items-center justify-between gap-4'>
												<span className='text-xs font-bold tracking-[0.2em] text-gray-500 uppercase'>
													Minimum Overbid
												</span>
												<span className='text-xl font-black text-primary sm:text-2xl'>
													{hasOffer ? formatCurrency(results.minimumOverbid) : "—"}
												</span>
											</div>
										</div>
									</div>

									<div
										className='rounded-3xl bg-secondary p-6 text-white sm:p-8'
										style={{ boxShadow: metricCardShadow }}>
										<p className='text-sm font-bold tracking-[0.25em] uppercase text-white/80'>
											Minimum Overbid
										</p>
										<p className='mt-2 text-4xl font-black sm:text-5xl'>
											{hasOffer ? formatCurrency(results.minimumOverbid) : "—"}
										</p>
										<p className='mt-2 text-sm text-white/85 sm:text-base font-bold'>
											Accepted offer plus the statutory increase of{" "}
											{hasOffer ? formatCurrency(results.requiredIncrease) : "—"}.
										</p>
									</div>

									<div
										className='rounded-3xl border border-gray-200 bg-white p-6 sm:p-8'
										style={{ boxShadow: sectionCardShadow }}>
										<h3 className='text-xl font-bold text-primary sm:text-2xl'>
											Planning to Overbid at the Court Confirmation Hearing?
										</h3>
										<div className='mt-4 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base'>
											<p>
												The amount above represents the statutory minimum initial
												overbid based on the accepted offer entered, using the
												formula in California Probate Code §10311.
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

									<div className='flex items-start gap-3 rounded-3xl border border-secondary bg-secondary/10 px-5 py-5 sm:px-6'>
										<Gavel
											className='mt-0.5 h-5 w-5 shrink-0 text-secondary'
											strokeWidth={2.5}
											aria-hidden='true'
										/>
										<p className='text-sm leading-relaxed font-semibold text-secondary sm:text-base'>
											The calculated amount is the minimum opening overbid — not
											necessarily the final purchase price. Additional competitive
											bidding may occur at the confirmation hearing.
										</p>
									</div>

									<div
										className='rounded-3xl border-[3px] border-secondary bg-white p-6 text-center sm:p-8'
										style={{ boxShadow: sectionCardShadow }}>
										<p className='text-sm font-bold tracking-[0.25em] text-secondary uppercase'>
											Need A Second Set Of Eyes?
										</p>
										<h3 className='mt-2 text-2xl font-black text-primary sm:text-3xl'>
											Have questions about overbidding on a probate property?
										</h3>
										<p className='mt-3 text-md leading-relaxed text-gray-600 sm:text-base'>
											Contact {CONTACT_NAME} — Probate Real Estate Specialist
										</p>
										<div className='mt-6 flex justify-center'>
											<CTAButton
												label={`Call ${CONTACT_PHONE}`}
												onClick={handleCall}
												// bg='#0097A7'
												icon='/arrow-right.png'
												className='px-5 h-12 lg:h-14'
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
