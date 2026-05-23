"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedText from "./AnimatedText";

export default function ToolsCard({ id, icon, title, description, href }) {
	const router = useRouter();
	const [isSafariBrowser, setIsSafariBrowser] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const ua = window.navigator.userAgent || "";
		setIsSafariBrowser(/^((?!chrome|android).)*safari/i.test(ua));
	}, []);

	const handleClick = (e) => {
		if (!href) return;
		e.stopPropagation();
		router.push(href);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick(e);
		}
	};

	return (
		<div
			className='flex w-full justify-center group tc-card-wrapper'
			style={{
				// `content-visibility: auto` causes blank-placeholder flicker on
				// Safari/Retina during fast scroll. `contain: paint` gives us the
				// repaint-isolation benefit without the lazy-paint downside.
				contain: "layout paint style",
				isolation: "isolate",
			}}>
			<div
				className='w-full relative'
				style={{ aspectRatio: "397 / 497" }}>
				<svg
					width='100%'
					height='100%'
					viewBox='0 0 397 497'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='absolute inset-0 h-full w-full pointer-events-none'
					aria-hidden='true'
					style={
						isSafariBrowser
							? {
									transform: "translateZ(0)",
									WebkitTransform: "translateZ(0)",
									backfaceVisibility: "hidden",
									WebkitBackfaceVisibility: "hidden",
								}
							: undefined
					}>
					<g filter={`url(#filter0_f_147_9_${id})`}>
						<path
							d='M6.08887 6.08887H390.089V477.452C390.089 484.431 384.431 490.089 377.452 490.089H18.7262C11.7468 490.089 6.08887 484.431 6.08887 477.452V6.08887Z'
							fill='black'
						/>
						<path
							d='M389.802 6.37598V477.451C389.802 484.272 384.272 489.802 377.451 489.802H18.7266C11.9058 489.802 6.37598 484.272 6.37598 477.451V6.37598H389.802Z'
							stroke='#005E68'
							strokeWidth='0.574425'
						/>
					</g>
					<g filter={`url(#filter1_dii_147_9_${id})`}>
						<rect
							x='10.0889'
							y='9.08887'
							width='376'
							height='477'
							rx='12.6374'
							fill='#0097A7'
						/>
						<rect
							x='10.3761'
							y='9.37608'
							width='375.426'
							height='476.426'
							rx='12.3501'
							stroke='#005E68'
							strokeWidth='0.574425'
						/>
					</g>
					<path
						d='M308.089 9.08887H386.089V109.892L308.089 157.089V9.08887Z'
						fill='#FE7702'
					/>
					<path
						d='M90.0889 9.08887H10.0889V109.892L90.0889 157.089V9.08887Z'
						fill='#FE7702'
					/>
					<g filter={`url(#filter2_dd_147_9_${id})`}>
						<path
							d='M52.0889 73.9124L90.0901 9.08887H308.863L344.734 74.4712L345.089 383.207L308.863 439.089H90.1678L52.0889 386.001V73.9124Z'
							fill='#0097A7'
						/>
					</g>

					<defs>
						<filter
							id={`filter0_f_147_9_${id}`}
							x='-4.29153e-05'
							y='-4.29153e-05'
							width='396.178'
							height='496.178'
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
								stdDeviation='3.04446'
								result='effect1_foregroundBlur_147_9'
							/>
						</filter>
						<filter
							id={`filter1_dii_147_9_${id}`}
							x='1.70226'
							y='1.27668'
							width='392.773'
							height='493.773'
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
								radius='2.2977'
								operator='dilate'
								in='SourceAlpha'
								result='effect1_dropShadow_147_9'
							/>
							<feOffset dy='0.574425' />
							<feGaussianBlur stdDeviation='3.04446' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.83 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_9'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect1_dropShadow_147_9'
								result='shape'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='2.87213' dy='-2.87213' />
							<feGaussianBlur stdDeviation='1.83816' />
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
								result='effect2_innerShadow_147_9'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-0.574425' dy='3.44655' />
							<feGaussianBlur stdDeviation='1.14885' />
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
								in2='effect2_innerShadow_147_9'
								result='effect3_innerShadow_147_9'
							/>
						</filter>
						<filter
							id={`filter2_dd_147_9_${id}`}
							x='32.1584'
							y='2.51146'
							width='332.859'
							height='459.319'
							filterUnits='userSpaceOnUse'
							colorInterpolationFilters='sRGB'>
							<feFlood floodOpacity='0' result='BackgroundImageFix' />
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='-7.02715' dy='9.838' />
							<feGaussianBlur stdDeviation='6.45165' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0'
							/>
							<feBlend
								mode='normal'
								in2='BackgroundImageFix'
								result='effect1_dropShadow_147_9'
							/>
							<feColorMatrix
								in='SourceAlpha'
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
								result='hardAlpha'
							/>
							<feOffset dx='7.02715' dy='6.32443' />
							<feGaussianBlur stdDeviation='6.45092' />
							<feComposite in2='hardAlpha' operator='out' />
							<feColorMatrix
								type='matrix'
								values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0'
							/>
							<feBlend
								mode='normal'
								in2='effect1_dropShadow_147_9'
								result='effect2_dropShadow_147_9'
							/>
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='effect2_dropShadow_147_9'
								result='shape'
							/>
						</filter>
					</defs>
				</svg>

				{/* Icon overlay */}
				<div
					className='tc-icon-float absolute'
					style={{ top: "7.45%", left: "37.78%", width: "22.67%" }}>
					<img
						src={icon}
						alt=''
						className='tc-icon-wrapper block w-full h-auto'
					/>
				</div>

				{/* Title overlay */}
				<div
					className='absolute flex items-center justify-center text-center'
					style={{
						top: "27.57%",
						left: "15.11%",
						width: "70.53%",
						height: "16.10%",
					}}>
					<h1 className='tc-title-text'>
						<AnimatedText text={title} />
					</h1>
				</div>

				{/* Description overlay */}
				<div
					className='absolute flex items-center justify-center text-center'
					style={{
						top: "39.24%",
						left: "12.59%",
						width: "74.31%",
						height: "30.18%",
					}}>
					<p className='tc-desc-text'>
						<AnimatedText text={description} />
					</p>
				</div>

				{/* Button overlay */}
				<div
					className='tc-button-float absolute'
					style={{
						top: "74.45%",
						left: "27.71%",
						width: "42.82%",
						cursor: href ? "pointer" : "default",
					}}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					role={href ? "button" : undefined}
					tabIndex={href ? 0 : undefined}
					aria-label={href ? `Use ${title}` : undefined}>
					<img
						src='/svgs/use_tool.svg'
						alt=''
						className='tc-button-wrapper block w-full h-auto'
					/>
				</div>
			</div>
		</div>
	);
}