"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import VendorForm from "@/components/Forms/Vendor";
import ReferralForm from "@/components/Forms/Referral";

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
 * Portals React form components into placeholder elements that GrapesJS
 * content may embed via #vendor-intake / #referral-intake IDs.
 * HTML rendering is handled server-side in page.jsx via dangerouslySetInnerHTML.
 */
export default function HomeBookContentClient() {
	const [vendorIntakeEl, setVendorIntakeEl] = useState(null);
	const [vendorSubmitEl, setVendorSubmitEl] = useState(null);
	const [referralIntakeEl, setReferralIntakeEl] = useState(null);
	const [referralSubmitEl, setReferralSubmitEl] = useState(null);

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
	}, []);

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
		</>
	);
}
