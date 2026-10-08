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

const riskProfiles = [
	{
		range: [0, 3],
		label: "Low Risk",
		description: "Controls appear strong and vacancy exposure is limited.",
		cta: "Maintain monitoring cadence",
	},
	{
		range: [4, 6],
		label: "Moderate Risk",
		description: "Several controls need attention to avoid claim challenges.",
		cta: "Brief insurance advisor",
	},
	{
		range: [7, 12],
		label: "High Risk",
		description: "Vacancy gaps could trigger exclusions or denied claims.",
		cta: "Secure vacancy coverage now",
	},
];

const categoryMap = {
	vacancy: ["vacant", "utilities", "water"],
	security: ["secure", "locks", "yard"],
};

const questions = [
	{
		id: "vacant",
		question: "Has the property been vacant for more than 30 days?",
		category: "vacancy",
		context:
			"Most carriers downgrade coverage after 30 days without occupancy notice.",
	},
	{
		id: "utilities",
		question: "Are utilities turned on?",
		category: "vacancy",
		context:
			"Climate control protects plumbing and electrical systems from loss.",
	},
	{
		id: "secure",
		question: "Are doors and windows secure?",
		category: "security",
		context:
			"Insurers expect documented security to mitigate vandalism exposure.",
	},
	{
		id: "yard",
		question: "Is the yard maintained?",
		category: "security",
		context: "Visible neglect invites trespassers and accelerates citations.",
	},
	{
		id: "water",
		question: "Has water been shut off?",
		category: "vacancy",
		context:
			"If left pressurized, burst lines are frequently denied without inspections.",
	},
	{
		id: "locks",
		question: "Have locks been changed?",
		category: "security",
		context:
			"Changing locks establishes control over access logs post-transition.",
	},
];

const ProbatePropertyInsuranceRiskCheckerClient = () => {
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
				label: category === "vacancy" ? "Vacancy Controls" : "Security Controls",
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

	const deriveProfile = (score) =>
		riskProfiles.find(
			(profile) => score >= profile.range[0] && score <= profile.range[1],
		) || riskProfiles[0];

	const calculateRisk = () => {
		const totalPoints = Object.values(answers).reduce((sum, answer) => {
			if (answer === "no") return sum + 2;
			if (answer === "unsure") return sum + 1;
			return sum;
		}, 0);

		const scorePercent = Math.round((totalPoints / maxPoints) * 100);
		const profile = deriveProfile(totalPoints);

		const highAlerts = questions
			.filter((question) => answers[question.id] === "no")
			.map((question) => question.question);

		const watchItems = questions
			.filter((question) => answers[question.id] === "unsure")
			.map((question) => question.question);

		const advisorNotes = [
			"Document vacancy mitigation steps with photos, invoices, and inspection dates.",
			"Notify the carrier in writing when occupancy status changes.",
			"Maintain a current access log for anyone entering the property.",
		];

		const coverageRecommendation =
			totalPoints <= 3
				? "Standard coverage appears sufficient, but confirm terms annually and whenever occupancy changes."
				: totalPoints <= 6
					? "Discuss DP-1 or DP-3 vacancy riders so exclusions and inspection obligations are clear."
					: "Escalate to an insurance specialist immediately for vacant-property coverage and written carrier guidance.";

		setResults({
			totalPoints,
			scorePercent,
			profile,
			coverageRecommendation,
			highAlerts,
			watchItems,
			advisorNotes,
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
				toolPage='probate-property-insurance-risk-checker'
				title='Before You Run The Insurance Risk Checker'
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
										Insurance Governance
									</p>
									<h1 className='mb-3 text-[30px] leading-tight font-extrabold text-white sm:text-[38px]'>
										Probate Property Insurance Risk Checker
									</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Surface insurance blind spots before they expose the estate
										to coverage gaps or denied claims.
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
												? "All insurance checkpoints are captured. Generate the coverage scorecard."
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
										Vacancy Risk Assessment
									</h2>
									<div className='mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-end'>
										<button
											type='button'
											onClick={resetForm}
											className='transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none'
											aria-label='Reset insurance assessment'>
											<img src='/svgs/clear_res.svg' alt='Reset insurance assessment' className='h-13.25' />
										</button>
										<button
											type='button'
											onClick={calculateRisk}
											disabled={!allAnswered}
											className={`transition-transform focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
											aria-label='Generate insurance scorecard'>
											<img src='/svgs/run_alz.svg' alt='Generate insurance scorecard' className='h-13.25' />
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
														Control {index + 1}
													</p>
													<h3 className='mt-1 text-lg font-semibold text-[#0097A7] sm:text-xl'>
														{question.question}
													</h3>
													<p className='mt-1 max-w-3xl text-sm text-gray-500'>
														{question.context}
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
                                            aria-label='Reset insurance assessment'>
                                            <img src='/svgs/clear_res.svg' alt='Reset insurance assessment' className='h-13.25' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={calculateRisk}
                                            disabled={!allAnswered}
                                            className={`transition-transform focus-visible:ring-2 focus-visible:ring-secondary/45 focus-visible:ring-offset-2 focus-visible:outline-none ${allAnswered ? "hover:scale-[1.01]" : "cursor-not-allowed opacity-50"}`}
                                            aria-label='Generate insurance scorecard'>
                                            <img src='/svgs/run_alz.svg' alt='Generate insurance scorecard' className='h-13.25' />
                                        </button>
                                    </div>
								</div>

								<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6'>
									<div className='rounded-3xl bg-primary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Risk Tier
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.profile.label : "Awaiting Data"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? results.profile.description
												: "Complete all controls to score the insurance exposure profile."}
										</p>
									</div>

									<div className='rounded-3xl bg-secondary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Exposure Score
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? `${results.scorePercent}%` : `${answeredCount}/${questions.length}`}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? "Higher percentages indicate more claim friction or vacancy exposure."
												: "Track completion until all controls are answered."}
										</p>
									</div>

									<div className='rounded-3xl bg-primary p-6 text-white' style={{ boxShadow: metricCardShadow }}>
										<p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
											Recommendation
										</p>
										<p className='mt-2 text-2xl font-black sm:text-3xl'>
											{results ? results.profile.cta : "Complete questionnaire"}
										</p>
										<p className='mt-2 text-sm text-white/85'>
											{results
												? results.coverageRecommendation
												: "Coverage guidance unlocks after the scorecard is generated."}
										</p>
									</div>
								</div>

								{results ? (
									<div className='space-y-6'>
										<div className='rounded-3xl border border-gray-100 bg-gray-50 p-6'>
											<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
												<div>
													<p className='text-xs uppercase tracking-[0.25em] text-gray-500'>
														Risk Profile
													</p>
													<h2 className='mt-2 text-3xl font-black text-[#0097A7]'>
														{results.profile.label}
													</h2>
													<p className='mt-2 max-w-2xl text-gray-600'>
														{results.profile.description}
													</p>
												</div>
												<div className='min-w-55 rounded-2xl border border-[#0097A7]/30 bg-white p-4 text-center'>
													<p className='text-xs uppercase tracking-[0.2em] text-[#0097A7]'>
														Exposure Index
													</p>
													<p className='mt-2 text-5xl font-black text-[#0097A7]'>
														{results.totalPoints} / {maxPoints}
													</p>
													<p className='mt-2 text-xs text-gray-500'>
														Points accrue when answers are No or Unsure.
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
															<p className='mt-2 text-gray-500'>No critical alerts are currently flagged.</p>
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
															<p className='mt-2 text-gray-500'>No watch items are pending review.</p>
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
											<h3 className='text-lg font-bold text-[#0097A7]'>Coverage Recommendation</h3>
											<p className='mt-4 text-base leading-relaxed text-gray-700'>
												{results.coverageRecommendation}
											</p>
											<div className='mt-5 rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-500'>
												Use this score to brief the carrier or broker before the property sits vacant long enough to change the policy language.
											</div>
										</div>

										<p className='text-center text-xs italic text-gray-500'>
											Disclaimer: This tool is for scenario planning only. Always confirm coverage terms and vacancy conditions with a licensed insurance professional.
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

export default ProbatePropertyInsuranceRiskCheckerClient;