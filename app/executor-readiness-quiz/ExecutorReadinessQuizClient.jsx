"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { RadioGroup } from "@/components/SharedComponents";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { useMemo, useState } from "react";

const shellShadow =
	"0 clamp(12px, 2.5vw, 20px) clamp(26px, 5.5vw, 48px) rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255,255,255,0.3) inset";
const heroPanelShadow =
	"0 clamp(10px, 2vw, 16px) clamp(20px, 4.5vw, 32px) rgba(15, 23, 42, 0.17), 0 1px 0 rgba(255,255,255,0.24) inset";
const sectionCardShadow =
	"0 clamp(8px, 1.7vw, 14px) clamp(16px, 3.4vw, 30px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.45) inset";
const metricCardShadow =
	"0 clamp(8px, 1.6vw, 12px) clamp(14px, 3vw, 24px) rgba(15, 23, 42, 0.13)";

const responseLabels = {
	yes: "Yes",
	no: "No",
	unsure: "Unsure",
};

const categoryLabels = {
	foundation: "Foundation Controls",
	readiness: "Readiness Controls",
	operations: "Operational Controls",
};

const riskProfiles = [
	{
		label: "Foundation Work Needed",
		tier: "Not Ready to Sell",
		min: 0,
		max: 39,
		message:
			"Critical foundation work must be completed before proceeding with a real estate sale. Focus on obtaining legal authority and securing basic protections.",
		cta: "Establish legal foundation first",
	},
	{
		label: "Preparation Phase",
		tier: "Early Groundwork",
		min: 40,
		max: 69,
		message:
			"You've begun the essential groundwork. Complete remaining items to prevent listing delays and expedite the sale process.",
		cta: "Complete preparation checklist",
	},
	{
		label: "Market Readiness Approaching",
		tier: "Pre-Listing",
		min: 70,
		max: 89,
		message:
			"You're approaching market readiness. Final alignment on timeline, insurance, and property access will position you for listing.",
		cta: "Finalize pre-listing requirements",
	},
	{
		label: "Listing Ready",
		tier: "Green Light",
		min: 90,
		max: 100,
		message:
			"You have completed all essential readiness steps. You are positioned to move forward with listing and marketing the property.",
		cta: "Proceed with listing strategy",
	},
];

const categoryMap = {
	foundation: ["letters", "certificate", "attorney"],
	readiness: ["insurance", "referee", "timeline"],
	operations: ["access", "occupant", "utilities", "secured"],
};

const questions = [
	{
		id: "letters",
		question:
			"Do you have Letters Testamentary (or Letters of Administration)?",
		group: "foundation",
		tooltip:
			"Probate authority must be issued before real estate actions can proceed.",
		recommendation:
			"Coordinate with probate counsel to obtain Letters before listing activity begins.",
	},
	{
		id: "certificate",
		question: "Do you have certified copies of the death certificate?",
		group: "foundation",
		tooltip: "Certified copies are required for title, banking, and insurance.",
		recommendation:
			"Order multiple certified copies immediately for title, banking, and insurance workflows.",
	},
	{
		id: "attorney",
		question: "Has probate counsel been retained?",
		group: "foundation",
		tooltip:
			"Retaining probate counsel helps manage filings, deadlines, and court approvals.",
		recommendation:
			"Retain probate counsel before the marketing timeline is finalized.",
	},
	{
		id: "referee",
		question: "Has a probate referee been assigned (if required)?",
		group: "readiness",
		tooltip:
			"A referee valuation is required before listing in many probate cases.",
		recommendation:
			"Confirm referee assignment status so valuation timing does not delay launch.",
	},
	{
		id: "access",
		question: "Is property access established?",
		group: "operations",
		tooltip:
			"Keys, codes, and entry authorization are needed for inspections and preparation.",
		recommendation:
			"Secure authorized access for inspections, valuation, and vendor coordination.",
	},
	{
		id: "occupant",
		question: "Is occupant status resolved and ready for listing access?",
		group: "operations",
		tooltip:
			"Occupancy affects timeline, access, and showings. Unclear status introduces immediate friction.",
		recommendation:
			"Resolve occupancy and access expectations before marketing dates are promised.",
	},
	{
		id: "insurance",
		question: "Is insurance updated to reflect estate ownership?",
		group: "readiness",
		tooltip:
			"Insurance must reflect estate or trust ownership to prevent coverage gaps.",
		recommendation:
			"Update insurance to reflect the current estate or trust ownership position.",
	},
	{
		id: "utilities",
		question: "Are utilities active and transferred appropriately?",
		group: "operations",
		tooltip:
			"Active utilities are required for showings, inspections, and insurance compliance.",
		recommendation:
			"Transfer utilities promptly so inspections, photography, and insurance compliance stay intact.",
	},
	{
		id: "secured",
		question: "Is the property secured?",
		group: "operations",
		tooltip:
			"Locks, alarms, and monitoring reduce liability and insurance exposure.",
		recommendation:
			"Secure the property and document the controls now in place.",
	},
	{
		id: "timeline",
		question:
			"Has a sale timeline been aligned with counsel and beneficiaries?",
		group: "readiness",
		tooltip: "Aligned expectations prevent disputes and delays once listed.",
		recommendation:
			"Align the sale timeline with counsel and beneficiaries before launch.",
	},
];

const ExecutorReadinessQuizClient = () => {
	const [answers, setAnswers] = useState({});
	const [results, setResults] = useState(null);

	const answeredCount = Object.keys(answers).length;
	const maxPoints = questions.length * 2;
	const allAnswered = questions.every((question) => answers[question.id] !== undefined);

	const categoryScores = useMemo(() => {
		return Object.entries(categoryMap).map(([category, ids]) => {
			const penalties = ids.reduce((sum, id) => {
				if (answers[id] === "no") return sum + 2;
				if (answers[id] === "unsure") return sum + 1;
				return sum;
			}, 0);

			const percent = Math.max(
				0,
				100 - Math.round((penalties / (ids.length * 2)) * 100),
			);

			return {
				category,
				label: categoryLabels[category],
				percent,
				status:
					percent >= 80
						? "On Track"
						: percent >= 50
							? "Monitor"
							: "High Attention",
			};
		});
	}, [answers]);

	const handleAnswer = (questionId, answer) => {
		setAnswers((current) => ({ ...current, [questionId]: answer }));
		setResults(null);
	};

	const deriveProfile = (scorePercent) =>
		riskProfiles.find(
			(profile) => scorePercent >= profile.min && scorePercent <= profile.max,
		) || riskProfiles[0];

	const calculateRisk = () => {
		const totalPoints = Object.values(answers).reduce((sum, answer) => {
			if (answer === "no") return sum + 2;
			if (answer === "unsure") return sum + 1;
			return sum;
		}, 0);

		const scorePercent = Math.max(
			0,
			100 - Math.round((totalPoints / maxPoints) * 100),
		);
		const profile = deriveProfile(scorePercent);
		const weakestArea = [...categoryScores].sort(
			(first, second) => first.percent - second.percent,
		)[0];

		const highAlerts = questions
			.filter((question) => answers[question.id] === "no")
			.map((question) => question.recommendation);

		const watchItems = questions
			.filter((question) => answers[question.id] === "unsure")
			.map((question) => question.recommendation);

		const completedControls = questions
			.filter((question) => answers[question.id] === "yes")
			.map((question) => question.question);

		const advisorNotes = [
			`${answeredCount} of ${questions.length} checkpoints are currently documented.`,
			weakestArea
				? `Primary focus area: ${weakestArea.label}.`
				: "Primary focus area will populate after scoring.",
			answers.occupant === "yes"
				? "Occupancy and access appear aligned with listing readiness."
				: "Clarify occupancy and access before marketing dates are committed.",
		];

		setResults({
			totalPoints,
			scorePercent,
			profile,
			highAlerts,
			watchItems,
			advisorNotes,
			completedControls,
			weakestArea,
			categoryScores,
		});
	};

	const resetForm = () => {
		setAnswers({});
		setResults(null);
	};

	return (
		<div>
			<Navbar />
			<ToolLeadCaptureModal
				toolPage='executor-readiness-quiz'
				title='Before You Continue The Readiness Assessment'
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
										Executor Command Center
									</p>
									<h1 className='mb-3 text-[30px] leading-tight font-extrabold text-white sm:text-[38px]'>
										Executor Readiness Intelligence
									</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Track essential probate milestones, expose bottlenecks, and
										receive focus areas tailored to your current status.
									</p>
								</div>

								<div className='w-full xl:w-132.5'>
									<div
										className='rounded-3xl border px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-8'
										style={{
											backgroundColor: "rgba(0, 151, 167, 0.32)",
											borderColor: "rgba(255,255,255,0.18)",
											boxShadow: heroPanelShadow,
										}}>
										<h2 className='text-center text-[18px] font-bold tracking-[0.08em] text-white sm:text-[20px]'>
											Responses Captured
										</h2>
										<p className='mt-2 text-center text-3xl font-extrabold text-white sm:text-5xl'>
											{answeredCount}/{questions.length}
										</p>
										<p className='mt-2 text-center text-sm font-bold leading-relaxed text-white/95 sm:text-lg'>
											{answeredCount === questions.length
												? "All readiness checkpoints are documented. Generate the scorecard."
												: `${questions.length - answeredCount} checkpoints still need confirmation.`}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-linear-to-br from-gray-50 to-gray-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'>
							<div className='space-y-8 sm:space-y-10'>
								<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
									<h2 className='text-2xl font-bold text-[#0097A7] sm:text-3xl'>
										Readiness Assessment
									</h2>
									<div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
										<button
											type='button'
											onClick={resetForm}
											className='transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
											aria-label='Reset readiness assessment'>
											<img src='/svgs/reset_asses.svg' alt='Reset readiness assessment' className='h-13.25' />
										</button>
										<button
											type='button'
											onClick={calculateRisk}
											disabled={!allAnswered}
											className={`transition-transform focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
											aria-label='Generate readiness scorecard'>
											<img src='/svgs/gen_ins.svg' alt='Generate readiness scorecard' className='h-13.25' />
										</button>
									</div>
								</div>

								<div className='space-y-4 sm:space-y-6'>
									{questions.map((question, index) => (
										<div
											key={question.id}
											className='rounded-3xl border border-gray-100 bg-white p-4 sm:p-6'
											style={{ boxShadow: sectionCardShadow }}>
											<div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
												<div>
													<p className='text-sm font-semibold text-gray-400 sm:text-base'>
														Checkpoint {index + 1}
													</p>
													<h3 className='mt-1 text-lg font-semibold text-[#0097A7] sm:text-xl'>
														{question.question}
													</h3>
													<p className='mt-1 max-w-3xl text-sm text-gray-500'>
														{question.tooltip}
													</p>
												</div>
												<div className='inline-flex w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500'>
													{responseLabels[answers[question.id]] || "Pending"}
												</div>
											</div>

											<div className='mt-5'>
												<RadioGroup
													name={question.id}
													value={answers[question.id] || ""}
													onChange={(event) => handleAnswer(question.id, event.target.value)}
													options={[
														{ value: "yes", label: "Yes", color: "teal" },
														{ value: "no", label: "No", color: "orange" },
														{ value: "unsure", label: "Unsure", color: "teal" },
													]}
													direction='vertical'
													distributeWidth
													gridClass='sm:flex-row sm:flex-nowrap'
													gap='gap-2 sm:gap-3'
												/>
											</div>
										</div>
                                    ))}
                                    <div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
                                        <button
                                            type='button'
                                            onClick={resetForm}
                                            className='transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
                                            aria-label='Reset readiness assessment'>
                                            <img src='/svgs/reset_asses.svg' alt='Reset readiness assessment' className='h-13.25' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={calculateRisk}
                                            disabled={!allAnswered}
                                            className={`transition-transform focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
                                            aria-label='Generate readiness scorecard'>
                                            <img src='/svgs/gen_ins.svg' alt='Generate readiness scorecard' className='h-13.25' />
                                        </button>
                                    </div>
								</div>

								<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6'>
									<div className='rounded-3xl bg-primary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Readiness Tier
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.profile.tier : "Awaiting Data"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? results.profile.label
												: "Complete all checkpoints to score listing readiness."}
										</p>
									</div>

									<div className='rounded-3xl bg-secondary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Completion Score
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? `${results.scorePercent}%` : `${answeredCount}/${questions.length}`}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? "Higher percentages indicate fewer unresolved blockers."
												: "Track how much of the estate file is already confirmed."}
										</p>
									</div>

									<div className='rounded-3xl bg-primary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Next Move
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.profile.cta : "Complete questionnaire"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results?.weakestArea
												? `Priority area: ${results.weakestArea.label}`
												: "Guidance unlocks after the scorecard is generated."}
										</p>
									</div>
								</div>

								{results ? (
									<div className='space-y-6'>
										<div className='rounded-3xl border border-gray-100 bg-gray-50 p-6'>
											<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
												<div>
													<p className='text-xs uppercase tracking-[0.25em] text-gray-500'>
														Readiness Profile
													</p>
													<h2 className='mt-2 text-3xl font-black text-[#0097A7]'>
														{results.profile.tier}
													</h2>
													<p className='mt-2 max-w-2xl text-gray-600'>
														{results.profile.message}
													</p>
												</div>
												<div className='min-w-55 rounded-2xl border border-[#0097A7]/30 bg-white p-4 text-center'>
													<p className='text-xs uppercase tracking-[0.2em] text-[#0097A7]'>
														Readiness Index
													</p>
													<p className='mt-2 text-5xl font-black text-[#0097A7]'>
														{results.totalPoints} / {maxPoints}
													</p>
													<p className='mt-2 text-xs text-gray-500'>
														Lower point totals mean fewer unresolved blockers.
													</p>
												</div>
											</div>
										</div>

										<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
											<div className='rounded-3xl border border-gray-100 bg-white p-6' style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-lg font-bold text-[#0097A7]'>Action Signals</h3>
												<div className='mt-4 space-y-4 text-sm text-gray-700'>
													<div>
														<p className='text-xs font-semibold uppercase tracking-wide text-[#FD7702]'>
															Critical Alerts
														</p>
														{results.highAlerts.length ? (
															<ul className='mt-2 list-disc space-y-1 pl-5'>
																{results.highAlerts.map((item, index) => (
																	<li key={index}>{item}</li>
																))}
															</ul>
														) : (
															<p className='mt-2 text-gray-500'>No critical blockers flagged.</p>
														)}
													</div>
													<div>
														<p className='text-xs font-semibold uppercase tracking-wide text-[#0097A7]'>
															Watch Items
														</p>
														{results.watchItems.length ? (
															<ul className='mt-2 list-disc space-y-1 pl-5'>
																{results.watchItems.map((item, index) => (
																	<li key={index}>{item}</li>
																))}
															</ul>
														) : (
															<p className='mt-2 text-gray-500'>No watch items currently pending.</p>
														)}
													</div>
													<div>
														<p className='text-xs font-semibold uppercase tracking-wide text-[#007A87]'>
															Advisor Notes
														</p>
														<ul className='mt-2 list-disc space-y-1 pl-5'>
															{results.advisorNotes.map((item, index) => (
																<li key={index}>{item}</li>
															))}
														</ul>
													</div>
												</div>
											</div>

											<div className='rounded-3xl border border-gray-100 bg-white p-6' style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-lg font-bold text-[#0097A7]'>Control Strength</h3>
												<div className='mt-4 space-y-4'>
													{results.categoryScores.map((score) => (
														<div key={score.category}>
															<div className='flex items-center justify-between text-sm font-semibold text-gray-600'>
																<span>{score.label}</span>
																<span>
																	{score.percent}% · {score.status}
																</span>
															</div>
															<div className='mt-1 h-3 overflow-hidden rounded-full bg-gray-200'>
																<div
																	className='h-full bg-linear-to-r from-[#0097A7] to-[#007A87]'
																	style={{ width: `${score.percent}%` }}
																/>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>

										<div className='rounded-3xl border border-gray-100 bg-white p-6' style={{ boxShadow: sectionCardShadow }}>
											<h3 className='text-lg font-bold text-[#0097A7]'>Recommended Focus</h3>
											<div className='mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2'>
												<div>
													<p className='text-xs font-semibold uppercase tracking-wide text-[#FD7702]'>
														Next Priority
													</p>
													<p className='mt-2 text-base font-semibold text-gray-800'>
														{results.weakestArea
															? `${results.weakestArea.label} requires the most attention right now.`
															: "No primary weakness detected."}
													</p>
												</div>
												<div>
													<p className='text-xs font-semibold uppercase tracking-wide text-[#007A87]'>
														Confirmed Strengths
													</p>
													{results.completedControls.length ? (
														<ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700'>
															{results.completedControls.slice(0, 4).map((item, index) => (
																<li key={index}>{item}</li>
															))}
														</ul>
													) : (
														<p className='mt-2 text-sm text-gray-500'>
															Confirmed strengths will appear after scoring.
														</p>
													)}
												</div>
											</div>
										</div>

										<p className='text-center text-xs italic text-gray-500'>
											Disclaimer: This assessment is for planning and coordination only. Confirm legal authority, probate timing, and disclosure obligations with counsel before listing.
										</p>
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

export default ExecutorReadinessQuizClient;