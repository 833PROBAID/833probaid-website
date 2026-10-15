"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import VendorForm from "@/components/Forms/Vendor";
import ReferralForm from "@/components/Forms/Referral";
import GuideDownloadCards, {
	GUIDE_DOWNLOAD_EVENT,
} from "@/components/GuideDownloadCards";
import BookCardBigNew from "@/app/new-page/BookCardBigNew";

/** Authored trigger classes → the guide card each one opens. */
const GUIDE_TRIGGERS = {
	"buyer-download": "buyer",
	"seller-download": "seller",
};

/** Fallback for browsers without `scrollend` (Safari < 18). */
const SCROLL_SETTLE_MS = 900;

const AGENT_PROFILE_URL = "https://luxurycollectiverealty.com/team/tigran-mkrtchian";

/**
 * Creates (once) the host element a form's submit button portals into, so the
 * reading order on the page becomes:
 *
 *   form fields → authored closing copy → Submit → conclusion block
 *
 * The editor's #referral-intake / #vendor-intake placeholder sits above the
 * closing copy, and that copy ("Upon submission…", "…Acknowledgment & Consent")
 * is wording meant to be read before submitting — so the button is detached
 * from the form body and re-anchored after it.
 *
 * The vendor book marks that closing copy with .bottom-section, so the host
 * goes directly after the last such block (which keeps it inside the same
 * section, ahead of the conclusion). Books without the class — the referral
 * book — fall back to anchoring on the conclusion block itself.
 *
 * `data-no-scope` keeps the home book's scoped GrapesJS CSS off the button,
 * matching how the intake placeholders themselves are treated.
 */
function ensureSubmitHost(intakeEl, hostId) {
	const existing = document.getElementById(hostId);
	if (existing) return existing;

	const content = intakeEl.closest(".homebook-content");
	const root = content?.querySelector("main") || content;
	if (!root) return null;

	const host = document.createElement("div");
	host.id = hostId;
	host.setAttribute("data-no-scope", "");

	// Only closing copy that actually follows the intake placeholder counts —
	// a .bottom-section above the form must not pull the button up with it.
	const trailing = [...root.querySelectorAll(".bottom-section")].filter(
		(el) =>
			intakeEl.compareDocumentPosition(el) &
			Node.DOCUMENT_POSITION_FOLLOWING
	);
	const lastBottomSection = trailing[trailing.length - 1];
	if (lastBottomSection) {
		lastBottomSection.after(host);
		return host;
	}

	// Anchor ahead of the conclusion block; fall back to the end of the content
	// when a home book has no conclusion section.
	const conclusion = root.querySelector("#conclusion, .conclusion-block");
	const anchor = conclusion?.parentElement === root ? conclusion : null;
	if (anchor) root.insertBefore(host, anchor);
	else root.appendChild(host);

	return host;
}

/**
 * Creates (once) the host element the cover-art guide downloads render into,
 * directly after the authored `.guide-cards` row.
 *
 * The anchor is the content itself rather than a book slug, so the block follows
 * wherever an author puts that row — in the Resource Center today, in a later
 * book tomorrow. Rows are required to hold `.guide-card` links: the editor also
 * emits bare `.guide-cards` divs as spacers, and while stripEmptyHtml currently
 * removes them server-side, an authored row with only whitespace would survive
 * and must not be mistaken for the downloads section.
 *
 * `data-no-scope` keeps the home book's scoped GrapesJS CSS off the React
 * markup, matching how the intake placeholders are treated.
 */
function ensureGuideDownloadsHost() {
	const existing = document.getElementById("guide-downloads");
	if (existing) return existing;

	const populated = [...document.querySelectorAll(".homebook-content .guide-cards")].filter(
		(el) => el.querySelector(".guide-card")
	);
	const anchor = populated[populated.length - 1];
	if (!anchor) return null;

	const host = document.createElement("div");
	host.id = "guide-downloads";
	host.setAttribute("data-no-scope", "");
	anchor.after(host);

	return host;
}

/**
 * Returns the authored `.big-book` section the agent-profile book renders
 * into, marked `data-no-scope` so the home book's scoped GrapesJS CSS stays
 * off the React markup.
 */
function findBigBookHost() {
	const el = document.querySelector(".homebook-content .big-book");
	return el;
}

/**
 * Portals React form components into placeholder elements that GrapesJS
 * content may embed via #vendor-intake / #referral-intake IDs, and renders the
 * guide download block below the authored `.guide-cards` row.
 * HTML rendering is handled server-side in page.jsx via dangerouslySetInnerHTML.
 */
export default function HomeBookContentClient() {
	const [vendorIntakeEl, setVendorIntakeEl] = useState(null);
	const [vendorSubmitEl, setVendorSubmitEl] = useState(null);
	const [referralIntakeEl, setReferralIntakeEl] = useState(null);
	const [referralSubmitEl, setReferralSubmitEl] = useState(null);
	const [guideDownloadsEl, setGuideDownloadsEl] = useState(null);
	const [bigBookEl, setBigBookEl] = useState(null);

	useEffect(() => {
		const vendorEl = document.getElementById("vendor-intake");
		const referralEl = document.getElementById("referral-intake");
		if (vendorEl) {
			vendorEl.setAttribute("data-no-scope", "");
			setVendorSubmitEl(ensureSubmitHost(vendorEl, "vendor-submit"));
		}
		if (referralEl) {
			referralEl.setAttribute("data-no-scope", "");
			setReferralSubmitEl(ensureSubmitHost(referralEl, "referral-submit"));
		}
		setVendorIntakeEl(vendorEl);
		setReferralIntakeEl(referralEl);
		setGuideDownloadsEl(ensureGuideDownloadsHost());
		setBigBookEl(findBigBookHost());
	}, []);

	// The browser jumps to a #hash before the portaled forms/cards above mount,
	// and their height then pushes the target down. Re-scroll once everything
	// has rendered so links like /homebooks/your-resource-center#fiduciary-banking
	// land on the element.
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (!id) return;
		const frame = requestAnimationFrame(() => {
			const target = document.getElementById(id);
			if (!target) return;
			const top = target.getBoundingClientRect().top + window.scrollY - 200;
			window.scrollTo({ top });
		});
		return () => cancelAnimationFrame(frame);
	}, [vendorIntakeEl, referralIntakeEl, guideDownloadsEl, bigBookEl]);

	// Authored `.buyer-download` / `.seller-download` elements bring the viewer
	// to the matching guide card and open it once the scroll has settled, so
	// the cover turn is seen rather than played off-screen. Delegated from the
	// document because the elements live in the server-rendered HTML.
	useEffect(() => {
		if (!guideDownloadsEl) return;

		const selector = Object.keys(GUIDE_TRIGGERS)
			.map((c) => `.${c}`)
			.join(", ");
		let cleanupScroll = () => {};

		const onClick = (e) => {
			const trigger = e.target.closest?.(selector);
			if (!trigger || guideDownloadsEl.contains(trigger)) return;
			const cls = Object.keys(GUIDE_TRIGGERS).find((c) =>
				trigger.classList.contains(c)
			);
			const key = GUIDE_TRIGGERS[cls];
			const card =
				guideDownloadsEl.querySelector(`[data-guide="${key}"]`) ||
				guideDownloadsEl;

			e.preventDefault();
			cleanupScroll();

			let done = false;
			const open = () => {
				if (done) return;
				done = true;
				cleanupScroll();
				window.dispatchEvent(
					new CustomEvent(GUIDE_DOWNLOAD_EVENT, { detail: { key } })
				);
			};
			const timer = setTimeout(open, SCROLL_SETTLE_MS);
			window.addEventListener("scrollend", open, { once: true });
			cleanupScroll = () => {
				clearTimeout(timer);
				window.removeEventListener("scrollend", open);
			};

			card.scrollIntoView({ behavior: "smooth", block: "center" });
		};

		document.addEventListener("click", onClick);
		return () => {
			document.removeEventListener("click", onClick);
			cleanupScroll();
		};
	}, [guideDownloadsEl]);

	return (
		<>
			{vendorIntakeEl &&
				createPortal(
					<VendorForm submitPortalTarget={vendorSubmitEl} />,
					vendorIntakeEl
				)}
			{referralIntakeEl &&
				createPortal(
					<ReferralForm submitPortalTarget={referralSubmitEl} />,
					referralIntakeEl
				)}
			{guideDownloadsEl &&
				createPortal(<GuideDownloadCards />, guideDownloadsEl)}
			{bigBookEl &&
				createPortal(
					<BookCardBigNew
						title="THE REAL ESTATE COMMAND CENTER"
						subtitle="Your Direct Access To The Market. Your Next Move Starts Here."
						description="Explore Our Listings. Search Any Neighborhood. Discover Your Next Opportunity."
						icon="/icons/card-icon-8.png"
						href={AGENT_PROFILE_URL}
						fullWidth
						speed={3000}
					/>,
					bigBookEl
				)}
		</>
	);
}
