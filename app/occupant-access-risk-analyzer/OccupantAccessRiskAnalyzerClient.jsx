"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Checkbox } from "@/components/SharedComponents";
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
const optionShadow =
	"0 clamp(6px, 1.2vw, 10px) clamp(12px, 2.4vw, 18px) rgba(15, 23, 42, 0.11)";
const optionActiveShadow =
	"0 clamp(8px, 1.6vw, 12px) clamp(16px, 3vw, 24px) rgba(15, 23, 42, 0.16)";

const riskBands = [
	{
		min: 6,
		max: 9,
		label: "Low Friction",
		description:
			"Access is under control. Vendors can mobilize on standard timelines.",
		cta: "Maintain cadence",
		delays: ["Minimal delays expected"],
	},
	{
		min: 10,
		max: 13,
		label: "Managed Tension",
		description: "Some cooperation gaps exist. Expect moderate rescheduling.",
		cta: "Escalate communications",
		delays: [
			"Referee valuation may take longer",
			"Vendor access could be delayed",
			"Photography and showings may be impacted",
		],
	},
	{
		min: 14,
		max: 18,
		label: "High Risk",
		description: "Occupant or access issues could stall the probate sale.",
		cta: "Activate contingency plan",
		delays: [
			"Referee valuation delays",
			"Vendor access problems",
			"Photography restrictions",
			"Pre-sale prep challenges",
			"Buyer showing difficulties",
		],
	},
];

const questions = [
	{
		id: "vacant",
		question: "Is the property vacant or occupied?",
		category: "Occupancy",
		options: [
			{
				text: "Vacant",
				points: 1,
				insight: "Vacant homes enable immediate vendor access.",
			},
			{
				text: "Occupied by cooperative family/friends",
				points: 2,
				insight: "Track commitments in writing to preserve cooperation.",
			},
			{
				text: "Occupied by uncooperative occupants",
				points: 3,
				insight: "Engage counsel to formalize notices and expectations.",
			},
		],
	},
	{
		id: "keys",
		question: "Do you have keys to the property?",
		category: "Access",
		options: [
			{
				text: "Yes, all keys available",
				points: 1,
				insight: "Log key transfers and store spares in a lockbox.",
			},
			{
				text: "Some keys available, others missing",
				points: 2,
				insight: "Schedule a locksmith and document restricted areas.",
			},
			{
				text: "No keys available",
				points: 3,
				insight: "Coordinate legal entry authority with counsel immediately.",
			},
		],
	},
	{
		id: "cooperation",
		question: "What is the occupant cooperation level?",
		category: "Engagement",
		options: [
			{
				text: "Fully cooperative",
				points: 1,
				insight: "Keep weekly touchpoints to cement trust.",
			},
			{
				text: "Somewhat cooperative",
				points: 2,
				insight: "Provide written schedules and confirm receipt.",
			},
			{
				text: "Uncooperative or hostile",
				points: 3,
				insight: "Use attorney-led communication only.",
			},
		],
	},
	{
		id: "condition",
		question: "What is the interior condition?",
		category: "Readiness",
		options: [
			{
				text: "Clean and well-maintained",
				points: 1,
				insight: "Prioritize photography and disclosures.",
			},
			{
				text: "Average condition",
				points: 2,
				insight: "Budget extra prep days for staging.",
			},
			{
				text: "Poor condition, needs significant work",
				points: 3,
				insight: "Sequence remediation vendors before marketing.",
			},
		],
	},
	{
		id: "conflict",
		question: "Is there heir/family conflict?",
		category: "Alignment",
		options: [
			{
				text: "No conflict",
				points: 1,
				insight: "Share milestone updates bi-weekly to stay aligned.",
			},
			{
				text: "Minor disagreements",
				points: 2,
				insight: "Clarify decision rights and document consensus.",
			},
			{
				text: "Major conflict or disputes",
				points: 3,
				insight: "Use mediator or attorney to avoid escalation.",
			},
		],
	},
	{
		id: "security",
		question: "Are there security concerns?",
		category: "Security",
		options: [
			{
				text: "No security issues",
				points: 1,
				insight: "Continue property checks twice weekly.",
			},
			{
				text: "Minor security concerns",
				points: 2,
				insight: "Install temporary cameras or sensors.",
			},
			{
				text: "Significant security risks",
				points: 3,
				insight: "Engage security patrol until access stabilizes.",
			},
		],
	},
];

const OccupantAccessRiskAnalyzerClient = () => {
	const [answers, setAnswers] = useState({});
	const [results, setResults] = useState(null);

	const totalPossible = questions.length * 3;
	const answeredCount = Object.keys(answers).length;
	const allAnswered = questions.every(
		(question) => answers[question.id] !== undefined,
	);

	const categoryHealth = useMemo(() => {
		return questions.reduce((accumulator, question) => {
			const selectedIndex = answers[question.id];
			const points =
				selectedIndex === undefined
					? 0
					: (question.options[selectedIndex]?.points ?? 0);

			if (!accumulator[question.category]) {
				accumulator[question.category] = { total: 0, count: 0 };
			}

			accumulator[question.category].total += points;
			accumulator[question.category].count += 1;

			return accumulator;
		}, {});
	}, [answers]);

	const handleAnswer = (questionId, optionIndex, checked = true) => {
		setAnswers((current) => {
			const next = { ...current };

			if (checked) {
				next[questionId] = optionIndex;
			} else if (next[questionId] === optionIndex) {
				delete next[questionId];
			}

			return next;
		});
		setResults(null);
	};

	const deriveBand = (score) =>
		riskBands.find((band) => score >= band.min && score <= band.max) ||
		riskBands[0];

	const calculateRisk = () => {
		const totalPoints = questions.reduce((sum, question) => {
			const selectedIndex = answers[question.id];
			if (selectedIndex === undefined) return sum;
			return sum + (question.options[selectedIndex]?.points || 0);
		}, 0);

		const band = deriveBand(totalPoints || riskBands[0].min);
		const scorePercent = Math.round((totalPoints / totalPossible) * 100);

		const frictionDrivers = questions
			.filter((question) => {
				const selectedIndex = answers[question.id];
				if (selectedIndex === undefined) return false;
				return (question.options[selectedIndex]?.points || 0) >= 3;
			})
			.map((question) => question.question);

		const watchList = questions
			.filter((question) => {
				const selectedIndex = answers[question.id];
				if (selectedIndex === undefined) return false;
				return (question.options[selectedIndex]?.points || 0) === 2;
			})
			.map((question) => question.question);

		const communicationPlan = [
			"Document every access granted with date, time, purpose, and contact.",
			"Issue a weekly readiness summary to heirs and occupants.",
			"Align with counsel before notices, lock changes, or confrontation points.",
		];

		setResults({
			totalPoints,
			band,
			scorePercent,
			insightPills: {
				frictionDrivers,
				watchList,
			},
			communicationPlan,
			categoryHealth,
		});
	};

	const resetAnalyzer = () => {
		setAnswers({});
		setResults(null);
	};

	return (
		<div>
			<Navbar />
			<ToolLeadCaptureModal
				toolPage='occupant-access-risk-analyzer'
				title='Before You Generate The Access Scorecard'
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
										Occupant Command Deck
									</p>
									<h1 className='mb-3 text-[30px] leading-tight font-extrabold text-white sm:text-[38px]'>
										Occupant Access Risk Analyzer
									</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Quantify friction from occupants, keys, and coordination so
										you can stage the property with confidence.
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
												? "All access scenarios are captured. Generate the friction scorecard."
												: `${questions.length - answeredCount} scenarios still need a selection.`}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-linear-to-br from-gray-50 to-gray-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'>
							<div className='space-y-8 sm:space-y-10'>
								<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6'>
									<div
										className='rounded-3xl bg-primary p-6 text-white'
										style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Risk Tier
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.band.label : "Awaiting Data"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? results.band.description
												: "Answer each lever to determine the current access posture."}
										</p>
									</div>

									<div
										className='rounded-3xl bg-secondary p-6 text-white'
										style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Friction Score
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results
												? `${results.scorePercent}%`
												: `${answeredCount}/${questions.length}`}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? "Higher percentages indicate more schedule disruption and coordination load."
												: "Complete the full questionnaire to score the access burden."}
										</p>
									</div>

									<div
										className='rounded-3xl bg-primary p-6 text-white'
										style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Next Move
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.band.cta : "Complete questionnaire"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? `Top delay drivers: ${results.insightPills.frictionDrivers.length}`
												: "Guidance unlocks after the scorecard is generated."}
										</p>
									</div>
								</div>

								<div>
									<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
										<h2 className='text-2xl font-bold text-[#0097A7] sm:text-3xl'>
											Risk Assessment Questions
										</h2>
										<div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
											<button
												type='button'
												onClick={resetAnalyzer}
												className='transition-transform  hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
												aria-label='Reset occupant access assessment'>
												<img
													src='/svgs/reset_alz.svg'
													alt='Reset occupant access assessment'
													className='h-13.25'
												/>
											</button>
											<button
												type='button'
												onClick={calculateRisk}
												disabled={!allAnswered}
												className={`transition-transform  focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
												aria-label='Generate access scorecard'>
												<img
													src='/svgs/active_alz.svg'
													alt='Generate access scorecard'
													className='h-13.25'
												/>
											</button>
										</div>
									</div>

									<div className='mt-6 space-y-4 sm:space-y-6'>
										{questions.map((question, index) => (
											<div
												key={question.id}
												className='rounded-3xl border border-gray-100 bg-white p-4 sm:p-6'
												style={{ boxShadow: sectionCardShadow }}>
												<div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
													<div>
														<p className='text-sm font-semibold text-gray-400 sm:text-base'>
															Checkpoint {index + 1} · {question.category}
														</p>
														<h3 className='mt-1 text-lg font-semibold text-[#0097A7] sm:text-xl'>
															{question.question}
														</h3>
													</div>
													<div className='inline-flex w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500'>
														{answers[question.id] !== undefined
															? question.options[answers[question.id]].text
															: "Pending"}
													</div>
												</div>

												<div className='mt-5 space-y-3'>
													{question.options.map((option, optionIndex) => {
														const isSelected =
															answers[question.id] === optionIndex;

														return (
															<div
																key={option.text}
																className={`flex items-start gap-4 rounded-2xl border px-4 py-4 transition-all ${
																	isSelected
																		? "border-primary bg-primary/5"
																		: "border-gray-200 bg-white"
																}`}
																style={{
																	boxShadow: isSelected
																		? optionActiveShadow
																		: optionShadow,
																}}>
																<Checkbox
																	group={question.id}
																	name={`${question.id}-${optionIndex}`}
																	checked={isSelected}
																	onChange={(event) =>
																		handleAnswer(
																			question.id,
																			optionIndex,
																			event.target.checked,
																		)
																	}
																	label=''
																	width='auto'
																	containerClass='mt-0.5 !gap-0'
																/>
																<div className='min-w-0 flex-1'>
																	<p className='text-sm font-bold text-primary sm:text-base'>
																		{option.text}
																	</p>
																	<p className='mt-1 text-sm leading-relaxed text-gray-500 wrap-break-word'>
																		{option.insight}
																	</p>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										))}
                                    </div>
                                    <div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
                                        <button
                                            type='button'
                                            onClick={resetAnalyzer}
                                            className='transition-transform  hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
                                            aria-label='Reset occupant access assessment'>
                                            <img
                                                src='/svgs/reset_alz.svg'
                                                alt='Reset occupant access assessment'
												className='h-13.25'
                                            />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={calculateRisk}
                                            disabled={!allAnswered}
                                            className={`transition-transform  focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
                                            aria-label='Generate access scorecard'>
                                            <img
                                                src='/svgs/active_alz.svg'
                                                alt='Generate access scorecard'
												className='h-13.25'
                                            />
                                        </button>
                                    </div>
								</div>

								{results ? (
									<div className='space-y-6'>
										<div className='rounded-3xl border border-gray-100 bg-gray-50 p-6'>
											<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
												<div>
													<p className='text-xs uppercase tracking-[0.25em] text-gray-500'>
														Access Tier
													</p>
													<h2 className='mt-2 text-3xl font-black text-[#0097A7]'>
														{results.band.label}
													</h2>
													<p className='mt-2 max-w-2xl text-gray-600'>
														{results.band.description}
													</p>
												</div>
												<div className='min-w-55 rounded-2xl border border-[#0097A7]/30 bg-white p-4 text-center'>
													<p className='text-xs uppercase tracking-[0.2em] text-[#0097A7]'>
														Friction Score
													</p>
													<p className='mt-2 text-5xl font-black text-[#0097A7]'>
														{results.totalPoints} / {totalPossible}
													</p>
													<p className='mt-2 text-xs text-gray-500'>
														Lower scores indicate smoother access operations.
													</p>
												</div>
											</div>
										</div>

										<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
											<div
												className='rounded-3xl border border-gray-100 bg-white p-6'
												style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-lg font-bold text-[#0097A7]'>
													Delay Intelligence
												</h3>
												<p className='mt-3 text-sm text-gray-700'>
													Potential delays based on the current tier:
												</p>
												<ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700'>
													{results.band.delays.map((delay, index) => (
														<li key={index}>{delay}</li>
													))}
												</ul>
											</div>

											<div
												className='rounded-3xl border border-gray-100 bg-white p-6'
												style={{ boxShadow: sectionCardShadow }}>
												<h3 className='text-lg font-bold text-[#0097A7]'>
													Communication Playbook
												</h3>
												<ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700'>
													{results.communicationPlan.map((note, index) => (
														<li key={index}>{note}</li>
													))}
												</ul>
											</div>
										</div>

										<div
											className='rounded-3xl border border-gray-100 bg-white p-6'
											style={{ boxShadow: sectionCardShadow }}>
											<h3 className='text-lg font-bold text-[#0097A7]'>
												Risk Drivers
											</h3>
											<div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
												<div>
													<p className='text-xs font-semibold uppercase tracking-wide text-[#FD7702]'>
														Critical Drivers
													</p>
													{results.insightPills.frictionDrivers.length ? (
														<ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700'>
															{results.insightPills.frictionDrivers.map(
																(item, index) => (
																	<li key={index}>{item}</li>
																),
															)}
														</ul>
													) : (
														<p className='mt-2 text-sm text-gray-500'>
															No critical drivers flagged.
														</p>
													)}
												</div>
												<div>
													<p className='text-xs font-semibold uppercase tracking-wide text-[#007A87]'>
														Watch List
													</p>
													{results.insightPills.watchList.length ? (
														<ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700'>
															{results.insightPills.watchList.map(
																(item, index) => (
																	<li key={index}>{item}</li>
																),
															)}
														</ul>
													) : (
														<p className='mt-2 text-sm text-gray-500'>
															No watch items currently.
														</p>
													)}
												</div>
											</div>

											<div className='mt-6'>
												<h4 className='text-sm font-semibold uppercase tracking-wide text-[#0097A7]'>
													Capability Tracker
												</h4>
												<div className='mt-3 grid grid-cols-1 gap-4 md:grid-cols-3'>
													{Object.entries(results.categoryHealth).map(
														([category, data]) => {
															const percent =
																100 -
																Math.round(
																	(data.total / (data.count * 3)) * 100,
																);

															return (
																<div
																	key={category}
																	className='rounded-2xl border border-gray-100 bg-white p-4'
																	style={{ boxShadow: metricCardShadow }}>
																	<p className='text-xs uppercase tracking-wide text-gray-500'>
																		{category}
																	</p>
																	<p className='mt-2 text-2xl font-bold text-[#0097A7]'>
																		{percent}%
																	</p>
																	<p className='text-xs text-gray-500'>
																		Stability rating
																	</p>
																</div>
															);
														},
													)}
												</div>
											</div>
										</div>

										<p className='text-center text-xs italic text-gray-500'>
											Disclaimer: Coordinate with counsel before taking legal
											access action or communicating formal occupancy demands.
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

export default OccupantAccessRiskAnalyzerClient;
