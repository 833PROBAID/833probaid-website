"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Design size of the footer card SVGs (their viewBox).
const CARD_W = 566;

/**
 * Content layer for the footer cards (LogoCard, ContactCard, NewsletterCard).
 *
 * The cards are SVGs drawn in a 566×586 viewBox. Their text used to live in a
 * <foreignObject>, which Safari lays out inconsistently under page zoom: the
 * HTML grows relative to the frame, so the text pushed the e-mail field out of
 * the card and under the Subscribe button.
 *
 * Here the content is plain HTML over the SVG, sized in design units:
 * --u is 1/566 of the card's width, so `calc(19 * var(--u))` is "19px at
 * design size". Everything inside — text, spacing, icons, the Subscribe
 * button — must be sized this way, and then it keeps the proportions of the
 * frame at any width.
 *
 * --u is set twice, on purpose:
 * - CSS: calc(100cqw / 566). Right from the first paint, without JS. But
 *   WebKit applies page zoom to cqw a second time, so in Safari at 115% the
 *   content comes out 1.15× too big for the card.
 * - JS: the card's measured width / 566, in px. Safari zooms px correctly,
 *   so once hydrated this replaces the CSS value and holds at any zoom.
 * (Transform-scaling instead doesn't help: WebKit also resolves the unitless
 * tan(atan2(100cqw, 566px)) ratio wrongly.)
 *
 * x / y / width / height place the content box exactly like the old
 * foreignObject attributes did, in the same design units.
 */
export default function ScaledCardContent({ x, y, width, height, className = "", children }) {
	const frameRef = useRef(null);
	const [unit, setUnit] = useState(null);

	useLayoutEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		// offsetWidth is the layout width in CSS px, unaffected by transforms.
		const update = () => {
			const w = frame.offsetWidth;
			if (w > 0) setUnit(`${w / CARD_W}px`);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(frame);
		return () => observer.disconnect();
	}, []);

	const u = (n) => `calc(${n} * var(--u))`;
	return (
		<div
			ref={frameRef}
			className="pointer-events-none absolute inset-0"
			style={{ containerType: "inline-size", "--u": unit ?? `calc(100cqw / ${CARD_W})` }}
		>
			<div
				className={`pointer-events-auto absolute ${className}`}
				style={{ left: u(x), top: u(y), width: u(width), height: u(height), fontSize: u(16) }}
			>
				{children}
			</div>
		</div>
	);
}
