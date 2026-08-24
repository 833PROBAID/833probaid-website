"use client";

// TEMPORARY preview route for the intake success popup — safe to delete.
import { useState } from "react";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";

const VARIANTS = {
	referral: {
		title: "Referral Received & File Initiated",
		paragraphs: [
			"Your referral has been securely received and entered into the 833PROBAID® Intake Workflow.",
			"Our team is reviewing the submitted referral, evaluating the court status, property status, occupancy, and all information provided to determine the appropriate next steps in accordance with your instructions.",
			"If additional information or documentation is required, or if direct client contact was requested, we will initiate the appropriate communication promptly.",
		],
		highlights: ["Intake Workflow"],
		footnote: {
			heading: "Need immediate assistance?",
			text: "For imminent court deadlines, overbid hearings, or urgent property security concerns, please contact us directly at",
		},
	},
	vendor: {
		title: "Vendor Application Received",
		paragraphs: [
			"Your Vendor Intake Application has been securely received and entered into the 833PROBAID® Vendor Qualification Process.",
			"Our team is reviewing your application, verifying the information and supporting documentation provided, including applicable licenses, insurance, W-9s, service capabilities, and coverage areas.",
			"If additional information or documentation is required, we will contact you directly. Approved vendors may be added to the 833PROBAID® Vendor Network and contacted for assignments based on service area, qualifications, availability, and case needs.",
		],
		highlights: ["Vendor Qualification Process", "Vendor Network"],
		footnote: {
			heading: "Questions about your application?",
			text: "Please contact us at",
		},
	},
};

export default function Preview() {
	const [variant, setVariant] = useState("referral");
	const [open, setOpen] = useState(true);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
			<div className="flex gap-3">
				{Object.keys(VARIANTS).map((key) => (
					<button
						key={key}
						onClick={() => {
							setVariant(key);
							setOpen(true);
						}}
						className="rounded-lg bg-primary px-5 py-2.5 font-bold text-white capitalize"
					>
						Show {key} popup
					</button>
				))}
			</div>
			<SubmissionSuccessModal
				key={variant}
				open={open}
				onClose={() => setOpen(false)}
				{...VARIANTS[variant]}
			/>
		</div>
	);
}
