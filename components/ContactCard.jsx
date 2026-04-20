import AnimatedText from "./AnimatedText";

export default function ContactCard() {
	return (
		<div className='flex w-full justify-center'>
			<div className='w-full'>
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
					<foreignObject x='85' y='70' width='390' height='370'>
						<div
							xmlns='http://www.w3.org/1999/xhtml'
							className='flex h-full w-full flex-col items-center justify-center overflow-visible px-6'>
							<div className='flex h-75 flex-col'>
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
										style={{ width: "28px" }}
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

								<div className='mb-4 mt-2 flex items-start gap-3'>
									<img
										src='/svgs/location-pin.svg'
										style={{ width: "28px", marginTop: "4px" }}
										alt='Location'
									/>
									<p
										className='font-bold'
										style={{ fontSize: "20px", lineHeight: "1.6" }}>
										311 N. Robertson Blvd #444, Beverly Hills, CA 90211
									</p>
								</div>

								<a
									href='mailto:info@833probaid.com'
									className='mb-4 flex items-center gap-3'>
									<img
										src='/svgs/uiw_mail.svg'
										style={{ width: "28px" }}
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
										style={{ width: "25px" }}
										alt='Website'
									/>
									<p className='ml-0.5 font-bold' style={{ fontSize: "20px" }}>
										www.833probaid.com
									</p>
								</a>
							</div>
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
}
