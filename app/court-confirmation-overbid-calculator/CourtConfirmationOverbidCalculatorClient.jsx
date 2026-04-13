"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { Calculator } from "lucide-react";
import { useState } from "react";

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

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const formatCurrency = (value) =>
	currencyFormatter.format(Math.round(value || 0));

const parseAmount = (value) => {
	const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
	return Number.isFinite(parsed) ? parsed : 0;
};

const getMinimumOverbid = (acceptedOffer) => {
	const firstTenThousand = Math.min(acceptedOffer, 10000);
	const balance = Math.max(acceptedOffer - 10000, 0);

	return acceptedOffer + firstTenThousand * 0.1 + balance * 0.05;
};

const Page = () => {
	const [offerPrice, setOfferPrice] = useState("");
	const [downPayment, setDownPayment] = useState("");
	const [deposit, setDeposit] = useState("");
	const [results, setResults] = useState(null);
	const [error, setError] = useState("");

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

	const handleCalculation = () => {
		const acceptedOffer = parseAmount(offerPrice);
		const plannedDownPayment = parseAmount(downPayment);
		const existingDeposit = parseAmount(deposit);

		if (acceptedOffer <= 0) {
			setError(
				"Enter a valid accepted offer to calculate the statutory overbid.",
			);
			setResults(null);
			return;
		}

		if (plannedDownPayment <= 0) {
			setError(
				"Enter the planned down payment so the funding model can project cash needs.",
			);
			setResults(null);
			return;
		}

		if (existingDeposit < 0) {
			setError("Deposit cannot be negative.");
			setResults(null);
			return;
		}

		const minimumOverbid = getMinimumOverbid(acceptedOffer);
		const statutoryIncrease = minimumOverbid - acceptedOffer;
		const downPaymentRatio = Math.min(plannedDownPayment / acceptedOffer, 1);
		const requiredCourtDeposit = minimumOverbid * 0.1;
		const creditedDeposit = Math.min(existingDeposit, requiredCourtDeposit);
		const depositGap = Math.max(requiredCourtDeposit - creditedDeposit, 0);
		const estimatedDownPaymentAtMinimumOverbid =
			minimumOverbid * downPaymentRatio;
		const cashNeededBeforeClose = Math.max(
			estimatedDownPaymentAtMinimumOverbid - existingDeposit,
			0,
		);
		const estimatedLoanAmount = Math.max(
			minimumOverbid - estimatedDownPaymentAtMinimumOverbid,
			0,
		);

		setError("");
		setResults({
			acceptedOffer,
			plannedDownPayment,
			existingDeposit,
			minimumOverbid,
			statutoryIncrease,
			requiredCourtDeposit,
			creditedDeposit,
			depositGap,
			downPaymentRatio,
			estimatedDownPaymentAtMinimumOverbid,
			cashNeededBeforeClose,
			estimatedLoanAmount,
		});
	};

	const handleReset = () => {
		setOfferPrice("");
		setDownPayment("");
		setDeposit("");
		setResults(null);
		setError("");
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
										Court Confirmation Overbid Calculator
									</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Model the statutory minimum overbid and funding requirements
										before you step into court.
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
											FUNDING SNAPSHOT
										</h2>
										<p className='text-center text-2xl font-extrabold leading-tight text-white sm:text-4xl'>
											{results
												? formatCurrency(results.minimumOverbid)
												: "Ready to model"}
										</p>
										<p className='mt-3 text-center text-sm font-bold leading-relaxed text-white/95 sm:text-lg'>
											{results
												? `Court deposit target ${formatCurrency(results.requiredCourtDeposit)}`
												: "Enter an accepted offer, planned cash in, and any existing deposit to generate the court model."}
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
											Property Details
										</h2>
										<p className='mt-1 text-sm text-gray-500 sm:text-base'>
											The statutory model uses 10% of the first $10,000 of the
											accepted offer plus 5% of the balance.
										</p>
									</div>
								</div>

								<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
									<div className='flex flex-col gap-2'>
										<label className='text-sm font-extrabold tracking-[0.04em] text-gray-900 uppercase'>
											{renderLabelText("Offer Price ($):")}
										</label>
										<input
											type='number'
											inputMode='decimal'
											min='0'
											placeholder='e.g., 1500000'
											value={offerPrice}
											onChange={(e) => {
												setOfferPrice(e.target.value);
												setResults(null);
												setError("");
											}}
											className='w-full rounded-2xl border-2 px-4 py-3.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2'
											style={{
												borderColor: "var(--color-primary)",
												boxShadow: fieldShadow,
												"--tw-ring-color": "rgba(0, 151, 167, 0.25)",
											}}
										/>
									</div>

									<div className='flex flex-col gap-2'>
										<label className='text-sm font-extrabold tracking-[0.04em] text-gray-900 uppercase'>
											{renderLabelText("Down Payment ($):")}
										</label>
										<input
											type='number'
											inputMode='decimal'
											min='0'
											placeholder='e.g., 300000'
											value={downPayment}
											onChange={(e) => {
												setDownPayment(e.target.value);
												setResults(null);
												setError("");
											}}
											className='w-full rounded-2xl border-2 px-4 py-3.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2'
											style={{
												borderColor: "var(--color-primary)",
												boxShadow: fieldShadow,
												"--tw-ring-color": "rgba(0, 151, 167, 0.25)",
											}}
										/>
									</div>

									<div className='flex flex-col gap-2'>
										<label className='text-sm font-extrabold tracking-[0.04em] text-gray-900 uppercase'>
											{renderLabelText("Deposit ($) (Optional):")}
										</label>
										<input
											type='number'
											inputMode='decimal'
											min='0'
											placeholder='e.g., 45000'
											value={deposit}
											onChange={(e) => {
												setDeposit(e.target.value);
												setResults(null);
												setError("");
											}}
											className='w-full rounded-2xl border-2 px-4 py-3.5 text-base text-gray-900 transition-all focus:outline-none focus:ring-2'
											style={{
												borderColor: "var(--color-primary)",
												boxShadow: fieldShadow,
												"--tw-ring-color": "rgba(0, 151, 167, 0.25)",
											}}
										/>
									</div>
								</div>

								<p className='mt-5 text-sm leading-relaxed text-gray-500'>
									The calculator assumes your planned down payment scales with
									the new minimum overbid. Any existing deposit is credited
									toward the 10% court deposit target.
								</p>

								{error ? (
									<div className='mt-5 rounded-2xl border border-secondary/20 bg-secondary/8 px-4 py-3 text-sm font-semibold text-secondary'>
										{error}
									</div>
								) : null}

								<div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
									<button
										type='button'
										onClick={handleCalculation}
										className='transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
										aria-label='Run overbid calculation'>
										<img
											src='/svgs/run.svg'
											alt='Run overbid calculation'
											className='h-13.25'
										/>
									</button>

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
								</div>

								{results ? (
									<div className='mt-8 space-y-6'>
										<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
											<div
												className='rounded-3xl bg-primary p-6 text-white'
												style={{ boxShadow: metricCardShadow }}>
												<p className='text-xs font-semibold tracking-[0.25em] uppercase text-white/80'>
													Minimum Overbid
												</p>
												<p className='mt-2 text-3xl font-black sm:text-4xl'>
													{formatCurrency(results.minimumOverbid)}
												</p>
												<p className='mt-2 text-sm text-white/85'>
													This reflects the accepted offer plus the statutory
													court-confirmation increase.
												</p>
											</div>

											<div
												className='rounded-3xl bg-secondary p-6 text-white'
												style={{ boxShadow: metricCardShadow }}>
												<p className='text-xs font-semibold tracking-[0.25em] uppercase text-white/80'>
													Court Deposit Target
												</p>
												<p className='mt-2 text-3xl font-black sm:text-4xl'>
													{formatCurrency(results.requiredCourtDeposit)}
												</p>
												<p className='mt-2 text-sm text-white/85'>
													Existing deposit credited:{" "}
													{formatCurrency(results.creditedDeposit)}
												</p>
											</div>

											<div
												className='rounded-3xl border border-gray-200 bg-white p-6'
												style={{ boxShadow: metricCardShadow }}>
												<p className='text-xs font-semibold tracking-[0.25em] uppercase text-gray-500'>
													Added Cash Needed
												</p>
												<p className='mt-2 text-3xl font-black text-primary sm:text-4xl'>
													{formatCurrency(results.cashNeededBeforeClose)}
												</p>
												<p className='mt-2 text-sm text-gray-600'>
													Deposit gap at hearing:{" "}
													{formatCurrency(results.depositGap)}
												</p>
											</div>
										</div>

										<div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
											<div
												className='rounded-3xl border border-gray-200 bg-white p-6'
												style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-xl font-bold text-primary'>
													Calculation Breakdown
												</h3>
												<div className='mt-5 space-y-4 text-sm sm:text-base'>
													<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
														<span className='font-semibold text-gray-500'>
															Accepted offer
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.acceptedOffer)}
														</span>
													</div>
													<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
														<span className='font-semibold text-gray-500'>
															Statutory increase
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.statutoryIncrease)}
														</span>
													</div>
													<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
														<span className='font-semibold text-gray-500'>
															Estimated down payment at minimum overbid
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(
																results.estimatedDownPaymentAtMinimumOverbid,
															)}
														</span>
													</div>
													<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
														<span className='font-semibold text-gray-500'>
															Existing deposit credited
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.creditedDeposit)}
														</span>
													</div>
													<div className='flex items-center justify-between gap-4 border-b border-gray-100 pb-3'>
														<span className='font-semibold text-gray-500'>
															Hearing deposit shortfall
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.depositGap)}
														</span>
													</div>
													<div className='flex items-center justify-between gap-4'>
														<span className='font-semibold text-gray-500'>
															Estimated financed balance
														</span>
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.estimatedLoanAmount)}
														</span>
													</div>
												</div>
											</div>

											<div
												className='rounded-3xl border border-gray-200 bg-white p-6'
												style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-xl font-bold text-primary'>
													Court Readiness Notes
												</h3>
												<div className='mt-5 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base'>
													<p>
														Your current plan implies a down payment ratio of{" "}
														<span className='font-bold text-gray-900'>
															{Math.round(results.downPaymentRatio * 100)}%
														</span>{" "}
														at the accepted offer.
													</p>
													<p>
														If the sale opens at the statutory minimum overbid,
														budget{" "}
														<span className='font-bold text-gray-900'>
															{formatCurrency(results.cashNeededBeforeClose)}
														</span>{" "}
														in additional cash to preserve that leverage
														profile.
													</p>
													<p>
														Bring a cashier’s check strategy into your court
														prep if the existing deposit does not fully satisfy
														the 10% target.
													</p>
													<div className='rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-500'>
														This tool provides a planning model only. Confirm
														exact court deposit handling, credit for existing
														funds, and hearing instructions with probate counsel
														and the listing side before court.
													</div>
												</div>
											</div>
										</div>
									</div>
								) : null}
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
