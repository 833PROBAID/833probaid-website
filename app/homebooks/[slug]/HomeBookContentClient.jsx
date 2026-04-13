"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import VendorForm from "@/components/Forms/Vendor";
import ReferralForm from "@/components/Forms/Referral";

function scopeCSS(css, scope) {
	if (!css) return "";
	return css.replace(
		/([^{}]+)\{([^{}]*)\}/g,
		(match, selector, declarations) => {
			const s = selector.trim();
			if (s.startsWith("@")) return match;
			if (s.includes(":root")) return match;
			if (s === "html" || s === "body") return "";
			if (s.startsWith(scope)) return match;
			const scoped = s
				.split(",")
				.map((sel) => {
					const t = sel.trim();
					return t.startsWith(scope) ? t : `${scope} ${t}`;
				})
				.join(", ");
			return `${scoped} { ${declarations} }`;
		},
	);
}

export default function HomeBookContentClient({ grapesContent }) {
	const contentRef = useRef(null);
	const [vendorIntakeEl, setVendorIntakeEl] = useState(null);
	const [referralIntakeEl, setReferralIntakeEl] = useState(null);

	useEffect(() => {
		if (!contentRef.current || !grapesContent?.html) return;

		contentRef.current.innerHTML = grapesContent.html;

		const parent = contentRef.current.parentElement;
		if (!parent) return;

		const vendorEl = contentRef.current.querySelector("#vendor-intake");
		if (vendorEl) {
			parent.appendChild(vendorEl);
			setVendorIntakeEl(vendorEl);
		} else {
			setVendorIntakeEl(null);
		}

		const referralEl = contentRef.current.querySelector("#referral-intake");
		if (referralEl) {
			parent.appendChild(referralEl);
			setReferralIntakeEl(referralEl);
		} else {
			setReferralIntakeEl(null);
		}
	}, [grapesContent?.html]);

	if (!grapesContent?.html) {
		return (
			<div className='mt-8 text-center text-gray-500'>
				<p>No content available for this home book.</p>
			</div>
		);
	}

	return (
		<div className='mt-8'>
			<style
				dangerouslySetInnerHTML={{
					__html: scopeCSS(grapesContent.css || "", ".homebook-content"),
				}}
			/>
			<div
				ref={contentRef}
				className='homebook-content'
				style={{
					contain: "layout style",
					isolation: "isolate",
					position: "relative",
					zIndex: 1,
				}}
			/>
			{vendorIntakeEl && createPortal(<VendorForm />, vendorIntakeEl)}
			{referralIntakeEl && createPortal(<ReferralForm />, referralIntakeEl)}
		</div>
	);
}
