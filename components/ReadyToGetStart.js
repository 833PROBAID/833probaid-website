"use client";

import Link from "next/link";
import AnimatedText from "./AnimatedText";
import { useRouter } from "next/navigation";

const ReadyToGetStart = () => {
	const router = useRouter();
	return (
		<div className='w-full'>
			<div className='bg-secondary  hidden md:grid rounded-xl grid-cols-1 gap-1 p-4 shadow-[0px_12px_20px_0px_rgba(0,0,0,0.2),0px_-12px_20px_0px_rgba(0,0,0,0.2)] justify-center items-center sm:gap-6 sm:p-6 sm:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.4),0px_-12px_20px_0px_rgba(0,0,0,0.4)] md:grid-cols-6 md:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.6),0px_-12px_20px_0px_rgba(0,0,0,0.6)] lg:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.75),0px_-12px_20px_0px_rgba(0,0,0,0.75)] xl:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.9),0px_-12px_20px_0px_rgba(0,0,0,0.9)] -mx-3'>
				<div className='relative h-[350px] sm:h-[450px] md:h-full w-full flex md:col-span-4 ml-2'>
					{/* <div className='relative h-[290px] sm:h-[370px] w-full md:h-[300px] lg:h-[412px] xl:h-[520px] 2xl:h-[630px] md:col-span-4 '>
					<svg
						className='absolute inset-0 h-full w-full' */}
					<svg
						className='absolute inset-0 h-full w-full'
						viewBox='0 0 1130 674'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						preserveAspectRatio='xMidYMid meet'>
						<g filter='url(#filter0_ddii_167_4)'>
							<path
								d='M17.8999 29.2998C17.8999 21.5678 24.1679 15.2998 31.8999 15.2998H1097.9C1105.63 15.2998 1111.9 21.5678 1111.9 29.2998V639.3C1111.9 647.032 1105.63 653.3 1097.9 653.3H31.8999C24.1679 653.3 17.8999 647.032 17.8999 639.3V29.2998Z'
								fill='url(#paint0_linear_167_4)'
							/>
							<path
								d='M31.8999 15.7998H1097.9C1105.36 15.7998 1111.4 21.844 1111.4 29.2998V639.3C1111.4 646.756 1105.36 652.8 1097.9 652.8H31.8999C24.4441 652.8 18.3999 646.756 18.3999 639.3V29.2998C18.3999 21.844 24.4441 15.7998 31.8999 15.7998Z'
								stroke='#838383'
							/>
						</g>
						<g filter='url(#filter1_d_167_4)'>
							<rect
								x='67.8999'
								y='66.2998'
								width='994'
								height='534'
								rx='15'
								fill='white'
							/>
						</g>
						<g filter='url(#filter2_d_167_4)'>
							<rect
								x='67.8999'
								y='66.2998'
								width='994'
								height='536'
								rx='15'
								fill='white'
							/>
						</g>
						<g filter='url(#filter3_d_167_4)'>
							<path
								d='M17.8999 31.2998C17.8999 22.4632 25.0633 15.2998 33.8999 15.2998H174.9L94.8999 92.2998L17.8999 172.3V31.2998Z'
								fill='#0097A7'
							/>
						</g>
						<g filter='url(#filter4_d_167_4)'>
							<path
								d='M67.8999 111.414C67.8999 84.8906 90.4301 63.9534 116.882 65.8948L122.4 66.2998L89.8999 97.2998L67.8999 120.3V111.414Z'
								fill='#0097A7'
							/>
						</g>
						<style>{`
						.rtgs-btn1-float {
							animation: rtgsFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn1 {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn1-float:hover .rtgs-btn1 {
							transform: rotate(-2deg) scale(1.1);
						}
						.rtgs-btn2-float {
							animation: rtgsFloat 2.5s ease-in-out infinite;
							animation-delay: 0.3s;
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn2 {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn2-float:hover .rtgs-btn2 {
							transform: rotate(2deg) scale(1.1);
						}
						@keyframes rtgsFloat {
							0%, 100% { transform: translateY(0px); }
							50% { transform: translateY(-8px); }
						}
					`}</style>
						<foreignObject x='90' y='60' width='930' height='460'>
							<div
								xmlns='http://www.w3.org/1999/xhtml'
								className='flex h-full flex-col items-center justify-center px-3 font-montserrat font-bold'>
								<h2
									className='font-anton text-center text-5xl'
									style={{ color: "#EF6C00" }}>
									<AnimatedText
										text='COMMAND THE OUTCOME : CALL (833) PROBAID'
										animate={true}
									/>
								</h2>
								<h2
									className='font-anton mt-6 text-center text-5xl'
									style={{ color: "#0097A7" }}>
									<AnimatedText
										text='Stop Guessing. Start Executing.'
										animate={true}
									/>
								</h2>
								<p className='my-6 text-center text-2xl'>
									<AnimatedText text='Court-supervised real estate requires a high standard of precision, compliance, and specialized expertise. Stop navigating probate, conservatorship, or trust property sales through uncertainty.' />
									<br />
									Call{" "}
									<strong style={{ color: "#0097A7" }}>
										<AnimatedText text='(833) PROBAID — (833) 776-2243 — NOW ' />
									</strong>{" "}
									<AnimatedText text='or' />{" "}
									<strong style={{ color: "#EF6C00" }}>
										<AnimatedText text='fill out the' />
									</strong>{" "}
									<Link
										href='/homebooks/833probaid-referral-intake'
										style={{
											color: "#0097A7",
											textDecoration: "underline",
										}}>
										<strong>
											<AnimatedText text='FORM' />
										</strong>
									</Link>{" "}
									<AnimatedText text=' for a Strategic Consultation. We eliminate the red tape, protect the estate’s equity, and manage the transaction to a clean, court-approved closing.' />
								</p>
							</div>
						</foreignObject>
						<g className='rtgs-btn1-float'>
							<image
								href='/btn1.svg'
								xlinkHref='/btn1.svg'
								x='300'
								y='497'
								width='250'
								height='75'
								preserveAspectRatio='xMidYMid meet'
								className='rtgs-btn1'
								style={{ cursor: "pointer" }}
								onClick={() => {
									router.push("/homebooks/contact-us");
								}}
							/>
						</g>
						<g className='rtgs-btn2-float'>
							<image
								href='/btn2.svg'
								xlinkHref='/btn2.svg'
								x='580'
								y='497'
								width='250'
								height='75'
								preserveAspectRatio='xMidYMid meet'
								className='rtgs-btn2'
								style={{ cursor: "pointer" }}
								onClick={() => {
									router.push("/homebooks/833probaid-referral-intake");
								}}
							/>
						</g>
						<defs>
							<filter
								id='filter0_ddii_167_4'
								x='-9.72748e-05'
								y='-0.000195503'
								width='1129.2'
								height='673.2'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-7' dy='9' />
								<feGaussianBlur stdDeviation='5.45' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.64 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='7' dy='-5' />
								<feGaussianBlur stdDeviation='5.15' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.64 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_167_4'
									result='effect2_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_167_4'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='11' dy='10' />
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
									result='effect3_innerShadow_167_4'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-13' dy='-12' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0.537222 0 0 0 0 0.537222 0 0 0 0 0.537222 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect3_innerShadow_167_4'
									result='effect4_innerShadow_167_4'
								/>
							</filter>
							<filter
								id='filter1_d_167_4'
								x='51.4068'
								y='57.0678'
								width='1031.14'
								height='571.135'
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
									radius='4.1492'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_167_4'
								/>
								<feOffset dx='2.0746' dy='9.33569' />
								<feGaussianBlur stdDeviation='7.20923' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter2_d_167_4'
								x='51.4814'
								y='42.8813'
								width='1026.84'
								height='568.837'
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
									radius='2'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_167_4'
								/>
								<feOffset dy='-7' />
								<feGaussianBlur stdDeviation='7.20923' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter3_d_167_4'
								x='8.4599'
								y='12.0798'
								width='175.88'
								height='175.88'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='6.22' />
								<feGaussianBlur stdDeviation='4.72' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.73 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter4_d_167_4'
								x='56.4999'
								y='57.3695'
								width='75.3'
								height='75.3303'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1' dy='2' />
								<feGaussianBlur stdDeviation='5.2' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.67 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_167_4'
								x1='27.0356'
								y1='39.9306'
								x2='1187.18'
								y2='314.813'
								gradientUnits='userSpaceOnUse'>
								<stop stopColor='white' />
								<stop offset='0.485672' stopColor='#E3E3E3' />
								<stop offset='1' stopColor='#E5E5E5' />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<div className='w-[97%] h-full md:col-span-2 hidden md:flex'>
					<img
						src='/images/qr-scan.svg'
						className='w-full h-auto transition-transform duration-500 ease-out hover:scale-105 cursor-pointer'
						alt='qr-scan'
					/>
				</div>
			</div>{" "}
			<div className='bg-secondary block md:hidden rounded-xl md:rounded-none p-4 shadow-[0px_12px_20px_0px_rgba(0,0,0,0.2),0px_-12px_20px_0px_rgba(0,0,0,0.2)] sm:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.4),0px_-12px_20px_0px_rgba(0,0,0,0.4)] md:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.6),0px_-12px_20px_0px_rgba(0,0,0,0.6)] lg:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.75),0px_-12px_20px_0px_rgba(0,0,0,0.75)] xl:shadow-[0px_12px_20px_0px_rgba(0,0,0,0.9),0px_-12px_20px_0px_rgba(0,0,0,0.9)]'>
				<div className='relative aspect-[1130/674] md:h-full w-full flex md:col-span-4'>
					<svg
						className='absolute inset-0 h-full w-full'
						viewBox='0 0 1130 674'
						fill='white'
						xmlns='http://www.w3.org/2000/svg'
						preserveAspectRatio='xMidYMid meet'>
						<g filter='url(#filter0_ddii_167_4)'>
							<path
								d='M17.8999 29.2998C17.8999 21.5678 24.1679 15.2998 31.8999 15.2998H1097.9C1105.63 15.2998 1111.9 21.5678 1111.9 29.2998V639.3C1111.9 647.032 1105.63 653.3 1097.9 653.3H31.8999C24.1679 653.3 17.8999 647.032 17.8999 639.3V29.2998Z'
								fill='url(#paint0_linear_167_4)'
							/>
							<path
								d='M31.8999 15.7998H1097.9C1105.36 15.7998 1111.4 21.844 1111.4 29.2998V639.3C1111.4 646.756 1105.36 652.8 1097.9 652.8H31.8999C24.4441 652.8 18.3999 646.756 18.3999 639.3V29.2998C18.3999 21.844 24.4441 15.7998 31.8999 15.7998Z'
								stroke='#838383'
							/>
						</g>
						<g filter='url(#filter1_d_167_4)'>
							<rect
								x='67.8999'
								y='66.2998'
								width='994'
								height='534'
								rx='15'
								fill='white'
							/>
						</g>
						<g filter='url(#filter2_d_167_4)'>
							<rect
								x='67.8999'
								y='66.2998'
								width='994'
								height='536'
								rx='15'
								fill='white'
							/>
						</g>
						<g filter='url(#filter3_d_167_4)'>
							<path
								d='M17.8999 31.2998C17.8999 22.4632 25.0633 15.2998 33.8999 15.2998H174.9L94.8999 92.2998L17.8999 172.3V31.2998Z'
								fill='#0097A7'
							/>
						</g>
						<g filter='url(#filter4_d_167_4)'>
							<path
								d='M67.8999 111.414C67.8999 84.8906 90.4301 63.9534 116.882 65.8948L122.4 66.2998L89.8999 97.2998L67.8999 120.3V111.414Z'
								fill='#0097A7'
							/>
						</g>
						<style>{`
						.rtgs-btn1-float {
							animation: rtgsFloat 2.5s ease-in-out infinite;
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn1 {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn1-float:hover .rtgs-btn1 {
							transform: rotate(-2deg) scale(1.1);
						}
						.rtgs-btn2-float {
							animation: rtgsFloat 2.5s ease-in-out infinite;
							animation-delay: 0.3s;
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn2 {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
							transform-box: fill-box;
							transform-origin: center center;
						}
						.rtgs-btn2-float:hover .rtgs-btn2 {
							transform: rotate(2deg) scale(1.1);
						}
						@keyframes rtgsFloat {
							0%, 100% { transform: translateY(0px); }
							50% { transform: translateY(-8px); }
						}
					`}</style>
						<foreignObject x='90' y='60' width='930' height='460'>
							<div
								xmlns='http://www.w3.org/1999/xhtml'
								className='flex h-full flex-col items-center justify-center px-3 font-montserrat font-bold'>
								<h2
									className='font-anton text-center text-5xl'
									style={{ color: "#EF6C00" }}>
									<AnimatedText
										text='COMMAND THE OUTCOME : CALL (833) PROBAID'
										animate={true}
									/>
								</h2>
								<h2
									className='font-anton mt-6 text-center text-5xl'
									style={{ color: "#0097A7" }}>
									<AnimatedText
										text='Stop Guessing. Start Executing.'
										animate={true}
									/>
								</h2>
								<p className='my-6 text-center text-2xl'>
									<AnimatedText text='Court-supervised real estate requires a high standard of precision, compliance, and specialized expertise. Stop navigating probate, conservatorship, or trust property sales through uncertainty.' />
									<br />
									Call{" "}
									<strong style={{ color: "#0097A7" }}>
										<AnimatedText text='(833) PROBAID — (833) 776-2243 — NOW ' />
									</strong>{" "}
									<AnimatedText text='or' />{" "}
									<strong style={{ color: "#EF6C00" }}>
										<AnimatedText text='fill out the' />
									</strong>{" "}
									<Link
										href='/homebooks/833probaid-referral-intake'
										style={{
											color: "#0097A7",
											textDecoration: "underline",
										}}>
										<strong>
											<AnimatedText text='FORM' />
										</strong>
									</Link>{" "}
									<AnimatedText text=' for a Strategic Consultation. We eliminate the red tape, protect the estate’s equity, and manage the transaction to a clean, court-approved closing.' />
								</p>
							</div>
						</foreignObject>
						<g className='rtgs-btn1-float'>
							<image
								href='/btn1.svg'
								xlinkHref='/btn1.svg'
								x='300'
								y='497'
								width='250'
								height='75'
								preserveAspectRatio='xMidYMid meet'
								className='rtgs-btn1'
								style={{ cursor: "pointer" }}
								onClick={() => {
									router.push("/homebooks/contact-us");
								}}
							/>
						</g>
						<g className='rtgs-btn2-float'>
							<image
								href='/btn2.svg'
								xlinkHref='/btn2.svg'
								x='580'
								y='497'
								width='250'
								height='75'
								preserveAspectRatio='xMidYMid meet'
								className='rtgs-btn2'
								style={{ cursor: "pointer" }}
								onClick={() => {
									router.push("/homebooks/833probaid-referral-intake");
								}}
							/>
						</g>
						<defs>
							<filter
								id='filter0_ddii_167_4'
								x='-9.72748e-05'
								y='-0.000195503'
								width='1129.2'
								height='673.2'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-7' dy='9' />
								<feGaussianBlur stdDeviation='5.45' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.64 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='7' dy='-5' />
								<feGaussianBlur stdDeviation='5.15' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.64 0'
								/>
								<feBlend
									mode='normal'
									in2='effect1_dropShadow_167_4'
									result='effect2_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect2_dropShadow_167_4'
									result='shape'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='11' dy='10' />
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
									result='effect3_innerShadow_167_4'
								/>
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-13' dy='-12' />
								<feGaussianBlur stdDeviation='2' />
								<feComposite
									in2='hardAlpha'
									operator='arithmetic'
									k2='-1'
									k3='1'
								/>
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0.537222 0 0 0 0 0.537222 0 0 0 0 0.537222 0 0 0 0.25 0'
								/>
								<feBlend
									mode='normal'
									in2='effect3_innerShadow_167_4'
									result='effect4_innerShadow_167_4'
								/>
							</filter>
							<filter
								id='filter1_d_167_4'
								x='51.4068'
								y='57.0678'
								width='1031.14'
								height='571.135'
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
									radius='4.1492'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_167_4'
								/>
								<feOffset dx='2.0746' dy='9.33569' />
								<feGaussianBlur stdDeviation='7.20923' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter2_d_167_4'
								x='51.4814'
								y='42.8813'
								width='1026.84'
								height='568.837'
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
									radius='2'
									operator='dilate'
									in='SourceAlpha'
									result='effect1_dropShadow_167_4'
								/>
								<feOffset dy='-7' />
								<feGaussianBlur stdDeviation='7.20923' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter3_d_167_4'
								x='8.4599'
								y='12.0798'
								width='175.88'
								height='175.88'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dy='6.22' />
								<feGaussianBlur stdDeviation='4.72' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.73 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<filter
								id='filter4_d_167_4'
								x='56.4999'
								y='57.3695'
								width='75.3'
								height='75.3303'
								filterUnits='userSpaceOnUse'
								colorInterpolationFilters='sRGB'>
								<feFlood floodOpacity='0' result='BackgroundImageFix' />
								<feColorMatrix
									in='SourceAlpha'
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
									result='hardAlpha'
								/>
								<feOffset dx='-1' dy='2' />
								<feGaussianBlur stdDeviation='5.2' />
								<feComposite in2='hardAlpha' operator='out' />
								<feColorMatrix
									type='matrix'
									values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.67 0'
								/>
								<feBlend
									mode='normal'
									in2='BackgroundImageFix'
									result='effect1_dropShadow_167_4'
								/>
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='effect1_dropShadow_167_4'
									result='shape'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_167_4'
								x1='27.0356'
								y1='39.9306'
								x2='1187.18'
								y2='314.813'
								gradientUnits='userSpaceOnUse'>
								<stop stopColor='white' />
								<stop offset='0.485672' stopColor='#E3E3E3' />
								<stop offset='1' stopColor='#E5E5E5' />
							</linearGradient>
						</defs>
					</svg>
				</div>
			</div>
			<div className='mt-8 md:hidden'>
				<div
					className={`rounded-xl bg-secondary p-7 shadow-[-1.06px_1.78px_12.43px_4px_rgba(0,0,0,0.64)] `}>
					<div className='rounded-xl bg-white p-4 shadow-[-1.06px_1.78px_12.43px_4px_rgba(0,0,0,0.64)]'>
						<img
							src='/svgs/qr-phone.svg'
							className='w-full h-auto transition-transform duration-500 ease-out hover:scale-105 cursor-pointer'
							alt='qr-scan'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReadyToGetStart;
