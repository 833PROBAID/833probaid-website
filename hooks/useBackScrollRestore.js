"use client";

import { useLayoutEffect } from "react";

/**
 * How long the layout must stay still after `load` before the saved position
 * is released. Holding longer costs nothing: any input from the visitor ends
 * the restore at once.
 */
const RESTORE_SETTLE_MS = 1000;
/** Longest the saved position is held while the page is still changing. */
const RESTORE_MAX_MS = 5000;

/** URL of the latest back/forward navigation, consumed by the next mount. */
let poppedHref = null;
if (typeof window !== "undefined") {
	window.addEventListener("popstate", () => {
		poppedHref = window.location.href;
	});
}

/** The document's first mount may still be the one its Back/Forward load made. */
let initialMount = true;

/**
 * Key whose restore was cut short by an unmount. StrictMode's remount in
 * development lands up to ~100ms after hydration — later than the flags above
 * survive — so the remount picks the restore back up through this instead.
 */
let interruptedKey = null;

const noop = () => {};

const isBackForwardLoad = () =>
	performance.getEntriesByType?.("navigation")[0]?.type === "back_forward";

/**
 * Returns a page to where the visitor left it when they come back with the
 * browser's Back/Forward buttons.
 *
 * The browser's own restoration can't be trusted here: Next.js remounts the
 * page on Back, and content that depends on client state (the expanded book
 * grid, the mobile layout) isn't there yet when the browser restores, so the
 * position is clamped to a page that is too short. Instead the position is
 * saved as the visitor scrolls and when the page unmounts, and re-applied
 * once the page is tall enough.
 *
 * @param {string} key - sessionStorage key the position is saved under
 */
export default function useBackScrollRestore(key) {
	useLayoutEffect(() => {
		const storageKey = `scrollY:${key}`;
		const cameBack =
			poppedHref === window.location.href ||
			(poppedHref === null && initialMount && isBackForwardLoad()) ||
			interruptedKey === key;
		interruptedKey = null;
		// Cleared a tick later: StrictMode's remount in development runs this
		// effect again right away and must still see the Back navigation.
		setTimeout(() => {
			poppedHref = null;
			initialMount = false;
		}, 0);

		const readSaved = () => {
			try {
				return JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
			} catch {
				// unreadable storage — leave scrolling to the browser
				return null;
			}
		};

		let stopRestoring = noop;
		const restore = (saved) => {
			stopRestoring();
			// A #hash target wins; useHashPin positions those pages.
			if (typeof saved !== "number" || window.location.hash) return;
			const root = document.documentElement;
			const scrollToSaved = () => {
				const maxY = root.scrollHeight - window.innerHeight;
				const top = Math.min(saved, maxY);
				if (Math.abs(window.scrollY - top) > 1) {
					window.scrollTo({ top, behavior: "instant" });
				}
			};

			// The saved position belongs to the settled layout, but right after
			// mount the page is still changing: a full-page Back hydrates
			// collapsed first, and the navbar resizes once it sees the page is
			// scrolled. So the position is held on every layout change until the
			// page is quiet, with Chrome's scroll anchoring off so it doesn't
			// "compensate" for those changes and drift away from the spot.
			// Scrolls the visitor didn't make (Chrome's own restoration landing
			// late, to a spot computed from the half-built page) are undone too.
			const previousAnchor = root.style.overflowAnchor;
			root.style.overflowAnchor = "none";
			let settleTimer = 0;
			const onLayoutChange = () => {
				scrollToSaved();
				clearTimeout(settleTimer);
				// A quiet spell before `load` isn't the end: images and client
				// blocks still to come keep growing the page.
				if (document.readyState === "complete") {
					settleTimer = setTimeout(stop, RESTORE_SETTLE_MS);
				}
			};
			const resizeObserver = new ResizeObserver(onLayoutChange);
			const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
			const hardStop = setTimeout(stop, RESTORE_MAX_MS);
			function stop() {
				resizeObserver.disconnect();
				clearTimeout(settleTimer);
				clearTimeout(hardStop);
				userEvents.forEach((e) => window.removeEventListener(e, stop));
				window.removeEventListener("scroll", onLayoutChange);
				window.removeEventListener("load", onLayoutChange);
				root.style.overflowAnchor = previousAnchor;
				stopRestoring = noop;
			}
			stopRestoring = stop;
			userEvents.forEach((e) =>
				window.addEventListener(e, stop, { passive: true, once: true })
			);
			window.addEventListener("scroll", onLayoutChange, { passive: true });
			window.addEventListener("load", onLayoutChange);
			resizeObserver.observe(document.body);
			onLayoutChange();
		};

		if (cameBack) restore(readSaved());

		// Safari keeps the page in its back/forward cache but shows it scrolled
		// to the top on Back, and nothing remounts, so the restore starts here.
		// Read right away, before a scroll event can save that top position.
		const onPageShow = (e) => {
			if (e.persisted) restore(readSaved());
		};
		window.addEventListener("pageshow", onPageShow);

		// Leaving mid-restore keeps the saved position; the page isn't at its
		// real spot yet.
		const save = () => {
			if (stopRestoring !== noop) return;
			try {
				sessionStorage.setItem(storageKey, JSON.stringify(window.scrollY));
			} catch {
				// storage full or blocked — nothing to restore next time
			}
		};
		// Leaving for another site (window.location.assign) never unmounts the
		// page, and Safari doesn't reliably fire pagehide for it either, so the
		// position is also saved as the visitor scrolls.
		let saveTimer = 0;
		const onScroll = () => {
			clearTimeout(saveTimer);
			saveTimer = setTimeout(save, 100);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("pagehide", save);

		return () => {
			clearTimeout(saveTimer);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("pagehide", save);
			window.removeEventListener("pageshow", onPageShow);
			// Layout-effect cleanup runs before the next page scrolls to the top,
			// so this is still the position the visitor left from.
			const restoring = stopRestoring !== noop;
			stopRestoring();
			if (!restoring) {
				save();
				return;
			}
			// Mid-restore, which is how StrictMode's remount finds it: hand the
			// restore over to the remount, if one follows shortly.
			interruptedKey = key;
			setTimeout(() => {
				if (interruptedKey === key) interruptedKey = null;
			}, 500);
		};
	}, [key]);
}
