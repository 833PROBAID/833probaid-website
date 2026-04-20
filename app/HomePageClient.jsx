/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Navbar";
import { SectionLoading } from "../components/LoadingState";
import AnimatedText from "../components/AnimatedText";

const Footer = dynamic(() => import("../components/Footer"));
const HomeCard = dynamic(() => import("../components/HomeCard"));
const HomeCardBig = dynamic(() => import("../components/HomeCardBig"));
const ToolsCard = dynamic(() => import("../components/ToolsCard"));
const TrustCard = dynamic(() => import("../components/TrustCard"));
const ReadyToGetStart = dynamic(() => import("@/components/ReadyToGetStart"));

export default function HomePageClient({ initialHomeCardData = [] }) {
	const homeCardData = Array.isArray(initialHomeCardData)
		? initialHomeCardData
		: [];
	const loading = false;
	const [showAll, setShowAll] = useState(false);
	const trustCardData = [
		{
			serial: 1,
			text: "As we conclude this guide on navigating probate, trust, or conservatorship real estate sales, we want to extend our heartfelt gratitude to you. Dealing with the loss of a loved one and managing their estate through probate can be emotionally challenging and overwhelming. We understand the weight of the responsibility you carry during this time, and we commend your strength and resilience.",
		},
		{
			serial: 2,
			text: "Navigating the probate process requires patience, diligence, and a compassionate approach, and we're honored to have been a part of your journey. Whether you're a seller, buyer, or involved in any capacity in a probate sale, we appreciate the trust you've placed in us to provide guidance and support.",
		},
		{
			serial: 3,
			text: "As we conclude this guide on navigating probate, trust, or conservatorship real estate sales, we want to extend our heartfelt gratitude to you. Dealing with the loss of a loved one and managing their estate through probate can be emotionally challenging and overwhelming. We understand the weight of the responsibility you carry during this time, and we commend your strength and resilience.",
		},
		{
			serial: 4,
			text: "Navigating the probate process requires patience, diligence, and a compassionate approach, and we're honored to have been a part of your journey. Whether you're a seller, buyer, or involved in any capacity in a probate sale, we appreciate the trust you've placed in us to provide guidance and support.",
		},
	];
	const toolsCardData = [
		{
			id: 3,
			icon: "/icons/tool3.png",
			title: "INSURANCE RISK CHECKER",
			description:
				"Vacancy often voids standard insurance coverage. Audit liability exposure and coverage gaps before the estate faces a denied claim.",
			href: "probate-property-insurance-risk-checker",
		},
		{
			id: 1,
			icon: "/icons/tool1.png",
			title: "OVERBID CALCULATOR",
			description:
				"Statutory math is non-negotiable. Instantly calculate California’s exact overbid requirements and mandatory cashier’s check amounts before stepping into court.",
			href: "court-confirmation-overbid-calculator",
		},
		{
			id: 2,
			icon: "/icons/tool2.png",
			title: "ACCESS RISK ANALYZER",
			description:
				"Occupancy friction is the #1 deal-killer. Identify access barriers, occupant liabilities, and delays before they jeopardize the court’s timeline.",
			href: "occupant-access-risk-analyzer",
		},

		{
			id: 4,
			icon: "/icons/tool4.png",
			title: "EXECUTOR READINESS QUIZ",
			description:
				"The court expects professional performance. Assess your fiduciary readiness, uncover personal liability exposure, and confirm whether the estate is positioned for a compliant sale.",
			href: "executor-readiness-quiz",
		},
	];
	const sectionContainerClass =
		"mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-0";
	return (
		<>
			<Navbar />
			<section className='w-full'>
				<Hero />
				<section className={`${sectionContainerClass} mt-28`}>
					<h1 className='font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3'>
						<AnimatedText
							text='If The Court Touches It,'
							as='div'
							animate={true}
						/>
						<AnimatedText
							text='833PROBAID® Runs It'
							className='text-secondary'
							animate={true}
						/>
					</h1>
					<div className='mt-4 md:mt-6 lg:mt-8 xl:mt-10'>
						<p className='font-montserrat text-center font-medium text-[16px] md:text-xl lg:text-2xl'>
							<AnimatedText
								className='text-primary font-extrabold'
								text='833PROBAID® '
							/>
							<AnimatedText text='runs a proprietary, court-aligned system built exclusively for probate, trust, and conservatorship real estate. Every case is pushed through a controlled workflow engineered to eliminate confusion, force clarity, and keep the entire process in lockstep with the court — from the first intake call to the final recording. No templates. No shortcuts. No guesswork. Just structure, precision, and full alignment with the way court-supervised real estate is meant to run.' />
						</p>
					</div>
					<div className='mt-6 grid w-full grid-cols-2 gap-2 sm:gap-4 md:mt-8'>
						<img
							src='/home/1.svg'
							className='w-full transition-transform duration-500 ease-out md:hover:scale-105 md:hover:-rotate-1 cursor-pointer'
							style={{ willChange: "transform" }}
							alt='house image'
						/>
						<img
							src='/home/2.svg'
							className='w-full transition-transform duration-500 ease-out md:hover:scale-105 md:hover:rotate-1 cursor-pointer'
							style={{ willChange: "transform" }}
							loading='lazy'
							alt='house image'
						/>
					</div>
				</section>
				<section
					className={`${sectionContainerClass} mt-10 md:mt-14 lg:mt-16 xl:mt-20`}>
					<h1 className='font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col justify-center items-center gap-1 sm:gap-4'>
						<AnimatedText
							text='The System Attorneys Rely On'
							as='div'
							animate={true}
						/>
						<div className='text-secondary'>
							<AnimatedText
								text="When The Estate Can't Afford Mistakes"
								animate={true}
							/>
						</div>
					</h1>

					<div className='mt-4 md:mt-6 lg:mt-8 xl:mt-10'>
						<p className='font-montserrat text-center font-medium text-[15.8px] md:text-xl lg:text-2xl'>
							<AnimatedText text='Attorneys, fiduciaries, and executors rely on' />
							<AnimatedText
								text=' 833PROBAID® '
								className='text-primary font-extrabold'
							/>
							<AnimatedText text="for one reason — consistency that outperforms the industry. Files stay clean. Communication stays tight. Deadlines are honored. Documentation is complete. And every case moves forward with a level of organization most agents can't replicate, don't understand, and wouldn't know how to implement even if they tried. This is disciplined execution in its purest form — the standard every court-supervised sale should have, but almost none do." />
						</p>
					</div>
					<div className='mt-10 text-white sm:mt-16'>
						{!loading && homeCardData.length > 0 && (
							<div className='-mb-4 flex w-full justify-center sm:mb-10 md:mb-16'>
								<div className='w-full hidden sm:block'>
									<HomeCardBig
										uid={`${homeCardData[0].id}-big-desktop-top`}
										icon={homeCardData[0].icon}
										title={homeCardData[0].title}
										subtitle={homeCardData[0].subtitle}
										description={homeCardData[0].description}
										slug={homeCardData[0].slug}
										bannerImage={homeCardData[0].image}
									/>
								</div>
								<div className='w-full block sm:hidden'>
									<HomeCard
										uid={`${homeCardData[0].id}-card-mobile-top`}
										alignIndex={2}
										icon={homeCardData[0].icon}
										title={homeCardData[0].title}
										subtitle={homeCardData[0].subtitle}
										description={homeCardData[0].description}
										slug={homeCardData[0].slug}
										bannerImage={homeCardData[0].image}
									/>
								</div>
							</div>
						)}
					</div>
					{/* Mobile: Show/Hide functionality */}
					<div className='mx-auto mt-8 grid grid-cols-1 gap-8 sm:hidden'>
						{loading ? (
							<div className='col-span-2'>
								<SectionLoading
									title='Loading…'
									message='Preparing your resources'
								/>
							</div>
						) : homeCardData.length === 0 ? (
							<div className='col-span-2 py-12 text-center text-gray-500'>
								<p>No home books available at the moment.</p>
							</div>
						) : (
							homeCardData
								.slice(
									1,
									showAll
										? homeCardData.length - 1
										: Math.min(7, homeCardData.length),
								)
								.map((item, i) => (
									<HomeCard
										key={item.id}
										uid={`${item.id}-mobile-${i + 1}`}
										alignIndex={i + 1}
										icon={item.icon}
										title={item.title}
										subtitle={item.subtitle}
										description={item.description}
										slug={item.slug}
										bannerImage={item.image}
									/>
								))
						)}
					</div>
					{/* Desktop: Always show all */}
					<div className='mx-auto hidden grid-cols-2 gap-14 sm:gap-16 md:gap-24 sm:grid lg:gap-20'>
						{loading ? (
							<div className='col-span-2'>
								<SectionLoading
									title='Loading…'
									message='Preparing your resources'
								/>
							</div>
						) : homeCardData.length === 0 ? (
							<div className='col-span-2 py-12 text-center text-gray-500'>
								<p>No home books available at the moment.</p>
							</div>
						) : (
							homeCardData
								.slice(1, homeCardData.length > 1 ? -1 : homeCardData.length)
								.map((item, i) => (
									<HomeCard
										key={item.id}
										uid={`${item.id}-desktop-${i + 1}`}
										alignIndex={i + 1}
										icon={item.icon}
										title={item.title}
										subtitle={item.subtitle}
										description={item.description}
										slug={item.slug}
										bannerImage={item.image}
									/>
								))
						)}
					</div>
					{/* Mobile: Show last big card only when expanded */}
					<div className='mt-4 text-white sm:mt-10 md:mt-16 sm:hidden'>
						{!loading && showAll && homeCardData.length > 5 && (
							<div className='flex w-full justify-center'>
								<div className='w-full hidden sm:block'>
									<HomeCardBig
										uid={`${homeCardData[homeCardData.length - 1].id}-big-desktop-last-mobile-expanded`}
										icon={homeCardData[homeCardData.length - 1].icon}
										title={homeCardData[homeCardData.length - 1].title}
										subtitle={homeCardData[homeCardData.length - 1].subtitle}
										description={
											homeCardData[homeCardData.length - 1].description
										}
										slug={homeCardData[homeCardData.length - 1].slug}
										bannerImage={homeCardData[homeCardData.length - 1].image}
									/>
								</div>
								<div className='w-full block sm:hidden'>
									<HomeCard
										uid={`${homeCardData[homeCardData.length - 1].id}-card-mobile-last-mobile-expanded`}
										alignIndex={1}
										icon={homeCardData[homeCardData.length - 1].icon}
										title={homeCardData[homeCardData.length - 1].title}
										subtitle={homeCardData[homeCardData.length - 1].subtitle}
										description={
											homeCardData[homeCardData.length - 1].description
										}
										slug={homeCardData[homeCardData.length - 1].slug}
										bannerImage={homeCardData[homeCardData.length - 1].image}
									/>
								</div>
							</div>
						)}
					</div>
					{/* Desktop: Always show last big card */}
					<div className='mt-4 hidden text-white sm:mt-10 md:mt-14 sm:block'>
						{!loading && homeCardData.length > 1 && (
							<div className='flex w-full justify-center'>
								<div className='w-full'>
									<HomeCardBig
										uid={`${homeCardData[homeCardData.length - 1].id}-big-desktop-last`}
										icon={homeCardData[homeCardData.length - 1].icon}
										title={homeCardData[homeCardData.length - 1].title}
										subtitle={homeCardData[homeCardData.length - 1].subtitle}
										description={
											homeCardData[homeCardData.length - 1].description
										}
										slug={homeCardData[homeCardData.length - 1].slug}
										bannerImage={homeCardData[homeCardData.length - 1].image}
									/>
								</div>
							</div>
						)}
					</div>
					{/* Mobile only: Show All / Show Less button */}
					{!loading && homeCardData.length > 5 && (
						<div className='mt-7 flex justify-center sm:hidden'>
							<style>{`
								.show-toggle-btn {
									animation: showToggleFloat 2.5s ease-in-out infinite;
								}
								.show-toggle-btn img {
									transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
								}
								.show-toggle-btn:hover img {
									transform: rotate(-2deg) scale(1.08);
								}
								@keyframes showToggleFloat {
									0%, 100% { transform: translateY(0px); }
									50% { transform: translateY(-8px); }
								}
							`}</style>
							<button
								onClick={() => setShowAll(!showAll)}
								className='cursor-pointer w-51.25 show-toggle-btn'>
								{showAll ? (
									<img src='/svgs/show-less.svg' alt='Show Less' />
								) : (
									<img src='/svgs/show-more.svg' alt='Show All' />
								)}
							</button>
						</div>
					)}
				</section>
				<section className={sectionContainerClass}>
					<div className='my-8 grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:my-10 md:flex-row lg:my-14 lg:gap-8 xl:my-16'>
						<img
							src='/images/house3.png'
							className='w-full transition-transform duration-500 ease-out hover:scale-105 cursor-pointer'
							style={{ willChange: "transform" }}
							loading='lazy'
							alt='house'
						/>
						<div>
							<h1 className='font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-[55px] flex flex-col justify-center items-center gap-1 sm:gap-3'>
								<AnimatedText
									text='Selling a Probate, Trust, Or'
									as='div'
									animate={true}
								/>
								<AnimatedText
									text='Conservatorship Property?'
									className='text-secondary'
									as='div'
									animate={true}
								/>
							</h1>

							<h4 className='font-montserrat text-primary mt-4 text-center text-lg font-extrabold xl:text-3xl'>
								<AnimatedText
									text='We Handle It ALL—Fast & Easy.'
									animate={true}
								/>
							</h4>
							<div className='mt-3'>
								<p className='font-montserrat text-center font-medium text-[15.8px] md:text-xl lg:text-2xl'>
									<AnimatedText text="Whether you're navigating probate, managing a trust, or dealing with conservatorship property, we understand that you've got a lot on your plate. Let us help you get your property" />{" "}
									<span
										className='text-primary underline font-extrabold cursor-pointer transition-transform duration-300 inline-block hover:scale-110 hover:-translate-y-1'
										onClick={() => {
											window.open("/books/seller-guide.pdf", "_blank");
										}}>
										SOLD
									</span>{" "}
									<AnimatedText text="quickly and at the best price. Whether you need cash fast, or you want to get top dollar with a traditional sale, we've got you covered." />
								</p>
								<h4 className='font-montserrat text-primary text-center text-lg font-extrabold xl:text-3xl mt-4'>
									<AnimatedText text='Fast' />
									<span className='text-secondary'>.</span>{" "}
									<AnimatedText text='Fair' />
									<span className='text-secondary'>.</span>{" "}
									<AnimatedText text='Done' />
									<span className='text-secondary'>.</span>
								</h4>
							</div>
						</div>
					</div>
				</section>
				<section className={sectionContainerClass}>
					<div className='mt-10'>
						<ReadyToGetStart />
					</div>
				</section>
				<section className={`${sectionContainerClass} py-10 md:py-12 lg:py-14 xl:py-15`}>
					<h1 className='font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3'>
						<AnimatedText text='Your Probate' as='div' animate={true} />
						<AnimatedText
							text='Real Estate Tools'
							className='text-secondary'
							as='div'
							animate={true}
						/>
					</h1>
					<div className='my-6'>
						<p className='font-montserrat text-center font-medium text-[15.8px] md:text-xl lg:text-2xl'>
							<AnimatedText text='Use these free tools to help navigate the probate process with confidence. From calculating overbids to assessing risks, get the insights you need.' />
						</p>
					</div>
					<div className='grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mt-10'>
						{toolsCardData.map((item) => (
							<ToolsCard
								key={item.id}
								id={item.id}
								icon={item.icon}
								title={item.title}
								description={item.description}
								href={item.href}
							/>
						))}
					</div>
				</section>
				<section className={sectionContainerClass}>
					<div className='mb-5 sm:mb-10'>
						<h1 className='font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3'>
							<AnimatedText text='Thank You for' as='div' animate={true} />
							<div className='flex gap-1.5'>
								<AnimatedText
									text='Trusting'
									className='text-secondary'
									as='div'
									animate={true}
								/>
								<AnimatedText text='Us' as='div' animate={true} />
							</div>
						</h1>
					</div>
					<div className='space-y-7 sm:space-y-10'>
						{trustCardData.map((item) => {
							return (
								<TrustCard
									key={item.serial}
									text={item.text}
									serial={item.serial}
								/>
							);
						})}
					</div>
				</section>
			</section>
			<Footer />
		</>
	);
}
