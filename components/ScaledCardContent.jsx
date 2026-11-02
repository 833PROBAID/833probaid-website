"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Design size of the footer card SVGs (their viewBox).
const CARD_W = 566;
const CARD_H = 586;

/**
 * Content layer for the footer cards (LogoCard, ContactCard, NewsletterCard).
 *
 * The cards are SVGs drawn in a 566×586 viewBox. Their text used to live in a
 * <foreignObject>, which Safari lays out inconsistently under page zoom: the
 * HTML grows relative to the frame, so the text pushed the e-mail field out of
 * the card and under the Subscribe button.
 *
 * Here the content is plain HTML over the SVG, sized in design units:
 * `calc(19 * var(--u))` is "19px at design size". Everything inside — text,
 * spacing, icons, the Subscribe button — must be sized this way.
 *
 * Two modes, because Safari breaks each one on its own:
 * - Before hydration (or without JS): --u = 100cqw / 566, no transform.
 *   Correct at 100% zoom, but WebKit applies page zoom to cqw a second time
 *   (content 1.15× too big at 115%), and its minimum font size kicks in when
 *   zoomed out (text no longer shrinks with the card at 50%).
 * - After hydration: --u = 1px, so the content is laid out at real design
 *   size (19px text — far from the minimum font size), and the whole stage is
 *   scaled to the card with transform: scale(card width / 566). Transforms
 *   are zoomed correctly and aren't subject to the minimum font size.
 * (The CSS-only ratio tan(atan2(100cqw, 566px)) would avoid JS, but WebKit
 * resolves it wrongly.)
 *
 * x / y / width / height place the content box exactly like the old
 * foreignObject attributes did, in the same design units.
 */
export default function ScaledCardContent({ x, y, width, height, className = "", children }) {
	const frameRef = useRef(null);
	const [scale, setScale] = useState(null);

	useLayoutEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		// offsetWidth is the layout width in CSS px, unaffected by transforms.
		const update = () => {
			const w = frame.offsetWidth;
			if (w > 0) setScale(w / CARD_W);
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
			style={{
				containerType: "inline-size",
				"--u": scale ? "1px" : `calc(100cqw / ${CARD_W})`,
			}}
		>
			<div
				style={{
					position: "relative",
					width: u(CARD_W),
					height: u(CARD_H),
					transform: scale ? `scale(${scale})` : undefined,
					transformOrigin: "0 0",
				}}
			>
				<div
					className={`pointer-events-auto absolute ${className}`}
					style={{ left: u(x), top: u(y), width: u(width), height: u(height), fontSize: u(16) }}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
