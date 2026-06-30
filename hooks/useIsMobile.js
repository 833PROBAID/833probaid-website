"use client";

import { useState, useEffect } from "react";

// Tailwind's `sm` breakpoint — below this width we treat the viewport as mobile.
const MOBILE_BREAKPOINT = 640;

/**
 * Returns `true` when the viewport width is below `breakpoint` (default 640px).
 *
 * SSR-safe: starts as `false` on the server / first render, then syncs to the
 * real viewport after mount and keeps updating on resize.
 *
 * @param {number} [breakpoint=640] - max width (exclusive) considered mobile
 * @returns {boolean}
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
		const update = () => setIsMobile(mql.matches);

		update();
		mql.addEventListener("change", update);
		return () => mql.removeEventListener("change", update);
	}, [breakpoint]);

	return isMobile;
}
