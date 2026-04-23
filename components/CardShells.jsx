/**
 * CardShells
 * ───────────────────────────────────────────────────────────────────
 * Hidden SVG sprite. Mount this ONCE at the root (see app/layout.jsx),
 * then every HomeCard / HomeCardBig instance references these shared
 * gradients, filters, and clip paths by id — instead of each card
 * defining its own 20+ filter defs.
 *
 * Before:  9 cards × ~20 filter defs  = ~180 filter graphs on the page.
 *          Each card was a full filter graph.
 * After:   ~10 filter defs total, shared by all 9 cards.
 *          Cards become pure shape-rendering with `filter="url(#...)"`
 *          references into this sprite.
 *
 * This is the standard SVG sprite pattern: all browsers (including
 * Safari) resolve `url(#id)` filter/gradient/clipPath references to
 * the first element with that id in the document, even across SVGs.
 * Because `filterUnits="userSpaceOnUse"` resolves coordinates against
 * the element where the filter is applied (not the sprite SVG), the
 * filter regions still work correctly.
 *
 * Visual output is byte-for-byte identical to the old per-card defs
 * — we only dropped duplication.
 * ───────────────────────────────────────────────────────────────────
 */
export default function CardShells() {
	return (
		<svg
			aria-hidden='true'
			focusable='false'
			width='0'
			height='0'
			style={{
				position: "absolute",
				width: 0,
				height: 0,
				overflow: "hidden",
				pointerEvents: "none",
			}}
			xmlns='http://www.w3.org/2000/svg'>
			<defs>
				{/* ─────────────────────────── GRADIENTS ─────────────────────────── */}

				{/* Main teal card gradient (shared by every card, both orientations). */}
				<linearGradient
					id='hc-shell-paint-main'
					x1='5.17419'
					y1='205.912'
					x2='1240.47'
					y2='466.625'
					gradientUnits='userSpaceOnUse'>
					<stop stopColor='#0097A7' />
					<stop offset='1' stopColor='#007B88' />
				</linearGradient>

				{/* Page shadow gradients — direction-specific. */}
				<linearGradient
					id='hc-shell-grad-shadow-left'
					x1='66.2998'
					y1='75.1'
					x2='586.3'
					y2='75.1'
					gradientUnits='userSpaceOnUse'>
					<stop offset='0' stopColor='#000000' stopOpacity='0.15' />
					<stop offset='0.55' stopColor='#000000' stopOpacity='0' />
				</linearGradient>
				<linearGradient
					id='hc-shell-grad-shadow-right'
					x1='586.3'
					y1='75.1'
					x2='66.2998'
					y2='75.1'
					gradientUnits='userSpaceOnUse'>
					<stop offset='0' stopColor='#000000' stopOpacity='0.15' />
					<stop offset='0.55' stopColor='#000000' stopOpacity='0' />
				</linearGradient>

				{/* Page thickness gradients — direction-specific. */}
				<linearGradient
					id='hc-shell-grad-thickness-left'
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
					id='hc-shell-grad-thickness-right'
					x1='586.3'
					y1='75.1'
					x2='570.3'
					y2='75.1'
					gradientUnits='userSpaceOnUse'>
					<stop offset='0' stopColor='#E5E7EB' stopOpacity='0.35' />
					<stop offset='0.4' stopColor='#E5E7EB' stopOpacity='0.75' />
					<stop offset='1' stopColor='#9CA3AF' stopOpacity='0.55' />
				</linearGradient>

				{/* Spine rounding gradients — direction-specific. */}
				<linearGradient
					id='hc-shell-grad-spine-left'
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
					id='hc-shell-grad-spine-right'
					x1='586.3'
					y1='75.1'
					x2='562.3'
					y2='75.1'
					gradientUnits='userSpaceOnUse'>
					<stop offset='0' stopColor='#000000' stopOpacity='0.12' />
					<stop offset='0.55' stopColor='#000000' stopOpacity='0.04' />
					<stop offset='1' stopColor='#000000' stopOpacity='0' />
				</linearGradient>

				{/* ─────────────────────────── CLIP PATHS ────────────────────────── */}

				{/* Book content rectangle (same for both orientations). */}
				<clipPath id='hc-shell-clip-book'>
					<rect x='66.2998' y='75.1' width='520' height='849' rx='13.5' />
				</clipPath>

				{/* Inner-page clip paths (one per orientation, matching the book path). */}
				<clipPath id='hc-shell-clip-img-left'>
					<path d='M66.2998 88.6393C66.2998 81.1617 72.3616 75.1 79.8391 75.1H572.76C580.238 75.1 586.3 81.1618 586.3 88.6393V814.419C586.3 817.311 585.374 820.128 583.657 822.455L512.754 918.597C510.202 922.057 506.157 924.1 501.857 924.1H79.8391C72.3616 924.1 66.2998 918.038 66.2998 910.561V88.6393Z' />
				</clipPath>
				<clipPath id='hc-shell-clip-img-right'>
					<path d='M586.3 88.6393C586.3 81.1617 580.238 75.1 572.76 75.1H79.8391C72.3616 75.1 66.2998 81.1618 66.2998 88.6393V814.419C66.2998 817.311 67.226 820.128 68.9426 822.455L139.846 918.597C142.398 922.057 146.442 924.1 150.742 924.1H572.76C580.238 924.1 586.3 918.038 586.3 910.561V88.6393Z' />
				</clipPath>

				{/* ─────────────────────────── FILTERS ───────────────────────────── */}

				{/* Outer card bevel + dual offset shadows + inset highlight + inset shadow. */}
				<filter
					id='hc-shell-filter-outer'
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
						result='effect1_dropShadow_hc_outer'
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
						result='effect1_dropShadow_hc_outer'
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
						result='effect2_dropShadow_hc_outer'
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
						in2='effect1_dropShadow_hc_outer'
						result='effect2_dropShadow_hc_outer'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_outer'
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
						result='effect3_innerShadow_hc_outer'
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
						in2='effect3_innerShadow_hc_outer'
						result='effect4_innerShadow_hc_outer'
					/>
				</filter>

				{/* Book page outer shadow — left variant. */}
				<filter
					id='hc-shell-filter-page-left'
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
						result='effect1_dropShadow_hc_page_l'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect1_dropShadow_hc_page_l'
						result='shape'
					/>
				</filter>

				{/* Book page outer shadow — right variant (mirrored dx). */}
				<filter
					id='hc-shell-filter-page-right'
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
						result='effect1_dropShadow_hc_page_r'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect1_dropShadow_hc_page_r'
						result='shape'
					/>
				</filter>

				{/* Book inner page shadow — left variant. */}
				<filter
					id='hc-shell-filter-page-inner-left'
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
						result='effect1_dropShadow_hc_page_inner_l'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect1_dropShadow_hc_page_inner_l'
						result='shape'
					/>
				</filter>

				{/* Book inner page shadow — right variant (mirrored dx). */}
				<filter
					id='hc-shell-filter-page-inner-right'
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
						result='effect1_dropShadow_hc_page_inner_r'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect1_dropShadow_hc_page_inner_r'
						result='shape'
					/>
				</filter>

				{/* Orange ribbon dual drop-shadow (identical between left & right cards). */}
				<filter
					id='hc-shell-filter-ribbon'
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
						result='effect1_dropShadow_hc_ribbon'
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
						in2='effect1_dropShadow_hc_ribbon'
						result='effect2_dropShadow_hc_ribbon'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_ribbon'
						result='shape'
					/>
				</filter>

				{/* Orange holder lip 3D filter — top bar, left variant. */}
				<filter
					id='hc-shell-filter-lip-top-left'
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
						result='effect1_dropShadow_hc_lip_tl'
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
						in2='effect1_dropShadow_hc_lip_tl'
						result='effect2_dropShadow_hc_lip_tl'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_lip_tl'
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
						result='effect3_innerShadow_hc_lip_tl'
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
						in2='effect3_innerShadow_hc_lip_tl'
						result='effect4_innerShadow_hc_lip_tl'
					/>
				</filter>

				{/* Orange holder lip 3D filter — bottom bar, left variant. */}
				<filter
					id='hc-shell-filter-lip-bot-left'
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
						result='effect1_dropShadow_hc_lip_bl'
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
						in2='effect1_dropShadow_hc_lip_bl'
						result='effect2_dropShadow_hc_lip_bl'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_lip_bl'
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
						result='effect3_innerShadow_hc_lip_bl'
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
						in2='effect3_innerShadow_hc_lip_bl'
						result='effect4_innerShadow_hc_lip_bl'
					/>
				</filter>

				{/* Orange holder lip 3D filter — top bar, right variant (region shifted right). */}
				<filter
					id='hc-shell-filter-lip-top-right'
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
						result='effect1_dropShadow_hc_lip_tr'
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
						in2='effect1_dropShadow_hc_lip_tr'
						result='effect2_dropShadow_hc_lip_tr'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_lip_tr'
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
						result='effect3_innerShadow_hc_lip_tr'
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
						in2='effect3_innerShadow_hc_lip_tr'
						result='effect4_innerShadow_hc_lip_tr'
					/>
				</filter>

				{/* Orange holder lip 3D filter — bottom bar, right variant. */}
				<filter
					id='hc-shell-filter-lip-bot-right'
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
						result='effect1_dropShadow_hc_lip_br'
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
						in2='effect1_dropShadow_hc_lip_br'
						result='effect2_dropShadow_hc_lip_br'
					/>
					<feBlend
						mode='normal'
						in='SourceGraphic'
						in2='effect2_dropShadow_hc_lip_br'
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
						result='effect3_innerShadow_hc_lip_br'
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
						in2='effect3_innerShadow_hc_lip_br'
						result='effect4_innerShadow_hc_lip_br'
					/>
				</filter>
			</defs>
		</svg>
	);
}
