"use client";

import { useRouter } from "next/navigation";
import AnimatedText from "./AnimatedText";

export default function ToolsCard({ id, icon, title, description, href }) {
	const router = useRouter();

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
		<div className='flex w-full justify-center group tc-card-wrapper'>
			<div className='w-full'>
				<svg
					width='100%'
					height='100%'
					viewBox='0 0 397 497'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='h-auto w-full'>
					<style>{`
						.tc-icon-float {
							animation: tcFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
							transform-origin: center center;
							overflow: visible;
						}
						.tc-icon-wrapper {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
							overflow: visible;
						}
						.tc-card-wrapper:hover .tc-icon-wrapper,
						.tc-card-wrapper:has(.tc-button-float:hover) .tc-icon-wrapper {
							transform: rotate(12deg) scale(1.1);
						}
						.tc-button-float {
							animation: tcFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
							transform-origin: center center;
							outline: none;
						}
						.tc-button-wrapper {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.tc-button-float:hover .tc-button-wrapper {
							transform: rotate(-2deg) scale(1.08);
						}
						@media (max-width: 767px) {
							.tc-card-wrapper:hover .tc-icon-wrapper,
							.tc-card-wrapper:has(.tc-button-float:hover) .tc-icon-wrapper {
								transform: none !important;
							}
							.tc-button-float:hover .tc-button-wrapper {
								transform: none !important;
							}
						}
						@keyframes tcFloat {
							0%, 100% { transform: translateY(0px); }
							50% { transform: translateY(-8px); }
						}
						.tc-title-text {
							font-family: "Montserrat", sans-serif;
							font-size: 20px;
							font-weight: 700;
							color: white;
							text-transform: uppercase;
							line-height: 1.2;
							padding: 0 5px;
							text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0px 4px 8px rgba(0,0,0,0.3);
							letter-spacing: 0.5px;
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
						.tc-desc-text {
							font-family: "Montserrat", sans-serif;
							font-size: 17px;
							font-weight: 500;
							color: white;
							line-height: 1.4;
							padding: 0 15px;
							text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
					`}</style>
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

					{/* Icon */}
					<g className='tc-icon-float'>
						<image
							href={icon}
							xlinkHref={icon}
							x='150'
							y='37'
							width='90'
							height='90'
							preserveAspectRatio='xMidYMid meet'
							className='tc-icon-wrapper'
							overflow='visible'
						/>
					</g>

					{/* Title */}
					<foreignObject x='60' y='137' width='280' height='80'>
						<div
							xmlns='http://www.w3.org/1999/xhtml'
							className='flex items-center justify-center text-center'>
							<h1 className='tc-title-text'>
								<AnimatedText text={title} />
							</h1>
						</div>
					</foreignObject>

					{/* Description */}
					<foreignObject
						x='50'
						y='195'
						width='295'
						height='150'
						className='overflow-visible'>
						<div
							xmlns='http://www.w3.org/1999/xhtml'
							className='flex items-center justify-center text-center'>
							<p className='tc-desc-text'>
								<AnimatedText text={description} />
							</p>
						</div>
					</foreignObject>

					{/* Button SVG */}
					<g
						className='tc-button-float'
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						role={href ? "button" : undefined}
						tabIndex={href ? 0 : undefined}
						aria-label={href ? `Use ${title}` : undefined}
						style={{ cursor: href ? "pointer" : "default" }}>
						<image
							href='/svgs/use_tool.svg'
							xlinkHref='/svgs/use_tool.svg'
							x='110'
							y='370'
							width='170'
							height='65'
							preserveAspectRatio='xMidYMid meet'
							className='tc-button-wrapper'
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
			</div>
		</div>
	);
}
