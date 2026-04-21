/* eslint-disable @next/next/no-img-element */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

export default function HomeCard({
	id: legacyId,
	alignIndex,
	uid,
	icon,
	title,
	subtitle,
	description,
	slug,
	onclick,
	bannerImage,
}) {
	const reactId = useId();
	const [isOpening, setIsOpening] = useState(false);
	const [isSafariBrowser, setIsSafariBrowser] = useState(false);
	const computedAlignIndex =
		typeof alignIndex === "number" && Number.isFinite(alignIndex)
			? alignIndex
			: typeof legacyId === "number" && Number.isFinite(legacyId)
				? legacyId
				: 1;
	const isRightAligned = computedAlignIndex % 2 === 0;

	const svgUid = useMemo(() => {
		const raw =
			uid ?? (legacyId != null ? String(legacyId) : null) ?? slug ?? reactId;
		return String(raw).replace(/[^a-zA-Z0-9_-]/g, "_");
	}, [uid, legacyId, slug, reactId]);

	const id = svgUid;
	const pageAnimClass = isOpening
		? isRightAligned
			? "hc-open-right"
			: "hc-open-left"
		: "";
	const pageSideClass = isRightAligned ? "hc-page-right" : "hc-page-left";
	const bookLayerClass = `hc-book-layer ${pageSideClass} ${pageAnimClass}`;

	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined") return;
		const ua = window.navigator.userAgent || "";
		setIsSafariBrowser(/^((?!chrome|android).)*safari/i.test(ua));
	}, []);

	const runAction = () => {
		if (slug) {
			router.push(`/homebooks/${slug}`);
			return;
		}
		if (onclick) onclick();
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

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<div
			className={`${isOpening ? "" : "group"} flex w-full justify-center ${!isRightAligned ? "sm:justify-end" : "sm:justify-start"}`}>
			<div className='hc-card-wrapper w-full sm:w-4/5' style={{ position: "relative" }}>
				<svg
					width='100%'
					height='100%'
					viewBox='0 0 660 995'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='h-auto w-full overflow-visible'
					preserveAspectRatio='xMidYMid meet'
					style={{
						position: "relative",
						zIndex: 3,
						...(isSafariBrowser
							? {
									transform: "translateZ(0)",
									WebkitTransform: "translateZ(0)",
									backfaceVisibility: "hidden",
									WebkitBackfaceVisibility: "hidden",
								}
							: {}),
					}}>
					<defs>
						<linearGradient
							id={`hc_shadow_left_${id}`}
							x1='66.2998'
							y1='75.1'
							x2='586.3'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#000000' stopOpacity='0.15' />
							<stop offset='0.55' stopColor='#000000' stopOpacity='0' />
						</linearGradient>
						<linearGradient
							id={`hc_shadow_right_${id}`}
							x1='586.3'
							y1='75.1'
							x2='66.2998'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#000000' stopOpacity='0.15' />
							<stop offset='0.55' stopColor='#000000' stopOpacity='0' />
						</linearGradient>
						<linearGradient
							id={`hc_thickness_left_${id}`}
							x1='66.2998'
							y1='75.1'
							x2='82.2998'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#E5E7EB' stopOpacity='0.35' />
							<stop offset='0.4' stopColor='#E5E7EB' stopOpacity='0.75' />
							<stop offset='1' stopColor='#9CA3AF' stopOpacity='0.55' />
						</linearGradient>
						<linearGradient
							id={`hc_thickness_right_${id}`}
							x1='586.3'
							y1='75.1'
							x2='570.3'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#E5E7EB' stopOpacity='0.35' />
							<stop offset='0.4' stopColor='#E5E7EB' stopOpacity='0.75' />
							<stop offset='1' stopColor='#9CA3AF' stopOpacity='0.55' />
						</linearGradient>
						<linearGradient
							id={`hc_spine_round_left_${id}`}
							x1='66.2998'
							y1='75.1'
							x2='90.2998'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#000000' stopOpacity='0.12' />
							<stop offset='0.55' stopColor='#000000' stopOpacity='0.04' />
							<stop offset='1' stopColor='#000000' stopOpacity='0' />
						</linearGradient>
						<linearGradient
							id={`hc_spine_round_right_${id}`}
							x1='586.3'
							y1='75.1'
							x2='562.3'
							y2='75.1'
							gradientUnits='userSpaceOnUse'>
							<stop offset='0' stopColor='#000000' stopOpacity='0.12' />
							<stop offset='0.55' stopColor='#000000' stopOpacity='0.04' />
							<stop offset='1' stopColor='#000000' stopOpacity='0' />
						</linearGradient>
						<clipPath id={`hc_book_clip_${id}`}>
							<rect x='66.2998' y='75.1' width='520' height='849' rx='13.5' />
						</clipPath>
					</defs>
					<g filter={`url(#filter0_ddii_142_3_${id})`}>
						{isRightAligned ? (
							<>
								<rect
									width='620'
									height='950'
									rx='13.5393'
									transform='matrix(1 0 0 -1 16.2998 974.1)'
									fill={`url(#paint0_linear_142_3_${id})`}
								/>
								<rect
									x='0.5'
									y='-0.5'
									width='619'
									height='949'
									rx='13.0393'
									transform='matrix(1 0 0 -1 16.2998 973.1)'
									stroke='#014E57'
								/>
							</>
						) : (
							<>
								<rect
									x='16.2998'
									y='24.1'
									width='620'
									height='950'
									rx='13.5393'
									fill={`url(#paint0_linear_142_3_${id})`}
								/>
								<rect
									x='16.7998'
									y='24.6'
									width='619'
									height='949'
									rx='13.0393'
									stroke='#014E57'
								/>
							</>
						)}
					</g>

					{isRightAligned ? (
						<g
							className={`hc-thickness hc-thickness-right ${
								isOpening ? "hc-thickness-open-right" : ""
							}`}
							aria-hidden='true'>
							<rect
								x='570.3'
								y='75.1'
								width='16'
								height='849'
								rx='3'
								fill={`url(#hc_thickness_right_${id})`}
							/>
							<g opacity='0.18'>
								<path d='M571.8 140.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 220.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 300.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 380.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 460.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 540.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 620.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 700.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M571.8 780.1H584.8' stroke='#9CA3AF' strokeWidth='1' />
							</g>
						</g>
					) : (
						<g
							className={`hc-thickness hc-thickness-left ${
								isOpening ? "hc-thickness-open-left" : ""
							}`}
							aria-hidden='true'>
							<rect
								x='66.2998'
								y='75.1'
								width='16'
								height='849'
								rx='3'
								fill={`url(#hc_thickness_left_${id})`}
							/>
							<g opacity='0.18'>
								<path d='M67.8 140.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 220.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 300.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 380.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 460.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 540.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 620.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 700.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
								<path d='M67.8 780.1H80.8' stroke='#9CA3AF' strokeWidth='1' />
							</g>
						</g>
					)}

					{/* Book inner pages — SVG native image, works in all browsers */}
					{isOpening && (
						<>
							<path
								d={
									isRightAligned
										? "M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z"
										: "M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z"
								}
								fill='#F8F5ED'
							/>
							<defs>
								<clipPath id={`hc_img_clip_${id}`}>
									<path
										d={
											isRightAligned
												? "M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z"
												: "M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z"
										}
									/>
								</clipPath>
							</defs>
							<foreignObject
								x='85'
								y='60'
								width='480'
								height='900'
								clipPath={`url(#hc_img_clip_${id})`}>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									style={{
										width: "100%",
										height: "100%",
										boxSizing: "border-box",
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										justifyContent: "center",
										padding: "0",
									}}>
									<div
										className='flex flex-col items-center justify-center p-3 text-center sm:px-6 md:p-8 sm:my-6 border-4 rounded-3xl border-secondary bg-white/90'
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
									<img
										src={bannerImage || "/images/hero.jpg"}
										alt='Banner'
										loading='lazy'
										decoding='async'
										className='my-5'
									/>
									<div
										xmlns='http://www.w3.org/1999/xhtml'
										style={{
											width: "100%",
											boxSizing: "border-box",
											display: "flex",
											flexDirection: "column",
											alignItems: "flex-start",
											justifyContent: "center",
											padding: "0",
										}}>
										<div
											className='flex flex-col items-center justify-center p-3 text-center sm:px-6 md:p-8 sm:my-6 border-4 rounded-3xl border-secondary bg-white/90'
											style={{
												width: "100%",
												maxWidth: "100%",
												boxSizing: "border-box",
											}}>
											<p className='font-montserrat text-sm font-bold uppercase text-secondary'>
												{description.includes("®") ? (
													<>
														{description.split("®")[0]}
														<span
															style={{
																verticalAlign: "super",
																fontSize: "0.9em",
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
									</div>
								</div>
							</foreignObject>
						</>
					)}

					{isRightAligned ? (
						<>
							<g className={bookLayerClass}>
								<g filter={`url(#filter1_d_142_3_${id}_right)`}>
									<path
										d='M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z'
										fill='#0097A7'
									/>
								</g>
								<g filter={`url(#filter2_d_142_3_${id}_right)`}>
									<path
										d='M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z'
										fill='#0097A7'
									/>
									<path
										d='M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z'
										fill={`url(#hc_shadow_right_${id})`}
										className={`hc-page-shadow ${isOpening ? "hc-shadow-open-right" : ""}`}
									/>
								</g>
								<rect
									x='570.3'
									y='75.1'
									width='20'
									height='849'
									rx='10'
									fill={`url(#hc_spine_round_right_${id})`}
									className={`hc-spine-round ${isOpening ? "hc-spine-round-open" : ""}`}
									aria-hidden='true'
								/>
								<g
									filter={`url(#filter3_${isRightAligned ? "d" : "dd"}_142_3_${id})`}>
									<rect
										x='66.2998'
										y='424.1'
										width='520'
										height='142'
										fill='#FE7702'
									/>
								</g>
							</g>
						</>
					) : (
						<>
							<g className={bookLayerClass}>
								<g filter={`url(#filter1_d_142_3_${id})`}>
									<path
										d='M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z'
										fill='#0097A7'
									/>
								</g>
								<g filter={`url(#filter2_d_142_3_${id})`}>
									<path
										d='M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z'
										fill='#0097A7'
									/>
									<path
										d='M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z'
										fill={`url(#hc_shadow_left_${id})`}
										className={`hc-page-shadow ${isOpening ? "hc-shadow-open-left" : ""}`}
									/>
								</g>
								<rect
									x='66.2998'
									y='75.1'
									width='20'
									height='849'
									rx='10'
									fill={`url(#hc_spine_round_left_${id})`}
									className={`hc-spine-round ${isOpening ? "hc-spine-round-open" : ""}`}
									aria-hidden='true'
								/>
								<g
									filter={`url(#filter3_${isRightAligned ? "d" : "dd"}_142_3_${id})`}>
									<rect
										x='66.2998'
										y='424.1'
										width='520'
										height='142'
										fill='#FE7702'
									/>
								</g>
							</g>
						</>
					)}

					{/* Holder lip: tilts slightly with the flip, while the main holder stays fixed */}
					{!isRightAligned ? (
						<g
							aria-hidden='true'
							className={`hc-holder-lip-layer hc-holder-lip-left ${
								isOpening ? "hc-holder-lip-open-left" : ""
							}`}>
							<rect
								x='54.2998'
								y='24.1'
								width='12'
								height='197'
								rx='6'
								fill='#FE7702'
							/>
							<rect
								x='54.2998'
								y='773.1'
								width='12'
								height='200'
								rx='6'
								fill='#FE7702'
							/>
						</g>
					) : (
						<g
							aria-hidden='true'
							className={`hc-holder-lip-layer hc-holder-lip-right ${
								isOpening ? "hc-holder-lip-open-right" : ""
							}`}>
							<rect
								x='586.3'
								y='24.1'
								width='12'
								height='197'
								rx='6'
								fill='#FE7702'
							/>
							<rect
								x='586.3'
								y='773.1'
								width='12'
								height='200'
								rx='6'
								fill='#FE7702'
							/>
						</g>
					)}

					<g
						aria-hidden='true'
						className={`hc-holder-layer ${isOpening ? "hc-holder-open" : ""}`}>
						{!isRightAligned ? (
							<>
								<g filter={`url(#filter_bar_shadow3d_top_${id})`}>
									<rect
										width='26'
										height='197'
										transform='matrix(-1 0 0 1 80.2998 24.1)'
										fill='#FE7702'
									/>
									<rect
										width='26'
										height='197'
										transform='matrix(-1 0 0 1 80.2998 24.1)'
										fill='#000000'
										className={`hc-holder-shade ${isOpening ? "hc-holder-shade-open" : ""}`}
									/>
								</g>
								<g filter={`url(#filter_bar_shadow3d_bottom_${id})`}>
									<rect
										width='26'
										height='200'
										transform='matrix(-1 0 0 1 80.2998 773.1)'
										fill='#FE7702'
									/>
									<rect
										width='26'
										height='200'
										transform='matrix(-1 0 0 1 80.2998 773.1)'
										fill='#000000'
										className={`hc-holder-shade ${isOpening ? "hc-holder-shade-open" : ""}`}
									/>
								</g>
							</>
						) : (
							<>
								<g filter={`url(#filter_bar_shadow3d_top_${id}_right)`}>
									<rect
										width='26'
										height='197'
										transform='matrix(-1 0 0 1 598.3 24.1)'
										fill='#FE7702'
									/>
									<rect
										width='26'
										height='197'
										transform='matrix(-1 0 0 1 598.3 24.1)'
										fill='#000000'
										className={`hc-holder-shade ${isOpening ? "hc-holder-shade-open" : ""}`}
									/>
								</g>
								<g filter={`url(#filter_bar_shadow3d_bottom_${id}_right)`}>
									<rect
										width='26'
										height='200'
										transform='matrix(-1 0 0 1 598.3 773.1)'
										fill='#FE7702'
									/>
									<rect
										width='26'
										height='200'
										transform='matrix(-1 0 0 1 598.3 773.1)'
										fill='#000000'
										className={`hc-holder-shade ${isOpening ? "hc-holder-shade-open" : ""}`}
									/>
								</g>
							</>
						)}
					</g>

					<g className={bookLayerClass}>
						<g
							clipPath={`url(#hc_book_clip_${id})`}
							className='hc-content-clip'>
							{/* Icon */}
							<g className='hc-icon-float'>
								<image
									href={icon}
									xlinkHref={icon}
									x='230'
									y='100'
									width='200'
									height='140'
									preserveAspectRatio='xMidYMid meet'
									className='hc-icon-wrapper'
									overflow='visible'
								/>
							</g>

							{/* Title */}
							<foreignObject
								x='45'
								y='265'
								width='570'
								height='140'
								style={{ overflow: "visible" }}>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hc-title-wrapper flex items-center justify-center text-center'>
									<h1 className='hc-title-text'>
										{title.includes("\u00ae") ? (
											<>
												{title.split("\u00ae")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{title.split("\u00ae")[1]}
											</>
										) : (
											<>{title}</>
										)}
									</h1>
								</div>
							</foreignObject>

							<foreignObject
								x='45'
								y='435'
								width='570'
								height='120'
								style={{ overflow: "visible" }}>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hc-subtitle-wrapper flex h-full items-center justify-center text-center'>
									<p className='hc-subtitle-text'>
										{subtitle.includes("\u00ae") ? (
											<>
												{subtitle.split("\u00ae")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{subtitle.split("\u00ae")[1]}
											</>
										) : (
											<>{subtitle}</>
										)}
									</p>
								</div>
							</foreignObject>

							<foreignObject
								x='45'
								y='590'
								width='570'
								height='200'
								style={{ overflow: "hidden" }}>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className='hc-description-wrapper flex items-center justify-center text-center overflow-visible'>
									<p className='hc-desc-text'>
										{description.includes("\u00ae") ? (
											<>
												{description.split("\u00ae")[0]}
												<span
													style={{
														verticalAlign: "super",
														fontSize: "0.6em",
														lineHeight: "0",
													}}>
													®
												</span>
												{description.split("\u00ae")[1]}
											</>
										) : (
											<>{description}</>
										)}
									</p>
								</div>
							</foreignObject>
						</g>

						<g
							className='hc-button-float'
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
							aria-disabled={
								isOpening || (!slug && !onclick) ? true : undefined
							}
							style={{ cursor: slug || onclick ? "pointer" : "default" }}>
							<image
								href='/svgs/learn_more.svg'
								xlinkHref='/svgs/learn_more.svg'
								x={isRightAligned ? "170" : "140"}
								y='790'
								width='350'
								height='117'
								preserveAspectRatio='xMidYMid meet'
								className='hc-button-wrapper'
							/>
						</g>
					</g>

					<defs>
						<filter
							id={`filter0_ddii_142_3_${id}`}
							x='-0.000195503'
							y='5.72205e-06'
							width='659.4'
							height='994.4'
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
								result='effect1_dropShadow_142_3'
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
								result='effect1_dropShadow_142_3'
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
								result='effect2_dropShadow_142_3'
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
								in2='effect1_dropShadow_142_3'
								result='effect2_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_142_3'
								result='shape'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-5' dy='-6' />
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
								result='effect3_innerShadow_142_3'
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
								in2='effect3_innerShadow_142_3'
								result='effect4_innerShadow_142_3'
							/>
						</filter>
						<filter
							id={`filter1_d_142_3_${id}`}
							x='44.4969'
							y='61.33'
							width='565.54'
							height='894.54'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='0.967096' dy='9' />
							<feGaussianBlur stdDeviation='11.385' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.97 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_142_3'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter2_d_142_3_${id}`}
							x='46.1998'
							y='42'
							width='568.2'
							height='897.2'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='4' dy='-9' />
							<feGaussianBlur stdDeviation='12.05' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.97 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_142_3'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter3_dd_142_3_${id}`}
							x='60.0998'
							y='414.9'
							width='532.4'
							height='160.8'
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
							<feGaussianBlur stdDeviation='2.8' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_142_3'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dy='-3' />
							<feGaussianBlur stdDeviation='3.1' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_142_3'
								result='effect2_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_142_3'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter4_d_142_3_${id}`}
							x='46.3998'
							y='45.8586'
							width='43.8'
							height='256.535'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='2' dy='1' />
							<feGaussianBlur stdDeviation='4.95' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.96 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_142_3'
								result='shape'
							/>
						</filter>
						<filter
							id={`filter_bar_shadow3d_top_${id}`}
							x='38.3998'
							y='15.1'
							width='59.8'
							height='225.4'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-4' dy='3' />
							<feGaussianBlur stdDeviation='5' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_bar3d'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='4' dy='-2' />
							<feGaussianBlur stdDeviation='3.5' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_bar3d'
								result='effect2_dropShadow_bar3d'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_bar3d'
								result='shape'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='3' dy='3' />
							<feGaussianBlur stdDeviation='1.5' />
							<feComposite
								in2='hardAlpha'
								operator='arithmetic'
								k2='-1'
								k3='1'
							/>
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0'
							/>
							<feBlend
								mode='normal'
								in2='shape'
								result='effect3_innerShadow_bar3d'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-3' dy='-3' />
							<feGaussianBlur stdDeviation='1.5' />
							<feComposite
								in2='hardAlpha'
								operator='arithmetic'
								k2='-1'
								k3='1'
							/>
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0'
							/>
							<feBlend
								mode='normal'
								in2='effect3_innerShadow_bar3d'
								result='effect4_innerShadow_bar3d'
							/>
						</filter>
						<filter
							id={`filter_bar_shadow3d_bottom_${id}`}
							x='38.3998'
							y='764.1'
							width='59.8'
							height='225.4'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-4' dy='3' />
							<feGaussianBlur stdDeviation='5' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_bar3d'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='4' dy='-2' />
							<feGaussianBlur stdDeviation='3.5' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_bar3d'
								result='effect2_dropShadow_bar3d'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_bar3d'
								result='shape'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='3' dy='3' />
							<feGaussianBlur stdDeviation='1.5' />
							<feComposite
								in2='hardAlpha'
								operator='arithmetic'
								k2='-1'
								k3='1'
							/>
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0'
							/>
							<feBlend
								mode='normal'
								in2='shape'
								result='effect3_innerShadow_bar3d'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-3' dy='-3' />
							<feGaussianBlur stdDeviation='1.5' />
							<feComposite
								in2='hardAlpha'
								operator='arithmetic'
								k2='-1'
								k3='1'
							/>
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0'
							/>
							<feBlend
								mode='normal'
								in2='effect3_innerShadow_bar3d'
								result='effect4_innerShadow_bar3d'
							/>
						</filter>
						<filter
							id={`filter5_d_142_3_${id}`}
							x='46.3998'
							y='696.833'
							width='43.8'
							height='256.535'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='2' dy='1' />
							<feGaussianBlur stdDeviation='4.95' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.96 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_142_3'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_142_3'
								result='shape'
							/>
						</filter>
						{isRightAligned && (
							<>
								<filter
									id={`filter1_d_142_3_${id}_right`}
									x='42.5598'
									y='61.33'
									width='565.54'
									height='894.54'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-0.97' dy='9' />
									<feGaussianBlur stdDeviation='11.385' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.97 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_192_17'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect1_dropShadow_192_17'
										result='shape'
									/>
								</filter>
								<filter
									id={`filter2_d_142_3_${id}_right`}
									x='38.1998'
									y='42'
									width='568.2'
									height='897.2'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-4' dy='-9' />
									<feGaussianBlur stdDeviation='12.05' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.97 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_192_17'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect1_dropShadow_192_17'
										result='shape'
									/>
								</filter>
								<filter
									id={`filter3_d_142_3_${id}`}
									x='60.0998'
									y='414.9'
									width='532.4'
									height='160.8'
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
									<feGaussianBlur stdDeviation='2.8' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_192_17'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dy='-3' />
									<feGaussianBlur stdDeviation='3.1' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
									/>
									<feBlend
										mode='normal'
										in2='effect1_dropShadow_192_17'
										result='effect2_dropShadow_192_17'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect2_dropShadow_192_17'
										result='shape'
									/>
								</filter>
								<filter
									id={`filter4_i_142_3_${id}`}
									x='574.3'
									y='24.1'
									width='24'
									height='32.6326'
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
									<feOffset dy='2' />
									<feGaussianBlur stdDeviation='0.45' />
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
										result='effect1_innerShadow_192_17'
									/>
								</filter>
								<filter
									id={`filter_bar_shadow3d_top_${id}_right`}
									x='556.4'
									y='15.1'
									width='59.8'
									height='225.4'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-4' dy='3' />
									<feGaussianBlur stdDeviation='5' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_bar3d'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='4' dy='-2' />
									<feGaussianBlur stdDeviation='3.5' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
									/>
									<feBlend
										mode='normal'
										in2='effect1_dropShadow_bar3d'
										result='effect2_dropShadow_bar3d'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect2_dropShadow_bar3d'
										result='shape'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='3' dy='3' />
									<feGaussianBlur stdDeviation='1.5' />
									<feComposite
										in2='hardAlpha'
										operator='arithmetic'
										k2='-1'
										k3='1'
									/>
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0'
									/>
									<feBlend
										mode='normal'
										in2='shape'
										result='effect3_innerShadow_bar3d'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-3' dy='-3' />
									<feGaussianBlur stdDeviation='1.5' />
									<feComposite
										in2='hardAlpha'
										operator='arithmetic'
										k2='-1'
										k3='1'
									/>
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0'
									/>
									<feBlend
										mode='normal'
										in2='effect3_innerShadow_bar3d'
										result='effect4_innerShadow_bar3d'
									/>
								</filter>
								<filter
									id={`filter_bar_shadow3d_bottom_${id}_right`}
									x='556.4'
									y='764.1'
									width='59.8'
									height='225.4'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-4' dy='3' />
									<feGaussianBlur stdDeviation='5' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_bar3d'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='4' dy='-2' />
									<feGaussianBlur stdDeviation='3.5' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
									/>
									<feBlend
										mode='normal'
										in2='effect1_dropShadow_bar3d'
										result='effect2_dropShadow_bar3d'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect2_dropShadow_bar3d'
										result='shape'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='3' dy='3' />
									<feGaussianBlur stdDeviation='1.5' />
									<feComposite
										in2='hardAlpha'
										operator='arithmetic'
										k2='-1'
										k3='1'
									/>
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0.996078 0 0 0 0 0.466667 0 0 0 0 0.00784314 0 0 0 0.4 0'
									/>
									<feBlend
										mode='normal'
										in2='shape'
										result='effect3_innerShadow_bar3d'
									/>
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-3' dy='-3' />
									<feGaussianBlur stdDeviation='1.5' />
									<feComposite
										in2='hardAlpha'
										operator='arithmetic'
										k2='-1'
										k3='1'
									/>
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0.572549 0 0 0 0 0.278431 0 0 0 0 0.0196078 0 0 0 0.4 0'
									/>
									<feBlend
										mode='normal'
										in2='effect3_innerShadow_bar3d'
										result='effect4_innerShadow_bar3d'
									/>
								</filter>
								<filter
									id={`filter5_dd_142_3_${id}`}
									x='562.4'
									y='45.8586'
									width='43.8'
									height='256.535'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-2' dy='1' />
									<feGaussianBlur stdDeviation='4.95' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.96 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_192_17'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect1_dropShadow_192_17'
										result='shape'
									/>
								</filter>
								<filter
									id={`filter6_d_142_3_${id}`}
									x='562.4'
									y='696.833'
									width='43.8'
									height='256.535'
									filterUnits='userSpaceOnUse'
									colorInterpolationFilters='sRGB'>
									<feFlood floodOpacity='0' result='BackgroundImageFix' />
									<feColorMatrix
										in='SourceAlpha'
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
										result='hardAlpha'
									/>
									<feOffset dx='-2' dy='1' />
									<feGaussianBlur stdDeviation='4.95' />
									<feComposite in2='hardAlpha' operator='out' />
									<feColorMatrix
										type='matrix'
										values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.96 0'
									/>
									<feBlend
										mode='normal'
										in2='BackgroundImageFix'
										result='effect1_dropShadow_192_17'
									/>
									<feBlend
										mode='normal'
										in='SourceGraphic'
										in2='effect1_dropShadow_192_17'
										result='shape'
									/>
								</filter>
								<filter
									id={`filter7_i_142_3_${id}`}
									x='574.3'
									y='941.467'
									width='24'
									height='32.6326'
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
									<feOffset dy='-2' />
									<feGaussianBlur stdDeviation='0.5' />
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
										result='effect1_innerShadow_192_17'
									/>
								</filter>
							</>
						)}
						<linearGradient
							id={`paint0_linear_142_3_${id}`}
							x1='5.17419'
							y1='205.912'
							x2='1240.47'
							y2='466.625'
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
