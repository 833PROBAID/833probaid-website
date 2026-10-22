"use client";

import { useEffect } from "react";
import { HASH_PENDING_ATTR } from "@/app/utils/hashPending";

/** How long the layout must stay still after `load` before #hash pinning ends. */
const HASH_SETTLE_MS = 1000;
/** Upper bound on #hash pinning, so a page that never settles is released. */
const HASH_MAX_PIN_MS = 10000;
/** Quiet layout time required before a hidden #hash page is revealed. */
const HASH_REVEAL_QUIET_MS = 200;
/** Longest a #hash page stays hidden, even if something is still loading. */
const HASH_REVEAL_MAX_MS = 2500;
/** Pending reveal from an unmount; cancelled when the effect remounts. */
let unmountRevealTimer = 0;

/**
 * Scrolls a page opened with a #hash to its target and keeps it there while the
 * layout settles. Pair with HashPendingGuard on the server page.
 *
 * @param {number} [offset] - px kept above the target; defaults to the
 *   target's own CSS scroll-margin-top, so native jumps land on the same spot
 */
export default function useHashPin(offset) {
	const offsetFor = (el) =>
		offset ?? (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);

	// Links like /#qr-section or /homebooks/your-resource-center#fiduciary-banking
	// must land on the element. A single re-scroll isn't enough: on a refresh the browser
	// restores the previous scroll position, and after the native hash jump the
	// layout keeps shifting — client-only blocks mount, images and fonts load,
	// CtaWordLinks rewrites the copy — each pushing the target somewhere else.
	// Which of those finishes last differs per load, hence the random landing.
	//
	// So restoration is turned off and the target is pinned: every layout change
	// (ResizeObserver on the body) re-scrolls to it, until the page has been
	// stable for HASH_SETTLE_MS after `load`, or the user scrolls themselves.
	//
	// Pinning alone still shows the wrong spot for a moment before correcting.
	// HashPendingGuard therefore hides the page before its first paint
	// (HASH_PENDING_ATTR) whenever the URL has a hash; it is revealed here once the target has
	// stopped moving, so the first thing the viewer sees is the right position.
	useEffect(() => {
		// A remount right after unmount (React StrictMode in development runs
		// every effect twice) takes over from the previous run, page still hidden.
		clearTimeout(unmountRevealTimer);

		let stopPinning = () => {};
		const reveal = () =>
			document.documentElement.removeAttribute(HASH_PENDING_ATTR);

		const pinToHash = () => {
			stopPinning();

			let id = window.location.hash.slice(1);
			try {
				id = decodeURIComponent(id);
			} catch {
				// malformed escape — use the raw hash
			}
			const target = id && document.getElementById(id);
			if (!target) {
				reveal();
				return;
			}

			history.scrollRestoration = "manual";

			const scrollToTarget = () => {
				const el = document.getElementById(id);
				if (!el) return;
				const top =
					el.getBoundingClientRect().top + window.scrollY - offsetFor(el);
				if (Math.abs(window.scrollY - top) > 1) {
					window.scrollTo({ top, behavior: "instant" });
				}
			};

			// Reveal once nothing above the target can still move it: fonts are in,
			// eager images before it have loaded, and the layout has been quiet for
			// HASH_REVEAL_QUIET_MS. Lazy images are skipped — off-screen above the
			// target they never start loading, and scroll anchoring covers them.
			let revealed = false;
			let revealTimer = 0;
			const pendingImagesAbove = () =>
				[...document.images].filter(
					(img) =>
						!img.complete &&
						img.loading !== "lazy" &&
						img.compareDocumentPosition(target) &
							Node.DOCUMENT_POSITION_FOLLOWING
				);
			const tryReveal = () => {
				if (revealed) return;
				if (document.fonts && document.fonts.status !== "loaded") {
					document.fonts.ready.then(armReveal);
					return;
				}
				const pending = pendingImagesAbove();
				if (pending.length) {
					Promise.all(
						pending.map(
							(img) =>
								new Promise((resolve) => {
									img.addEventListener("load", resolve, { once: true });
									img.addEventListener("error", resolve, { once: true });
								})
						)
					).then(armReveal);
					return;
				}
				revealed = true;
				clearTimeout(revealCap);
				scrollToTarget();
				reveal();
			};
			function armReveal() {
				if (revealed) return;
				clearTimeout(revealTimer);
				revealTimer = setTimeout(tryReveal, HASH_REVEAL_QUIET_MS);
			}
			// Never keep the page hidden longer than this, whatever is still loading.
			const revealCap = setTimeout(() => {
				revealed = true;
				scrollToTarget();
				reveal();
			}, HASH_REVEAL_MAX_MS);

			let settleTimer = 0;
			const armSettle = () => {
				clearTimeout(settleTimer);
				// Keep pinning until the page has fully loaded, then until it stops moving.
				if (document.readyState === "complete") {
					settleTimer = setTimeout(stop, HASH_SETTLE_MS);
				}
			};
			// Scrolls synchronously: ResizeObserver reports after layout but before
			// paint, so correcting here lands in the same frame as the shift.
			// Deferring to the next frame let WebKit paint the shifted position.
			const onLayoutChange = () => {
				scrollToTarget();
				armSettle();
				armReveal();
			};

			// Shifts that leave the body's height unchanged (one block shrinking as
			// another grows) escape the observer, so each frame is checked as well.
			let frame = requestAnimationFrame(function checkFrame() {
				scrollToTarget();
				frame = requestAnimationFrame(checkFrame);
			});

			const resizeObserver = new ResizeObserver(onLayoutChange);
			resizeObserver.observe(document.body);
			resizeObserver.observe(target);

			const onLoad = () => onLayoutChange();
			window.addEventListener("load", onLoad);
			document.fonts?.ready.then(onLayoutChange);

			// Any deliberate scroll by the user ends the pinning immediately.
			const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
			const onUserScroll = () => stop();
			userEvents.forEach((e) =>
				window.addEventListener(e, onUserScroll, { passive: true, once: true })
			);
			const hardStop = setTimeout(stop, HASH_MAX_PIN_MS);

			function stop(revealNow = true) {
				resizeObserver.disconnect();
				cancelAnimationFrame(frame);
				clearTimeout(settleTimer);
				clearTimeout(hardStop);
				clearTimeout(revealTimer);
				clearTimeout(revealCap);
				revealed = true;
				if (revealNow) reveal();
				window.removeEventListener("load", onLoad);
				userEvents.forEach((e) => window.removeEventListener(e, onUserScroll));
				history.scrollRestoration = "auto";
				stopPinning = () => {};
			}
			stopPinning = stop;

			scrollToTarget();
			armSettle();
			armReveal();
		};

		pinToHash();
		window.addEventListener("hashchange", pinToHash);
		return () => {
			window.removeEventListener("hashchange", pinToHash);
			// Revealing here would flash the unpositioned page during StrictMode's
			// remount, so it waits a tick; a remount cancels it and keeps pinning.
			stopPinning(false);
			unmountRevealTimer = setTimeout(reveal, 0);
		};
	}, [offset]);
}
