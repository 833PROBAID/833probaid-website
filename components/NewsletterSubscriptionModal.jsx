"use client";

import { useEffect, useMemo, useState } from "react";
import newsletterSubscriptionsApi from "@/app/lib/api/newsletterSubscriptions";

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

function getSourceContext() {
	if (typeof window === "undefined") {
		return {
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

	return {
		sourceType: hasNewsletterSignal ? "newsletter" : "website",
		sourceDetails: {
			source: explicitSource || params.get("utm_source") || "",
			medium: params.get("utm_medium") || "",
			campaign: params.get("utm_campaign") || "",
			term: params.get("utm_term") || "",
			content: params.get("utm_content") || "",
			referrer: document.referrer || "",
		},
	};
}

export default function NewsletterSubscriptionModal({
	isOpen,
	initialEmail,
	entryMessage = "",
	onClose,
	onSuccess,
}) {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
	});
	const [status, setStatus] = useState("idle");
	const [error, setError] = useState("");
	const [sourceContext, setSourceContext] = useState({
		sourceType: "website",
		sourceDetails: {
			source: "",
			medium: "",
			campaign: "",
			term: "",
			content: "",
			referrer: "",
		},
	});

	useEffect(() => {
		if (!isOpen) return;
		setSourceContext(getSourceContext());
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		setFormData((current) => ({
			...current,
			email: String(initialEmail || "").trim(),
		}));
		setStatus("idle");
		setError("");
	}, [initialEmail, isOpen]);

	useEffect(() => {
		if (!isOpen || typeof document === "undefined") return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	const isValid = useMemo(() => {
		return (
			formData.fullName.trim().length > 1 &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
			formData.phone.trim().length >= 7
		);
	}, [formData]);

	const isDuplicateWarning = /already subscribed/i.test(error);

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
			const pageUrl = typeof window !== "undefined" ? window.location.href : "";
			const result = await newsletterSubscriptionsApi.create({
				fullName: formData.fullName,
				email: formData.email,
				phone: formData.phone,
				capturePoint: "footer",
				pageUrl,
				sourceType: sourceContext.sourceType,
				sourceDetails: sourceContext.sourceDetails,
			});

			if (!result?.success) {
				throw new Error(result?.error || "Unable to submit subscription");
			}

			setStatus("success");
			setTimeout(() => {
				onSuccess?.(result.subscription);
				onClose?.();
				setFormData({ fullName: "", email: "", phone: "" });
			}, 700);
		} catch (submitError) {
			setStatus("error");
			setError(submitError.message || "Submission failed. Please try again.");
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-140 flex items-center justify-center bg-slate-950/72 p-3 backdrop-blur-sm sm:p-5'>
			<div className='w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl'>
				<div className='relative overflow-hidden bg-linear-to-r from-primary via-secondary to-primaryDark px-5 py-5 text-white sm:px-6 sm:py-6'>
					<div className='pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl' />
					<div className='pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-white/20 blur-xl' />

					<div className='relative flex items-start justify-between gap-3'>
						<div>
							<p className='text-xs font-semibold tracking-[0.2em] text-white/80 uppercase'>
								Newsletter Signup
							</p>
							<h3 className='mt-1 text-xl font-extrabold leading-tight sm:text-2xl'>
								Complete Your Subscription
							</h3>
							<p className='mt-1.5 text-sm text-white/90'>
								Fill in your details below. It only takes a few seconds.
							</p>
						</div>
						<button
							type='button'
							onClick={onClose}
							className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white transition-colors hover:bg-white/25'
							aria-label='Close'>
							X
						</button>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-4 bg-linear-to-b from-white to-slate-50 px-5 py-5 sm:px-6 sm:py-6'>
					{entryMessage ? (
						<p className='rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-800'>
							{entryMessage}
						</p>
					) : null}

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<label className='flex flex-col gap-1.5'>
							<span className='text-sm font-semibold text-slate-700'>Full Name *</span>
							<input
								type='text'
								name='fullName'
								value={formData.fullName}
								onChange={handleChange}
								required
								className='rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
							/>
						</label>

						<label className='flex flex-col gap-1.5'>
							<span className='text-sm font-semibold text-slate-700'>Phone *</span>
							<input
								type='tel'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								required
								className='rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
							/>
						</label>
					</div>

					<label className='flex flex-col gap-1.5'>
						<div className='flex items-center justify-between gap-3'>
							<span className='text-sm font-semibold text-slate-700'>Email *</span>
							<span className='text-xs font-semibold text-primary'>Auto-filled from footer</span>
						</div>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							required
							className='rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'
						/>
					</label>

					{status === "error" && error ? (
						<p
							className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
								isDuplicateWarning
									? "border border-amber-200 bg-amber-50 text-amber-800"
									: "border border-red-200 bg-red-50 text-red-700"
							}`}>
							{error}
						</p>
					) : null}

					{status === "success" ? (
						<p className='rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-700'>
							Thank you. Your subscription was submitted successfully.
						</p>
					) : null}

					<div className='flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end'>
						<button
							type='button'
							onClick={onClose}
							className='rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={!isValid || status === "loading" || status === "success"}
							className='rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60'>
							{status === "loading" ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
