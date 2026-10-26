"use client";

import { useCallback, useSyncExternalStore } from "react";

// Tailwind's `sm` breakpoint — below this width we treat the viewport as mobile.
const MOBILE_BREAKPOINT = 640;

/**
 * Returns `true` when the viewport width is below `breakpoint` (default 640px).
 *
 * SSR-safe: `false` on the server and while hydrating, then the real viewport,
 * updating on resize. A client-side mount (e.g. coming Back to a page) reads
 * the viewport in its very first render, so the layout is right immediately.
 *
 * @param {number} [breakpoint=640] - max width (exclusive) considered mobile
 * @returns {boolean}
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
	const query = `(max-width: ${breakpoint - 1}px)`;

	const subscribe = useCallback(
		(onChange) => {
			const mql = window.matchMedia(query);
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		},
		[query]
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false
	);
}
