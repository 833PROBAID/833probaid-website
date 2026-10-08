"use client";

import { useEffect, useMemo, useState } from "react";
import toolLeadsApi from "@/app/lib/api/toolLeads";

const SUBMITTED_KEY = "tool_lead_capture_submitted_v1";
const NEWSLETTER_SIGNAL = /(newsletter|email|mailchimp|constantcontact|klaviyo|convertkit)/i;
const NEWSLETTER_QUERY_KEYS = [
	"source",
	"from",
	"origin",
	"ref",
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"campaign",
	"channel",
];

const INITIAL_FORM_DATA = {
	fullName: "",
	email: "",
	phone: "",
	company: "",
	role: "",
	notes: "",
};

const getSourceContext = () => {
	if (typeof window === "undefined") {
		return {
			shouldShowCapture: false,
			sourceType: "website",
			sourceDetails: {
				source: "",
				medium: "",
				campaign: "",
				term: "",
				content: "",
				referrer: "",
			},
		};
	}

	const params = new URLSearchParams(window.location.search);
	const querySignals = NEWSLETTER_QUERY_KEYS.map((key) => params.get(key) || "");
	const explicitSource =
		params.get("source") ||
		params.get("from") ||
		params.get("origin") ||
		params.get("ref") ||
		params.get("utm_source") ||
		"";

	const hasNewsletterSignal = querySignals.some((candidate) =>
		NEWSLETTER_SIGNAL.test(String(candidate)),
	);
	const sourceType = hasNewsletterSignal ? "newsletter" : "website";

	return {
		shouldShowCapture: hasNewsletterSignal,
		sourceType,
		sourceDetails: {
			source: explicitSource || params.get("utm_source") || "",
			medium: params.get("utm_medium") || "",
			campaign: params.get("utm_campaign") || "",
			term: params.get("utm_term") || "",
			content: params.get("utm_content") || "",
			referrer: document.referrer || "",
		},
	};
};

export default function ToolLeadCaptureModal({ toolPage, title }) {
	const [isOpen, setIsOpen] = useState(false);
	const [sourceType, setSourceType] = useState("website");
	const [sourceDetails, setSourceDetails] = useState({
		source: "",
		medium: "",
		campaign: "",
		term: "",
		content: "",
		referrer: "",
	});
	const [formData, setFormData] = useState(INITIAL_FORM_DATA);
	const [status, setStatus] = useState("idle");
	const [error, setError] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const submitted = localStorage.getItem(SUBMITTED_KEY) === "1";
		const context = getSourceContext();

		setSourceType(context.sourceType);
		setSourceDetails(context.sourceDetails);

		if (!submitted && context.shouldShowCapture) {
			setIsOpen(true);
		}
	}, []);

	useEffect(() => {
		if (!isOpen || typeof document === "undefined") return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	const isValid = useMemo(() => {
		const requiredFieldsFilled = [
			formData.fullName,
			formData.email,
			formData.phone,
			formData.company,
			formData.role,
			formData.notes,
		].every((value) => String(value || "").trim().length > 0);

		return (
			requiredFieldsFilled &&
			formData.fullName.trim().length > 1 &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
		);
	}, [formData]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isValid || status === "loading") return;

		setStatus("loading");
		setError("");

		try {
			const pageUrl =
				typeof window !== "undefined" ? window.location.href : "";

			const result = await toolLeadsApi.create({
				fullName: formData.fullName,
				email: formData.email,
				phone: formData.phone,
				company: formData.company,
				role: formData.role,
				notes: formData.notes,
				toolPage,
				pageUrl,
				sourceType,
				sourceDetails,
			});

			if (!result?.success) {
				throw new Error(result?.error || "Unable to submit your details");
			}

			if (typeof window !== "undefined") {
				localStorage.setItem(SUBMITTED_KEY, "1");
			}

			setStatus("success");
			setTimeout(() => {
				setIsOpen(false);
				setFormData(INITIAL_FORM_DATA);
			}, 900);
		} catch (submitError) {
			setStatus("error");
			setError(submitError.message || "Submission failed. Please try again.");
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-140 flex items-center justify-center bg-slate-900/70 p-2 sm:p-4'>
			<div
				className='flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl'
				style={{ maxHeight: "calc(100dvh - 1rem)" }}>
				<div className='shrink-0 bg-linear-to-r from-primary to-primaryDark px-6 py-5 text-white sm:px-8'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<p className='text-xs font-semibold tracking-[0.22em] text-white/80 uppercase'>
								Newsletter Arrival Detected
							</p>
							<h2 className='mt-1 text-2xl font-extrabold leading-tight sm:text-3xl'>
								{title || "Before You Use This Tool"}
							</h2>
							<p className='mt-2 text-sm font-medium text-white/90 sm:text-base'>
								Please complete all fields so we can follow up with the exact guidance your case needs.
							</p>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
					<div className='min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<label className='flex flex-col gap-1.5'>
								<span className='text-sm font-semibold text-slate-700'>Full Name *</span>
								<input
									type='text'
									name='fullName'
									value={formData.fullName}
									onChange={handleChange}
									required
									className='rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
								/>
							</label>
							<label className='flex flex-col gap-1.5'>
								<span className='text-sm font-semibold text-slate-700'>Email *</span>
								<input
									type='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									required
									className='rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
								/>
							</label>
							<label className='flex flex-col gap-1.5'>
								<span className='text-sm font-semibold text-slate-700'>Phone</span>
								<input
									type='tel'
									name='phone'
									value={formData.phone}
									onChange={handleChange}
									required
									className='rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
								/>
							</label>
							<label className='flex flex-col gap-1.5'>
								<span className='text-sm font-semibold text-slate-700'>Firm / Company</span>
								<input
									type='text'
									name='company'
									value={formData.company}
									onChange={handleChange}
									required
									className='rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
								/>
							</label>
						</div>

						<label className='flex flex-col gap-1.5'>
							<span className='text-sm font-semibold text-slate-700'>Role</span>
							<input
								type='text'
								name='role'
								value={formData.role}
								onChange={handleChange}
								required
								className='rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
							/>
						</label>

						<label className='flex flex-col gap-1.5'>
							<span className='text-sm font-semibold text-slate-700'>Case Notes *</span>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleChange}
								rows={3}
								required
								className='resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
							/>
						</label>

						{status === "error" && error ? (
							<p className='rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700'>
								{error}
							</p>
						) : null}

						{status === "success" ? (
							<p className='rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-700'>
								Thank you. Your details were submitted successfully.
							</p>
						) : null}
					</div>

					<div className='shrink-0 border-t border-slate-200 bg-white px-6 py-4 sm:px-8'>
						<div className='flex items-center justify-end'>
							<button
								type='submit'
								disabled={!isValid || status === "loading" || status === "success"}
								className='w-full rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'>
								{status === "loading" ? "Submitting..." : "Submit & Continue"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
