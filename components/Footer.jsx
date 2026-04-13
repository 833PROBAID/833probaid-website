"use client";

import React, { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import NewsletterSubscriptionModal from "./NewsletterSubscriptionModal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
	const marqueeRef = useRef(null);
	const textRef = useRef(null);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [subscriptionNotice, setSubscriptionNotice] = useState("");
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

	useEffect(() => {
		const marquee = marqueeRef.current;
		const text = textRef.current;

		if (!marquee || !text) return;

		let position = 0;
		const speed = 1; // pixels per frame

		const animate = () => {
			position -= speed;

			// Reset position when first copy is completely off screen
			if (Math.abs(position) >= text.offsetWidth / 2) {
				position = 0;
			}

			text.style.transform = `translateX(${position}px)`;
			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(animationId);
	}, []);

	useEffect(() => {
		if (!isSubscriptionModalOpen || typeof document === "undefined") return;

		const active = document.activeElement;
		if (active && typeof active.blur === "function") {
			active.blur();
		}
	}, [isSubscriptionModalOpen]);

	const handleSubscriptionOpen = (event) => {
		event.preventDefault();

		const rawEmail = String(newsletterEmail || "").trim();
		const normalizedEmail = rawEmail.toLowerCase();

		if (!rawEmail) {
			setSubscriptionNotice("Add your email in the popup before submitting.");
		} else if (!EMAIL_PATTERN.test(normalizedEmail)) {
			setSubscriptionNotice(
				"Your email looks invalid. Please correct it in the popup.",
			);
		} else {
			setSubscriptionNotice("");
		}

		setNewsletterEmail(normalizedEmail || rawEmail);
		setIsSubscriptionModalOpen(true);
	};

	const handleSubscriptionSuccess = () => {
		setSubscriptionNotice("");
		setNewsletterEmail("");
	};

	return (
		<footer className='bg-primary/35 border-primary mt-8 border-y-2 md:mt-12'>
			<div className='bg-secondary shadow-[0_-8px_12.7px_rgba(0,0,0,0.63),0_10px_12.2px_0px_rgba(0,0,0,0.63)] mt-0.5'>
				<div ref={marqueeRef} className='overflow-hidden'>
					<div
						ref={textRef}
						style={{ willChange: "transform" }}
						className=' whitespace-nowrap font-montserrat inline-flex font-bold text-white text-[40px] lg:text-[60px] xl:text-[82px]'>
						PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP &#10625; PROBATE
						&#10625; TRUST &#10625; CONSERVATORSHIP &#10625; SUCCESSOR IN
						INTEREST &#10625; PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP
						&#10625; PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP &#10625;
						SUCCESSOR IN INTEREST &#10625;
					</div>
				</div>
			</div>
			<div className='py-8'>
				<div className='mx-auto w-full container px-4 md:px-0 font-montserrat'>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-1'>
						{/* CARD 1 */}
						<FooterCard cardId={1}>
							<div className='flex flex-col h-75'>
								<h2
									className='text-secondary'
									style={{
										fontSize: "30px",
										fontWeight: "800",
										textAlign: "center",
										marginBottom: "10px",
									}}>
									<AnimatedText text='Contact Us' as='span' animate={true} />
								</h2>

								<a
									href='tel:8337762243'
									className='mb-4 flex items-center gap-3'>
									<img
										src='/svgs/phone-icon.svg'
										style={{
											width: "28px",
										}}
										alt='Phone'
									/>
									<div
										className='flex flex-row items-start justify-start'
										style={{ fontSize: "30px" }}>
										<b className='text-secondary font-bold'>(833)&nbsp;</b>
										<div className='flex flex-col gap-1'>
											<b className='text-secondary tracking-[0.1rem] font-bold'>
												PROBAID
											</b>
											<b className='text-primary leading-0.5 tracking-[0.28rem] font-bold'>
												7762243
											</b>
										</div>
									</div>
								</a>

								<div className='mb-4 flex items-start gap-3 mt-2'>
									<img
										src='/svgs/location-pin.svg'
										style={{
											width: "28px",
											marginTop: "4px",
										}}
										alt='Location'
									/>
									<p
										className='font-bold'
										style={{
											fontSize: "20px",
											lineHeight: "1.6",
										}}>
										311 N. Robertson Blvd #444, Beverly Hills, CA 90211
									</p>
								</div>
								<a
									href='mailto:info@833probaid.com'
									className='mb-4 flex items-center gap-3'>
									<img
										src='/svgs/uiw_mail.svg'
										style={{
											width: "28px",
										}}
										alt='Email'
									/>
									<p className='font-bold' style={{ fontSize: "20px" }}>
										Info@833probaid.com
									</p>
								</a>
								<a
									href='https://www.833probaid.com'
									className='flex items-center gap-3'>
									<img
										className='ml-0.5'
										src='/svgs/globe.svg'
										style={{
											width: "25px",
										}}
										alt='Website'
									/>
									<p className='font-bold ml-0.5' style={{ fontSize: "20px" }}>
										www.833probaid.com
									</p>
								</a>
							</div>
						</FooterCard>

						{/* CARD 2 */}
						<FooterCard cardId={2}>
							<div className='flex flex-col items-center justify-center -mb-20'>
								<img
									src='/images/footer-logo.png'
									alt='Footer logo'
									style={{
										width: "325px",
										marginBottom: "28px",
									}}
								/>

								<p
									className='text-center font-bold'
									style={{
										fontSize: "20px",
										lineHeight: "1.6",
										marginBottom: "6px",
									}}>
									Expert Probate, Trust, and Conservatorship Real Estate
									Services handled personally from start to finish. Trusted by
									attorneys. Relied on by families. Built to keep the process
									moving, even when things get complicated.
								</p>
							</div>
						</FooterCard>

						{/* CARD 3 */}
						<FooterCard
							cardId={3}
							onSubscribeClick={handleSubscriptionOpen}
							isSubscriptionOpen={isSubscriptionModalOpen}>
							<div className='flex flex-col h-75'>
								<h2
									className='text-secondary'
									style={{
										fontSize: "30px",
										fontWeight: "800",
										textAlign: "center",
										marginBottom: "10px",
										marginLeft: "17px",
									}}>
									<AnimatedText
										text='Join Our Newsletter'
										as='span'
										animate={true}
									/>
								</h2>
								<div className='flex flex-col gap-3'>
									<p
										className='font-bold'
										style={{
											fontSize: "20px",
											textAlign: "center",
											lineHeight: "1.6",
										}}>
										Stay up to date with the latest news and updates from{" "}
										<b className='text-primary'>
											833PROBAID
											<span
												style={{
													verticalAlign: "super",
													fontSize: "0.9em",
													lineHeight: "0",
												}}>
												®
											</span>
										</b>
										.
									</p>
									<span
										className='font-bold'
										style={{
											fontSize: "20px",
											textAlign: "center",
										}}>
										Subscribe to our newsletter.
									</span>
									<form onSubmit={handleSubscriptionOpen}>
										<div className='border-secondary border-b-4 w-[90%] mx-auto mt-4 mb-5'>
											<input
												type='email'
												placeholder='Enter your E-mail'
												value={newsletterEmail}
												onChange={(event) => {
													setNewsletterEmail(event.target.value);
													if (subscriptionNotice) setSubscriptionNotice("");
												}}
												className='placeholder-secondary bg-transparent outline-none font-semibold py-2.5 text-[20px] placeholder:font-extrabold'
											/>
										</div>
									</form>
								</div>
							</div>
						</FooterCard>
					</div>
				</div>
			</div>
			<hr className='text-black/36' />
			<div className='mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-4 font-bold md:flex-row'>
				<p>
					© {new Date().getFullYear()}{" "}
					<span className='text-secondary'>
						833PROBAID
						<span
							style={{
								verticalAlign: "super",
								fontSize: "0.6em",
								lineHeight: "0",
							}}>
							®
						</span>
					</span>{" "}
					. All rights reserved.
				</p>
				<a className='text-secondary' href='#'>
					Privacy Policy & Terms of Service/Disclosure
				</a>
			</div>

			<NewsletterSubscriptionModal
				isOpen={isSubscriptionModalOpen}
				initialEmail={newsletterEmail}
				entryMessage={subscriptionNotice}
				onClose={() => {
					setIsSubscriptionModalOpen(false);
					setSubscriptionNotice("");
				}}
				onSuccess={handleSubscriptionSuccess}
			/>
		</footer>
	);
}

/* ========================= */
/* Reusable Footer Card */
/* ========================= */

function FooterCard({
	cardId,
	children,
	onSubscribeClick,
	isSubscriptionOpen,
}) {
	if (cardId === 1) {
		return (
			<div className='flex w-full justify-center'>
				<div className='w-full '>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 566 586'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g filter='url(#filter0_dii_273_13)'>
							<rect
								x='14.6001'
								y='13.5996'
								width='536'
								height='556'
								rx='22'
								fill='#0097A7'
							/>
							<rect
								x='15.1001'
								y='14.0996'
								width='535'
								height='555'
								rx='21.5'
								stroke='#005E68'
							/>
						</g>
						<g filter='url(#filter1_d_273_13)'>
							<path
								d='M59.743 44.5823L73.8858 30.5996H519.6V491.699L498.863 514.149L475.586 536.6H45.6001V58.6627L59.743 44.5823Z'
								fill='url(#paint0_linear_273_13)'
							/>
						</g>
						<g filter='url(#filter2_dd_273_13)'>
							<path
								d='M59.743 44.5823L73.8858 30.5996H519.6V491.699L498.863 514.149L475.586 536.6H45.6001V58.6627L59.743 44.5823Z'
								fill='#0097A7'
							/>
						</g>
						<g filter='url(#filter3_dd_273_13)'>
							<path
								d='M69.4009 91.6414L132.226 30.5996L434.133 31.0177V98.749L488.668 153.101V377.618L362.146 505.973H212.938L69.4009 357.131V91.6414Z'
								fill='white'
							/>
						</g>
						<path
							d='M45.9399 121.39L130.471 33.655L132.65 30.5996H73.7363L45.9399 58.0996V121.39Z'
							fill='#0097A7'
						/>
						<g filter='url(#filter4_i_273_13)'>
							<path
								d='M69.4021 86.5996L45.9399 110.1L46.8248 536.582H69.4021V86.5996Z'
								fill='#FE7702'
							/>
						</g>
						<g filter='url(#filter5_f_273_13)'>
							<path
								d='M46.6001 60.2467V120.6L138.6 30.5996H76.7288L46.6001 60.2467Z'
								fill='black'
								fillOpacity='0.82'
							/>
						</g>
						<path
							d='M45.6001 58.5996V115.6L131.6 30.5996H73.7638L45.6001 58.5996Z'
							fill='#0097A7'
						/>
						{/* Content */}
						<foreignObject x='85' y='70' width='390' height='370'>
							<div
								xmlns='http://www.w3.org/1999/xhtml'
								className='flex h-full w-full flex-col items-center justify-center px-6 overflow-visible z-50'>
								{children}
							</div>
						</foreignObject>
						<defs>
							<filter
								id='filter0_dii_273_13'
								x='9.72748e-05'
								y='-0.000391006'
								width='565.2'
								height='585.2'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feMorphology
									radius='4'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_273_13'
								/>
								<feOffset dy='1' />
								<feGaussianBlur stdDeviation='5.3' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_13'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_13'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='5' dy='-5' />
								<feGaussianBlur stdDeviation='3.2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='shape'
									result='effect2_innerShadow_273_13'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1' dy='6' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect2_innerShadow_273_13'
									result='effect3_innerShadow_273_13'
								/>
							</filter>
							<filter
								id='filter1_d_273_13'
								x='24.6001'
								y='24.5996'
								width='510'
								height='542'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-3' dy='12' />
								<feGaussianBlur stdDeviation='9' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_13'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_13'
									result='shape'
								/>
							</filter>
							<filter
								id='filter2_dd_273_13'
								x='30.6001'
								y='9.59961'
								width='510'
								height='542'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='3' dy='-3' />
								<feGaussianBlur stdDeviation='9' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_13'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='9' dy='-8' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_273_13'
									result='effect2_dropShadow_273_13'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_273_13'
									result='shape'
								/>
							</filter>
							<filter
								id='filter3_dd_273_13'
								x='57.3635'
								y='18.8996'
								width='455.004'
								height='516.131'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='1.02011' dy='16' />
								<feGaussianBlur stdDeviation='6.52874' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.68 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_13'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='12' />
								<feGaussianBlur stdDeviation='5.85' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_273_13'
									result='effect2_dropShadow_273_13'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_273_13'
									result='shape'
								/>
							</filter>
							<filter
								id='filter4_i_273_13'
								x='45.9399'
								y='86.5996'
								width='23.4619'
								height='454.063'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='4.08046' />
								<feGaussianBlur stdDeviation='9.7421' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='shape'
									result='effect1_innerShadow_273_13'
								/>
							</filter>
							<filter
								id='filter5_f_273_13'
								x='42.6001'
								y='26.5996'
								width='100'
								height='98'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feGaussianBlur
									stdDeviation='2'
									result='effect1_foregroundBlur_273_13'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_273_13'
								x1='282.6'
								y1='30.5996'
								x2='457.682'
								y2='512.969'
								gradientUnits='userSpaceOnUse'>
								<stop stopColor='#28AEB5' />
								<stop offset='1' stopColor='#127E84' />
							</linearGradient>
						</defs>
					</svg>
				</div>
			</div>
		);
	} else if (cardId === 2) {
		return (
			<div className='flex w-full justify-center'>
				<div className='w-full'>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 566 586'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g filter='url(#filter0_dii_273_12)'>
							<rect
								x='14.6001'
								y='13.5996'
								width='541'
								height='556'
								rx='22'
								fill='#0097A7'
							/>
							<rect
								x='15.1001'
								y='14.0996'
								width='540'
								height='555'
								rx='21.5'
								stroke='#005E68'
							/>
						</g>
						<g filter='url(#filter1_d_273_12)'>
							<rect
								x='45.6001'
								y='30.5996'
								width='479'
								height='506'
								fill='#0097A7'
							/>
						</g>
						<g filter='url(#filter2_d_273_12)'>
							<rect
								x='45.6001'
								y='30.5996'
								width='479'
								height='508'
								fill='#0097A7'
							/>
						</g>
						<path
							d='M442.6 30.5996H524.6V158.647L442.6 218.6V30.5996Z'
							fill='#FE7702'
						/>
						<path
							d='M134.6 30.5996H45.6001V158.647L134.6 218.6V30.5996Z'
							fill='#FE7702'
						/>
						<g filter='url(#filter3_dd_273_12)'>
							<path
								d='M76.6001 111.97L130.684 30.5996H442.044L493.095 112.672L493.6 437.453L442.044 507.6H130.794L76.6001 440.96V111.97Z'
								fill='white'
							/>
						</g>
						{/* Content */}
						<foreignObject
							x='100'
							y='70'
							width='370'
							height='320'
							className='overflow-visible'>
							<div
								xmlns='http://www.w3.org/1999/xhtml'
								className='flex h-full w-full flex-col items-center justify-center px-2'>
								{children}
							</div>
						</foreignObject>
						<defs>
							<filter
								id='filter0_dii_273_12'
								x='9.72748e-05'
								y='-0.000391006'
								width='570.2'
								height='585.2'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feMorphology
									radius='4'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_273_12'
								/>
								<feOffset dy='1' />
								<feGaussianBlur stdDeviation='5.3' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_12'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_12'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='5' dy='-5' />
								<feGaussianBlur stdDeviation='3.2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='shape'
									result='effect2_innerShadow_273_12'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1' dy='6' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect2_innerShadow_273_12'
									result='effect3_innerShadow_273_12'
								/>
							</filter>
							<filter
								id='filter1_d_273_12'
								x='23.7001'
								y='19.9209'
								width='522.8'
								height='549.8'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feMorphology
									radius='4'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_273_12'
								/>
								<feOffset dy='11.2213' />
								<feGaussianBlur stdDeviation='8.95' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_12'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_12'
									result='shape'
								/>
							</filter>
							<filter
								id='filter2_d_273_12'
								x='31.9001'
								y='10.8996'
								width='506.4'
								height='535.4'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='-6' />
								<feGaussianBlur stdDeviation='6.85' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.43 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_12'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_12'
									result='shape'
								/>
							</filter>
							<filter
								id='filter3_dd_273_12'
								x='48.238'
								y='21.2396'
								width='473.722'
								height='518.722'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-10' dy='14' />
								<feGaussianBlur stdDeviation='9.18103' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_12'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='10' dy='9' />
								<feGaussianBlur stdDeviation='9.18' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_273_12'
									result='effect2_dropShadow_273_12'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_273_12'
									result='shape'
								/>
							</filter>
						</defs>
					</svg>
				</div>
			</div>
		);
	} else {
		return (
			<div className='flex w-full justify-center'>
				<div className='w-full'>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 558 576'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g filter='url(#filter0_dii_273_11)'>
							<path
								d='M10.5996 31.5996C10.5996 19.4493 20.4493 9.59961 32.5996 9.59961H524.6C536.75 9.59961 546.6 19.4493 546.6 31.5996V541.6C546.6 553.75 536.75 563.6 524.6 563.6H32.5996C20.4493 563.6 10.5996 553.75 10.5996 541.6V31.5996Z'
								fill='#0097A7'
							/>
							<path
								d='M32.5996 10.0996H524.6C536.474 10.0996 546.1 19.7255 546.1 31.5996V541.6C546.1 553.474 536.474 563.1 524.6 563.1H32.5996C20.7255 563.1 11.0996 553.474 11.0996 541.6V31.5996C11.0996 19.7255 20.7255 10.0996 32.5996 10.0996Z'
								stroke='#005E68'
							/>
						</g>
						<g filter='url(#filter1_d_273_11)'>
							<path
								d='M501.457 40.5823L487.314 26.5996H41.5996V487.699L62.3371 510.149L85.6139 532.6H515.6V54.6627L501.457 40.5823Z'
								fill='url(#paint0_linear_273_11)'
							/>
						</g>
						<g filter='url(#filter2_d_273_11)'>
							<path
								d='M501.457 40.5823L487.314 26.5996H41.5996V487.699L62.3371 510.149L85.6139 532.6H515.6V54.6627L501.457 40.5823Z'
								fill='#0097A7'
							/>
						</g>
						<g filter='url(#filter3_dd_273_11)'>
							<path
								d='M491.795 87.6414L428.97 26.5996L127.063 27.0177V94.749L72.5277 149.101V373.618L199.05 501.973H348.258L491.795 353.131V87.6414Z'
								fill='white'
							/>
						</g>
						<g filter='url(#filter4_i_273_11)'>
							<path
								d='M491.604 86.7871L515.447 111.736L514.548 533.597H491.604V86.7871Z'
								fill='#FE7702'
							/>
						</g>
						<g filter='url(#filter5_f_273_11)'>
							<path
								d='M515.6 56.2467V116.6L423.6 26.5996H485.471L515.6 56.2467Z'
								fill='black'
								fillOpacity='0.82'
							/>
						</g>
						<path
							d='M515.6 54.5996V111.6L429.6 26.5996H487.436L515.6 54.5996Z'
							fill='#0097A7'
						/>
						{/* Content */}
						<foreignObject
							x='60'
							y='70'
							width='450'
							height='370'
							className='overflow-visible'>
							<div
								xmlns='http://www.w3.org/1999/xhtml'
								className='flex h-full w-full flex-col items-center justify-center px-6  overflow-visible'>
								{children}
							</div>
						</foreignObject>
						<style>{`
							.footer-btn-float {
								animation: footerBtnFloat 2.5s ease-in-out infinite;
								transform-box: fill-box;
								transform-origin: center center;
								cursor: pointer;
							}
							.footer-btn-float:focus,
							.footer-btn-float:focus-visible {
								outline: none;
							}
							.footer-subscribe-btn {
								transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
								transform-box: fill-box;
								transform-origin: center center;
							}
							.footer-btn-float:hover .footer-subscribe-btn {
								transform: rotate(-2deg) scale(1.08);
							}
							@keyframes footerBtnFloat {
								0%, 100% { transform: translateY(0px); }
								50% { transform: translateY(-8px); }
							}
						`}</style>
						<g
							className='footer-btn-float'
							onClick={(event) => {
								if (isSubscriptionOpen) return;
								onSubscribeClick?.(event);
							}}
							onKeyDown={(event) => {
								if (isSubscriptionOpen) return;
								if (event.key === "Enter" || event.key === " ") {
									onSubscribeClick?.(event);
								}
							}}
							role='button'
							tabIndex={isSubscriptionOpen ? -1 : 0}
							aria-label='Subscribe'>
							<image
								href='/svgs/subscribe.svg'
								xlinkHref='/svgs/subscribe.svg'
								x='183'
								y='385'
								width='200'
								height='67'
								className='footer-subscribe-btn'
							/>
						</g>
						<defs>
							<filter
								id='filter0_dii_273_11'
								x='-0.000391006'
								y='-0.000391006'
								width='557.2'
								height='575.2'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='1' />
								<feGaussianBlur stdDeviation='5.3' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_11'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_11'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='5' dy='-5' />
								<feGaussianBlur stdDeviation='3.2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='shape'
									result='effect2_innerShadow_273_11'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1' dy='6' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect2_innerShadow_273_11'
									result='effect3_innerShadow_273_11'
								/>
							</filter>
							<filter
								id='filter1_d_273_11'
								x='26.2996'
								y='20.2996'
								width='510.6'
								height='542.6'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='3' dy='12' />
								<feGaussianBlur stdDeviation='9.15' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_11'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_11'
									result='shape'
								/>
							</filter>
							<filter
								id='filter2_d_273_11'
								x='18.2996'
								y='4.29961'
								width='510.6'
								height='542.6'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-5' dy='-4' />
								<feGaussianBlur stdDeviation='9.15' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_11'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_273_11'
									result='shape'
								/>
							</filter>
							<filter
								id='filter3_dd_273_11'
								x='48.8273'
								y='18.8996'
								width='455.005'
								height='514.131'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1.02011' dy='18' />
								<feGaussianBlur stdDeviation='6.52874' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.68 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_273_11'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-12' dy='4' />
								<feGaussianBlur stdDeviation='5.85' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_273_11'
									result='effect2_dropShadow_273_11'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_273_11'
									result='shape'
								/>
							</filter>
							<filter
								id='filter4_i_273_11'
								x='491.604'
								y='86.7871'
								width='23.8438'
								height='450.957'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='4.14673' />
								<feGaussianBlur stdDeviation='9.90032' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='shape'
									result='effect1_innerShadow_273_11'
								/>
							</filter>
							<filter
								id='filter5_f_273_11'
								x='419.6'
								y='22.5996'
								width='100'
								height='98'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feGaussianBlur
									stdDeviation='2'
									result='effect1_foregroundBlur_273_11'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_273_11'
								x1='278.6'
								y1='26.5996'
								x2='110.176'
								y2='518.329'
								gradientUnits='userSpaceOnUse'>
								<stop stopColor='#28AEB5' />
								<stop offset='1' stopColor='#107C81' />
							</linearGradient>
						</defs>
					</svg>
				</div>
			</div>
		);
	}
}
