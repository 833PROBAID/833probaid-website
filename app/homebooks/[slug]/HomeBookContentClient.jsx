"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import VendorForm from "@/components/Forms/Vendor";
import ReferralForm from "@/components/Forms/Referral";

/**
 * Portals React form components into placeholder elements that GrapesJS
 * content may embed via #vendor-intake / #referral-intake IDs.
 * HTML rendering is handled server-side in page.jsx via dangerouslySetInnerHTML.
 */
export default function HomeBookContentClient() {
	const [vendorIntakeEl, setVendorIntakeEl] = useState(null);
	const [referralIntakeEl, setReferralIntakeEl] = useState(null);

	useEffect(() => {
		const vendorEl = document.getElementById("vendor-intake");
		const referralEl = document.getElementById("referral-intake");
		if (vendorEl) vendorEl.setAttribute("data-no-scope", "");
		if (referralEl) referralEl.setAttribute("data-no-scope", "");
		setVendorIntakeEl(vendorEl);
		setReferralIntakeEl(referralEl);
	}, []);

	return (
		<>
			{vendorIntakeEl && createPortal(<VendorForm />, vendorIntakeEl)}
			{referralIntakeEl && createPortal(<ReferralForm />, referralIntakeEl)}
		</>
	);
}
