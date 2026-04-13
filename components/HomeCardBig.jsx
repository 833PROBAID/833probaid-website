"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

export default function HomeCardBig({
	uid,
	icon,
	title,
	subtitle,
	description,
	slug,
	onclick,
	bannerImage,
}) {
	const router = useRouter();
	const reactId = useId();
	const [isOpening, setIsOpening] = useState(false);
	const id = useMemo(() => {
		const raw = uid ?? slug ?? reactId;
		return String(raw).replace(/[^a-zA-Z0-9_-]/g, "_");
	}, [uid, slug, reactId]);

	const runAction = () => {
		if (slug) {
			router.push(`/homebooks/${slug}`);
		} else if (onclick) {
			onclick();
		}
	};

	const handleClick = () => {
		if (!slug && !onclick) return;
		if (isOpening) return;

		const prefersReducedMotion =
			typeof window !== "undefined" &&
			!!window.matchMedia &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) {
			runAction();
			return;
		}

		setIsOpening(true);
		setTimeout(() => {
			runAction();
		}, 500);
	};

	return (
		<div className={`${isOpening ? "" : "group"} flex w-full justify-center`}>
			<div className='hcb-card-wrapper w-[81%]' style={{ position: "relative" }}>
				<svg
					width='100%'
					height='100%'
					viewBox='0 0 1461 671'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='h-auto w-full overflow-visible'
					preserveAspectRatio='xMidYMid meet'
					style={{ position: "relative", zIndex: 3 }}>
					<style>{`
						
						.hcb-card-wrapper {
								filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
								transform: translateZ(0);
								will-change: filter;
								backface-visibility: hidden;
								-webkit-transform: translateZ(0);
								-webkit-backface-visibility: hidden;
						}
						.hcb-book-layer {
							transform-box: fill-box;
							will-change: transform;
						}
						.hcb-icon-float {
							animation: hcbIconFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
							transform-origin: center center;
							overflow: visible;
						}
						.hcb-icon-wrapper {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
							overflow: visible;
						}
						.hcb-card-wrapper:hover .hcb-icon-wrapper,
						.hcb-card-wrapper:has(.hcb-button-float:hover) .hcb-icon-wrapper {
							transform: rotate(-15deg) scale(1.1);
						}
						@keyframes hcbIconFloat {
							0%, 100% {
								transform: translateY(0px);
							}
							50% {
								transform: translateY(-8px);
							}
							75% {
								transform: translateY(-4px);
							}
						}
						.hcb-title-wrapper {
						}
						.hcb-subtitle-wrapper {
						}
						.hcb-description-wrapper {
						}
						.hcb-title-text {
							font-family: "Montserrat", sans-serif;
							font-size: 32px;
							font-weight: 700;
							color: white;
							text-transform: uppercase;
							line-height: 1.2;
							padding: 0 40px;
							text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0px 4px 8px rgba(0,0,0,0.3);
							letter-spacing: 2.5px;
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
						.hcb-subtitle-text {
							font-family: "Montserrat", sans-serif;
							font-size: 25px;
							font-weight: 900;
							color: white;
							line-height: 1.3;
							padding: 0 40px;
							text-shadow: 2px 2px 4px rgba(0,0,0,0.4), 0px 2px 6px rgba(0,0,0,0.3);
							letter-spacing: 2.5px;
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
						.hcb-desc-text {
							font-family: "Montserrat", sans-serif;
							font-size: 25px;
							font-weight: 600;
							color: white;
							line-height: 1.5;
							padding: 0 60px;
							text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
							letter-spacing: 2.7px;
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
						.hcb-button-float {
							animation: hcbIconFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
						transform-origin: center center;
						outline: none;
					}
						.hcb-button-wrapper {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.hcb-button-float:hover .hcb-button-wrapper {
							transform: rotate(-2deg) scale(1.08);
						}
						.hcb-page-left { transform-origin: 0% 50%; }
						.hcb-open-left { animation: hcbBookOpenLeft 0.5s ease-in-out forwards; }
						.hcb-shadow { opacity: 0; }
						.hcb-shadow-open { animation: hcbShadowOpen 0.5s ease-in-out forwards; }
						.hcb-thickness {
							opacity: 0;
							transform-box: fill-box;
							will-change: transform, opacity;
							transform-origin: left center;
							transform: scaleX(0.08);
						}
						.hcb-thickness-open { animation: hcbThicknessOpen 0.5s ease-in-out forwards; }
						.hcb-spine-round { 
							opacity: 0; 
							transform-box: fill-box; 
							will-change: opacity, transform; 
						}
						.hcb-spine-round-open { animation: hcbSpineRound 0.5s ease-in-out forwards; }
						.hcb-book-text {
							opacity: 0;
							will-change: opacity;
						}
						.hcb-book-text-open {
							animation: hcbBookTextFade 0.5s ease-in-out forwards;
						}
						@media (prefers-reduced-motion: reduce) {
							.hcb-open-left,
							.hcb-shadow-open,
							.hcb-thickness-open,
							.hcb-spine-round-open {
								animation: none !important;
							}
						}
						@media (max-width: 767px) {
							.hcb-card-wrapper:hover .hcb-icon-wrapper,
							.hcb-card-wrapper:has(.hcb-button-float:hover) .hcb-icon-wrapper {
								transform: none !important;
							}
							.hcb-button-float:hover .hcb-button-wrapper {
								transform: none !important;
							}
						}
						@keyframes hcbBookOpenLeft {
								0%   { transform: translateY(0%)     skewY(0deg)   scaleX(1);    }
								10%  { transform: translateY(-0.05%) skewY(-10deg)  scaleX(0.92); }
								25%  { transform: translateY(-0.15%) skewY(-30deg)  scaleX(0.70); }
								45%  { transform: translateY(-0.28%) skewY(-57deg)  scaleX(0.40); }
								65%  { transform: translateY(-0.33%) skewY(-74deg)  scaleX(0.22); }
								82%  { transform: translateY(-0.35%) skewY(-83deg)  scaleX(0.14); }
								100% { transform: translateY(-0.35%) skewY(-87deg)  scaleX(0.12); }
						}
						@keyframes hcbShadowOpen {
							0%   { opacity: 0; }
							100% { opacity: 0.20; }
						}
						@keyframes hcbThicknessOpen {
								0%   { opacity: 0;    transform: scaleX(0.20); }
								25%  { opacity: 0.30; transform: scaleX(0.55); }
								60%  { opacity: 0.70; transform: scaleX(0.85); }
							100% { opacity: 0.92; transform: scaleX(1); }
						}
						@keyframes hcbSpineRound {
							0%   { opacity: 0; transform: scaleX(0.70); }
							35%  { opacity: 0.85; transform: scaleX(1); }
							100% { opacity: 0.65; transform: scaleX(1); }
						}
						@keyframes hcbBookTextFade {
							0%   { opacity: 1; }
							100% { opacity: 1; }
						}
					`}</style>
					<g filter={`url(#filter0_ddii_147_8_${id})`}>
						<rect
							width='1421'
							height='626'
							rx='13.5393'
							transform='matrix(1 0 0 -1 16.2998 650.1)'
							fill={`url(#paint0_linear_147_8_${id})`}
						/>
						<rect
							x='0.5'
							y='-0.5'
							width='1420'
							height='625'
							rx='13.0393'
							transform='matrix(1 0 0 -1 16.2998 649.1)'
							stroke='#014E57'
						/>
					</g>

					{/* Book inner pages — SVG native image, works in all browsers */}
					{isOpening && (
						<>
							<path
								d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H81.0674C72.9115 74.1 66.2998 80.7116 66.2998 88.8675V585.332C66.2998 593.488 72.9115 600.1 81.0674 600.1H1262C1265.75 600.1 1269.37 598.672 1272.1 596.106L1382.63 492.489C1385.61 489.697 1387.3 485.797 1387.3 481.715V88.8676Z'
								fill='#F8F5ED'
							/>
							<defs>
								<clipPath id={`hcb_img_clip_${id}`}>
									<path d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H81.0674C72.9115 74.1 66.2998 80.7116 66.2998 88.8675V585.332C66.2998 593.488 72.9115 600.1 81.0674 600.1H1262C1265.75 600.1 1269.37 598.672 1272.1 596.106L1382.63 492.489C1385.61 489.697 1387.3 485.797 1387.3 481.715V88.8676Z' />
								</clipPath>
							</defs>
							<foreignObject
								x='100'
								y='90'
								width='1250'
								height='190'
								clipPath={`url(#hcb_img_clip_${id})`}>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									style={{
										width: "100%",
										height: "100%",
										boxSizing: "border-box",
										display: "flex",
										alignItems: "flex-start",
										justifyContent: "center",
										padding: "0",
									}}>
									<div
										className='flex flex-col items-center justify-center p-3 text-center sm:px-6 md:p-8 my-4 sm:my-6 border-4 rounded-3xl border-secondary bg-white/90'
										style={{
											width: "100%",
											maxWidth: "100%",
											boxSizing: "border-box",
										}}>
										<h1 className='font-anton text-xl uppercase leading-tight text-primary sm:text-2xl md:text-3xl'>
											{title.includes("®") ? (
												<>
													{title.split("®")[0]}
													<span
														style={{
															verticalAlign: "super",
															fontSize: "0.9em",
															lineHeight: "0",
														}}>
														®
													</span>
													{title.split("®")[1]}
												</>
											) : (
												<>{title}</>
											)}
										</h1>
										<p className='font-montserrat mt-2 text-sm font-bold uppercase text-secondary sm:mt-3 sm:text-base md:text-lg'>
											{subtitle.includes("®") ? (
												<>
													{subtitle.split("®")[0]}
													<span
														style={{
															verticalAlign: "super",
															fontSize: "0.9em",
															lineHeight: "0",
														}}>
														®
													</span>
													{subtitle.split("®")[1]}
												</>
											) : (
												<>{subtitle}</>
											)}
										</p>
									</div>
								</div>
							</foreignObject>
							<image
								href={bannerImage || icon}
								xlinkHref={bannerImage || icon}
								x='66'
								y='280'
								width='1321'
								height='5000'
								preserveAspectRatio='xMidYMin meet'
								clipPath={`url(#hcb_img_clip_${id})`}
							/>
						</>
					)}
					<g
						className={`hcb-book-layer hcb-page-left ${isOpening ? "hcb-open-left" : ""}`}>
						<g filter={`url(#filter1_d_147_8_${id})`}>
							<path
								d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H82.0674C73.9115 74.1 67.2998 80.7116 67.2998 88.8675V585.332C67.2998 593.488 73.9115 600.1 82.0674 600.1H1262.09C1265.84 600.1 1269.46 598.671 1272.19 596.102L1382.64 492.488C1385.61 489.697 1387.3 485.798 1387.3 481.718V88.8676Z'
								fill='#0097A7'
							/>
						</g>
						<g filter={`url(#filter2_d_147_8_${id})`}>
							<path
								d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H81.0674C72.9115 74.1 66.2998 80.7116 66.2998 88.8675V585.332C66.2998 593.488 72.9115 600.1 81.0674 600.1H1262C1265.75 600.1 1269.37 598.672 1272.1 596.106L1382.63 492.489C1385.61 489.697 1387.3 485.797 1387.3 481.715V88.8676Z'
								fill='#0097A7'
							/>
							<path
								d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H81.0674C72.9115 74.1 66.2998 80.7116 66.2998 88.8675V585.332C66.2998 593.488 72.9115 600.1 81.0674 600.1H1262C1265.75 600.1 1269.37 598.672 1272.1 596.106L1382.63 492.489C1385.61 489.697 1387.3 485.797 1387.3 481.715V88.8676Z'
								fill='#000000'
								className={`hcb-shadow ${isOpening ? "hcb-shadow-open" : ""}`}
							/>
						</g>
						<defs>
							<clipPath id={`hcb_content_clip_${id}`}>
								<path d='M1387.3 88.8676C1387.3 80.7117 1380.69 74.1 1372.53 74.1H81.0674C72.9115 74.1 66.2998 80.7116 66.2998 88.8675V585.332C66.2998 593.488 72.9115 600.1 81.0674 600.1H1262C1265.75 600.1 1269.37 598.672 1272.1 596.106L1382.63 492.489C1385.61 489.697 1387.3 485.797 1387.3 481.715V88.8676Z' />
							</clipPath>
						</defs>
						<g clipPath={`url(#hcb_content_clip_${id})`}>
							<g filter={`url(#filter3_dd_147_8_${id})`}>
								<rect
									x='65.2998'
									y='298.1'
									width='1322'
									height='74'
									fill='#FE7702'
								/>
							</g>

							{/* Icon */}
							<g className='hcb-icon-float'>
								<image
									href={icon}
									xlinkHref={icon}
									x='650'
									y='90'
									width='140'
									height='140'
									preserveAspectRatio='xMidYMid meet'
									className='hcb-icon-wrapper'
									overflow='visible'
								/>
							</g>
							{/* Title */}
							<foreignObject x='100' y='248' width='1260' height='90'>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hcb-title-wrapper flex items-center justify-center text-center overflow-visible'>
									<h1 className='hcb-title-text'>
										{" "}
										{title.includes("®") ? (
											<>
												{title.split("®")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{title.split("®")[1]}
											</>
										) : (
											<>{title}</>
										)}
									</h1>
								</div>
							</foreignObject>

							{/* Subtitle in orange banner */}
							<foreignObject x='80' y='305' width='1300' height='60'>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hcb-subtitle-wrapper flex h-full items-center justify-center text-center overflow-visible'>
									<p className='hcb-subtitle-text'>
										{subtitle.includes("®") ? (
											<>
												{subtitle.split("®")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{subtitle.split("®")[1]}
											</>
										) : (
											<>{subtitle}</>
										)}
									</p>
								</div>
							</foreignObject>

							{/* Description */}
							<foreignObject x='100' y='385' width='1260' height='100'>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hcb-description-wrapper flex items-center justify-center text-center overflow-visible'>
									<p className='hcb-desc-text'>
										{" "}
										{description.includes("®") ? (
											<>
												{description.split("®")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{description.split("®")[1]}
											</>
										) : (
											<>{description}</>
										)}
									</p>
								</div>
							</foreignObject>

							{/* Button SVG */}
							<g
								className='hcb-button-float'
							onClick={(e) => {
								e.stopPropagation();
								handleClick();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									e.stopPropagation();
									handleClick();
								}
							}}
							role={slug || onclick ? "button" : undefined}
							tabIndex={slug || onclick ? 0 : undefined}
							aria-label={slug || onclick ? `Open ${title}` : undefined}
							aria-disabled={isOpening || (!slug && !onclick) ? true : undefined}
							style={{ cursor: slug || onclick ? "pointer" : "default" }}>
							<image
								href='/svgs/learn_more.svg'
								xlinkHref='/svgs/learn_more.svg'
								x='520'
								y='465'
								width='380'
								height='127'
								preserveAspectRatio='xMidYMid meet'
								className='hcb-button-wrapper'
							/>
						</g>
					</g>
				</g>

					{/* Holder bars - stay fixed, don't flip with the book */}
					<g aria-hidden='true'>
						<g filter={`url(#filter4_d_147_8_${id})`}>
							<rect
								width='26'
								height='197'
								transform='matrix(-1 0 0 1 80.2998 24.1)'
								fill='#FE7702'
							/>
						</g>
						<g filter={`url(#filter5_d_147_8_${id})`}>
							<rect
								width='26'
								height='200'
								transform='matrix(-1 0 0 1 80.2998 450.1)'
								fill='#FE7702'
							/>
						</g>
					</g>

					<defs>
						<filter
							id={`filter0_ddii_147_8_${id}`}
							x='-0.000195503'
							y='-2.47955e-05'
							width='1460.4'
							height='670.4'
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
								radius='3'
								operator='dilate'
								in='SourceAlpha'
								result='effect1_dropShadow_147_8'
							/>
							<feOffset dx='-2' dy='6' />
							<feGaussianBlur stdDeviation='5.65' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feMorphology
								radius='3'
								operator='dilate'
								in='SourceAlpha'
								result='effect2_dropShadow_147_8'
							/>
							<feOffset dx='5' dy='-6' />
							<feGaussianBlur stdDeviation='7.55' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_147_8'
								result='effect2_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_147_8'
								result='shape'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='5' dy='-6' />
							<feGaussianBlur stdDeviation='2' />
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
								result='effect3_innerShadow_147_8'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dy='6' />
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
								in2='effect3_innerShadow_147_8'
								result='effect4_innerShadow_147_8'
							/>
						</filter>
						<filter
							id={`filter1_d_147_8_${id}`}
							x='48.9965'
							y='71.7967'
							width='1358.61'
							height='564.607'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='1' dy='17' />
							<feGaussianBlur stdDeviation='9.65166' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_147_8'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter2_d_147_8_${id}`}
							x='56.9965'
							y='43.7967'
							width='1359.61'
							height='564.607'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='10' dy='-11' />
							<feGaussianBlur stdDeviation='9.65166' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.69 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_147_8'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter3_dd_147_8_${id}`}
							x='61.2998'
							y='291.1'
							width='1330'
							height='89'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dy='4' />
							<feGaussianBlur stdDeviation='2' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dy='-3' />
							<feGaussianBlur stdDeviation='2' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_147_8'
								result='effect2_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_147_8'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter4_d_147_8_${id}`}
							x='54.2998'
							y='24.1'
							width='36.5483'
							height='209.658'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='6.32896' dy='8.43861' />
							<feGaussianBlur stdDeviation='2.10965' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_147_8'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter5_d_147_8_${id}`}
							x='54.2998'
							y='441.661'
							width='36.5483'
							height='208.439'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='6.32896' dy='-4.2193' />
							<feGaussianBlur stdDeviation='2.10965' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_8'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_147_8'
								result='shape'
							/>
						</filter>
						<linearGradient
							id={`paint0_linear_147_8_${id}`}
							x1='-25.4992'
							y1='119.805'
							x2='1896.25'
							y2='1530.52'
							gradientUnits='userSpaceOnUse'>
							<stop stopColor='#0097A7' />
							<stop offset='1' stopColor='#007B88' />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>
	);
}
