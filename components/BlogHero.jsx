export default function BlogHero({
	bannerImage,
	title,
	authorName,
	authorAvatar,
	wrapperStyle = {},
	isCard = false,
}) {
	return (
		<div
			className='w-full aspect-[1670/1300] sm:aspect-[1670/1098]'
			style={{
				position: "relative",
				containerType: "inline-size",
				...wrapperStyle,
			}}>
			{/* SVG background — shapes only, stretched to fit the 30%-shorter container */}
			<svg
				width='100%'
				height='100%'
				viewBox='0 0 1670 1568'
				preserveAspectRatio='none'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				style={{ position: "absolute", inset: 0 }}>
				<g>
					<rect
						x='24.9666'
						y='24.9663'
						width='1621'
						height='1494'
						rx='18.1531'
						fill='#0097A7'
					/>
				</g>
				<g filter='url(#filter1_ddd_209_2_hero)'>
					<path
						d='M74.9666 88.5056C74.9666 81.0281 81.0283 74.9663 88.5059 74.9663H1582.43C1589.9 74.9663 1595.97 81.0281 1595.97 88.5056V1230.14C1595.97 1233.56 1594.67 1236.86 1592.33 1239.37L1382.48 1464.66C1379.92 1467.4 1376.33 1468.97 1372.57 1468.97H88.5059C81.0283 1468.97 74.9666 1462.9 74.9666 1455.43V88.5056Z'
						fill='white'
					/>
				</g>
				<g filter='url(#filter2_dd_209_2_hero)'>
					<rect
						x='157.967'
						y='130.966'
						width='1355'
						height='918'
						rx='13.4076'
						fill='white'
						shapeRendering='crispEdges'
					/>
					<rect
						x='161.967'
						y='134.966'
						width='1347'
						height='910'
						rx='9.40764'
						stroke='#FE7702'
						strokeWidth='8'
						shapeRendering='crispEdges'
					/>
				</g>
				<defs>
					<filter
						id='filter1_ddd_209_2_hero'
						x='54.9666'
						y='54.9663'
						width='1561'
						height='1437'
						filterUnits='userSpaceOnUse'
						colorInterpolationFilters='sRGB'>
						<feFlood floodOpacity='0' result='BackgroundImageFix' />
						<feColorMatrix
							in='SourceAlpha'
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
							result='hardAlpha'
						/>
						<feOffset dx='5' dy='-8' />
						<feGaussianBlur stdDeviation='6' />
						<feComposite in2='hardAlpha' operator='out' />
						<feColorMatrix
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
						/>
						<feBlend
							mode='normal'
							in2='BackgroundImageFix'
							result='effect1_dropShadow_209_2'
						/>
						<feColorMatrix
							in='SourceAlpha'
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
							result='hardAlpha'
						/>
						<feOffset dx='8' dy='7' />
						<feGaussianBlur stdDeviation='6' />
						<feComposite in2='hardAlpha' operator='out' />
						<feColorMatrix
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0'
						/>
						<feBlend
							mode='normal'
							in2='effect1_dropShadow_209_2'
							result='effect2_dropShadow_209_2'
						/>
						<feColorMatrix
							in='SourceAlpha'
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
							result='hardAlpha'
						/>
						<feOffset dx='-8' dy='11' />
						<feGaussianBlur stdDeviation='6' />
						<feComposite in2='hardAlpha' operator='out' />
						<feColorMatrix
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'
						/>
						<feBlend
							mode='normal'
							in2='effect2_dropShadow_209_2'
							result='effect3_dropShadow_209_2'
						/>
						<feBlend
							mode='normal'
							in='SourceGraphic'
							in2='effect3_dropShadow_209_2'
							result='shape'
						/>
					</filter>
					<filter
						id='filter2_dd_209_2_hero'
						x='139.967'
						y='113.766'
						width='1388.2'
						height='954.2'
						filterUnits='userSpaceOnUse'
						colorInterpolationFilters='sRGB'>
						<feFlood floodOpacity='0' result='BackgroundImageFix' />
						<feColorMatrix
							in='SourceAlpha'
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
							result='hardAlpha'
						/>
						<feOffset dx='-6' dy='7' />
						<feGaussianBlur stdDeviation='6' />
						<feComposite in2='hardAlpha' operator='out' />
						<feColorMatrix
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0'
						/>
						<feBlend
							mode='normal'
							in2='BackgroundImageFix'
							result='effect1_dropShadow_209_2'
						/>
						<feColorMatrix
							in='SourceAlpha'
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
							result='hardAlpha'
						/>
						<feOffset dx='3' dy='-5' />
						<feGaussianBlur stdDeviation='6.1' />
						<feComposite in2='hardAlpha' operator='out' />
						<feColorMatrix
							type='matrix'
							values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.59 0'
						/>
						<feBlend
							mode='normal'
							in2='effect1_dropShadow_209_2'
							result='effect2_dropShadow_209_2'
						/>
						<feBlend
							mode='normal'
							in='SourceGraphic'
							in2='effect2_dropShadow_209_2'
							result='shape'
						/>
					</filter>
				</defs>
			</svg>

			{/* Banner Image — absolute HTML, aligned to SVG image frame % positions */}
			<div
				style={{
					position: "absolute",
					left: "9.46%" /* 157.967/1670 */,
					top: "8.35%" /* 130.966/1098 (adjusted for 70% height) */,
					width: "81.14%" /* 1355/1670 */,
					height:
						"58.29%" /* 918/1568 * (1568/1098) normalised to new height */,
					borderRadius: "13.4076px",
					overflow: "hidden",
					border: "4px solid #FE7702",
				}}>
				<img
					src={bannerImage}
					alt='Blog banner'
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>

			{/* Title */}
			<div
				style={{
					position: "absolute",
					left: "6.59%" /* 110/1670 */,
					top: "68.5%" /* 1080/1568 * (1568/1098) */,
					width: "81.14%",
					padding: "0 3%",
				}}>
				{!isCard ? (
					<h2
						className='font-anton text-primary leading-tight'
						style={{ fontSize: "clamp(0.6rem, 2.8cqw, 2.8rem)" }}>
						{title}
					</h2>
				) : (
					<h2
						className='font-anton text-primary leading-tight'
						style={{ fontSize: "clamp(0.9rem, 4.5cqw, 4rem)" }}>
						{title}
					</h2>
				)}
			</div>

			{/* Author */}
			<div
				style={{
					position: "absolute",
					left: "6.59%",
					top: "83%",
					width: "60%",
					display: "flex",
					alignItems: "center",
					gap: "2%",
					padding: "0 3%",
				}}>
				{!isCard ? (
					<>
						<img
							src={authorAvatar}
							alt={authorName}
							className='border-primary border-2'
							style={{
								width: "clamp(20px, 5cqw, 80px)",
								aspectRatio: "1/1",
								borderRadius: "50%",
								objectFit: "cover",
								flexShrink: 0,
								alignSelf: "center",
							}}
						/>
						<span
							className='font-poppins font-semibold'
							style={{
								fontFamily: "Poppins, sans-serif",
								color: "#333",
								fontSize: "clamp(0.5rem, 2cqw, 1.6rem)",
								lineHeight: 1.2,
								alignSelf: "center",
							}}>
							{authorName}
						</span>
					</>
				) : (
					<>
						<img
							src={authorAvatar}
							alt={authorName}
							className='border-primary border-2'
							style={{
								width: "clamp(28px, 7cqw, 90px)",
								aspectRatio: "1/1",
								borderRadius: "50%",
								objectFit: "cover",
								flexShrink: 0,
								alignSelf: "center",
							}}
						/>
						<span
							className='font-poppins font-semibold'
							style={{
								fontFamily: "Poppins, sans-serif",
								color: "#333",
								fontSize: "clamp(0.7rem, 3cqw, 2rem)",
								lineHeight: 1.2,
								alignSelf: "center",
							}}>
							{authorName}
						</span>
					</>
				)}
			</div>
		</div>
	);
}
