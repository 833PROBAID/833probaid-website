"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import newsletterSubscriptionsApi from "@/app/lib/api/newsletterSubscriptions";
import {
	formatUSPhone,
	isEmpty,
	isValidEmail,
	isValidUSPhone,
} from "@/app/utils/formValidation";
import AnimatedText from "./AnimatedText";
import CTAButton from "./CTAButton";

// How long the success state stays on screen before the modal closes itself.
const SUCCESS_CLOSE_DELAY = 5000;

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
	// Fields the user has interacted with — inline errors only show for these,
	// so nothing is red before the field has been typed in or blurred.
	const [touched, setTouched] = useState({});
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
	const [mounted, setMounted] = useState(false);
	const closeRef = useRef(null);
	const cardRef = useRef(null);
	const successTimerRef = useRef(null);
	const phoneRef = useRef(null);
	const phoneCaretRef = useRef(null);

	useEffect(() => setMounted(true), []);

	// Restore the caret after the reformatted phone value re-renders, so editing
	// in the middle of the number doesn't kick the cursor to the end.
	useLayoutEffect(() => {
		if (phoneCaretRef.current == null || !phoneRef.current) return;
		const pos = phoneCaretRef.current;
		phoneRef.current.setSelectionRange(pos, pos);
		phoneCaretRef.current = null;
	});

	// Drop any pending auto-close timer when the dialog goes away.
	useEffect(() => {
		if (isOpen) return;
		clearTimeout(successTimerRef.current);
	}, [isOpen]);

	useEffect(() => () => clearTimeout(successTimerRef.current), []);

	useEffect(() => {
		if (!isOpen) return;
		setSourceContext(getSourceContext());
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const prefilledEmail = String(initialEmail || "").trim();
		setFormData((current) => ({
			...current,
			email: prefilledEmail,
		}));
		// A pre-filled email comes from the footer input, so validate it right
		// away instead of waiting for the user to edit it.
		setTouched(prefilledEmail ? { email: true } : {});
		setStatus("idle");
		setError("");
	}, [initialEmail, isOpen]);

	// Esc to dismiss + scroll lock + keep focus inside the dialog.
	useEffect(() => {
		if (!isOpen || typeof document === "undefined") return;

		const previouslyFocused = document.activeElement;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const onKeyDown = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				onClose?.();
				return;
			}
			if (e.key !== "Tab") return;
			const focusables = cardRef.current?.querySelectorAll(
				'a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			if (!focusables?.length) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		const focusTimer = setTimeout(() => closeRef.current?.focus(), 350);

		return () => {
			setFormData({
				fullName: "",
				email: "",
				phone: "",
			})
			document.removeEventListener("keydown", onKeyDown);
			clearTimeout(focusTimer);
			document.body.style.overflow = previousOverflow;
			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
		};
	}, [isOpen, onClose]);

	// Same rules the vendor-partnership form uses (shared helpers), so an email
	// or phone accepted here is accepted there too.
	const fieldErrors = useMemo(() => {
		const errors = {};

		if (isEmpty(formData.fullName)) {
			errors.fullName = "Please enter your full name.";
		} else if (formData.fullName.trim().length < 2) {
			errors.fullName = "Please enter at least 2 characters.";
		}

		if (isEmpty(formData.phone)) {
			errors.phone = "Please enter your phone number.";
		} else if (!isValidUSPhone(formData.phone)) {
			errors.phone = "Please enter a valid 10-digit US phone number.";
		}

		if (isEmpty(formData.email)) {
			errors.email = "Please enter your email address.";
		} else if (!isValidEmail(formData.email)) {
			errors.email = "Please enter a valid email address.";
		}

		return errors;
	}, [formData]);

	const isValid = Object.keys(fieldErrors).length === 0;
	const errorFor = (field) => (touched[field] ? fieldErrors[field] || "" : "");

	const isDuplicateWarning = /already subscribed/i.test(error);

	const handleChange = (event) => {
		const { name, value } = event.target;
		let nextValue = value;

		if (name === "phone") {
			const { selectionStart } = event.target;
			const digitsBefore = value
				.slice(0, selectionStart ?? value.length)
				.replace(/\D/g, "").length;
			nextValue = formatUSPhone(value);

			// Caret goes just after the Nth digit (where N = digits before caret).
			let pos = 0;
			if (digitsBefore > 0) {
				let count = 0;
				pos = nextValue.length;
				for (let i = 0; i < nextValue.length; i++) {
					if (/\d/.test(nextValue[i])) count++;
					if (count >= digitsBefore) {
						pos = i + 1;
						break;
					}
				}
			}
			phoneCaretRef.current = pos;
		}

		setFormData((current) => ({ ...current, [name]: nextValue }));
		setTouched((current) =>
			current[name] ? current : { ...current, [name]: true },
		);
	};

	const handleBlur = (event) => {
		const { name } = event.target;
		setTouched((current) =>
			current[name] ? current : { ...current, [name]: true },
		);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (status === "loading") return;
		if (!isValid) {
			setTouched({ fullName: true, phone: true, email: true });
			return;
		}

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
			clearTimeout(successTimerRef.current);
			successTimerRef.current = setTimeout(() => {
				onSuccess?.(result.subscription);
				onClose?.();
				setFormData({ fullName: "", email: "", phone: "" });
				setTouched({});
			}, SUCCESS_CLOSE_DELAY);
		} catch (submitError) {
			setStatus("error");
			setError(submitError.message || "Submission failed. Please try again.");
		}
	};

	if (!mounted || !isOpen) return null;

	const inputClass =
		"nsm-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
	const invalidInputClass =
		"nsm-input w-full rounded-xl border border-red-500 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
	const inputClassFor = (field) =>
		errorFor(field) ? invalidInputClass : inputClass;
	const labelClass =
		"font-montserrat text-[0.72rem] font-black tracking-[0.14em] text-primaryDark uppercase";
	const fieldErrorClass = "text-[0.75rem] font-semibold text-red-600";

	return createPortal(
		<div
			className="nsm-root fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="nsm-title"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose?.();
			}}
		>
			<style>{NSM_STYLES}</style>

			<div className="nsm-backdrop absolute inset-0" />

			<form
				ref={cardRef}
				onSubmit={handleSubmit}
				className="nsm-card relative flex w-full max-w-[46rem] flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-[0_40px_120px_-20px_rgba(0,60,66,0.55)] ring-1 ring-black/5"
				style={{
					maxHeight: "calc(100dvh - 1.5rem)",
					fontFamily: "var(--font-poppins), sans-serif",
				}}
			>
				{/* ── Crest / header ─────────────────────────────────────────── */}
				<div className="nsm-header relative shrink-0 overflow-hidden px-6 pt-6 pb-4 text-center sm:px-10">
					<span className="nsm-aurora nsm-aurora-1" />
					<span className="nsm-aurora nsm-aurora-2" />
					<span className="nsm-shine" />

					<button
						ref={closeRef}
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="nsm-x absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
					>
						<svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					</button>

					<div className="relative mx-auto flex h-20 w-20 items-center justify-center">
						<span className="nsm-ring nsm-ring-1" />
						<span className="nsm-ring nsm-ring-2" />
						<span className="nsm-seal relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.35)]">
							<svg viewBox="0 0 52 52" className="h-9 w-9 sm:h-10 sm:w-10" fill="none">
								{status === "success" ? (
									<path
										className="nsm-draw-check"
										d="M13 27.5 L22 36 L39 17"
										stroke="url(#nsm-icon-grad)"
										strokeWidth="5.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								) : (
									<g className="nsm-bell" stroke="url(#nsm-icon-grad)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
										<path d="M26 9c-6.6 0-12 5.4-12 12v6.5c0 2.6-1 5-2.8 6.8-.7.7-.2 1.9.8 1.9h28c1 0 1.5-1.2.8-1.9A9.6 9.6 0 0 1 38 27.5V21c0-6.6-5.4-12-12-12z" />
										<path d="M26 9V5" />
										<path className="nsm-draw-clapper" d="M21.5 36.2a4.5 4.5 0 0 0 9 0" />
									</g>
								)}
								<defs>
									<linearGradient id="nsm-icon-grad" x1="10" y1="36" x2="40" y2="16" gradientUnits="userSpaceOnUse">
										<stop stopColor="#0097a7" />
										<stop offset="1" stopColor="#00838f" />
									</linearGradient>
								</defs>
							</svg>
						</span>
					</div>

					<AnimatedText
						as="p"
						text="833PROBAID®"
						top="0.15em"
						className="nsm-fade nsm-d1 mt-5 font-montserrat text-[16px] font-black tracking-[0.34em] text-white/85 uppercase"
						fontSize="20px"
					/>

					<h2
						id="nsm-title"
						className="nsm-fade nsm-d2 my-2 font-montserrat text-[1.35rem] leading-[1.15] font-black tracking-wide text-white uppercase sm:text-[1.85rem]"
					>
						Complete Your Subscription
					</h2>
					<p className="nsm-fade nsm-d4 text-center text-[0.95rem] leading-relaxed text-white sm:text-base">
						Fill in your details below. It only takes a few seconds.
					</p>

					<span className="nsm-fade nsm-d3 mx-auto mt-4 block h-[3px] w-20 rounded-full bg-secondary/90" />
				</div>

				{/* Curved cut between header and body */}
				<svg
					className="-mt-14 block w-full shrink-0"
					viewBox="0 0 1440 90"
					preserveAspectRatio="none"
					aria-hidden="true"
					style={{ height: "56px" }}
				>
					{/* Back wave in the brand secondary, front wave carries the body colour. */}
					<path fill="var(--color-secondary)" d="M0 90V30c240 40 480 46 720 20S1200 -6 1440 16v74z" />
					<path fill="#fff" d="M0 90V50c240 40 480 46 720 20S1200 14 1440 36v54z" />
				</svg>

				{/* ── Body ───────────────────────────────────────────────────── */}
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 sm:px-10">
					{entryMessage ? (
						<p className="nsm-fade nsm-d4 border-primary text-secondary mt-4 rounded-xl border px-3.5 py-2.5 text-sm font-bold">
							{entryMessage}
						</p>
					) : null}

					<div className="nsm-fade nsm-d5 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<label className="flex flex-col gap-1.5">
							<span className={labelClass}>Full Name *</span>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								onBlur={handleBlur}
								required
								aria-invalid={Boolean(errorFor("fullName"))}
								className={`${inputClassFor("fullName")} font-bold`}
							/>
							{errorFor("fullName") ? (
								<span className={fieldErrorClass}>{errorFor("fullName")}</span>
							) : null}
						</label>

						<label className="flex flex-col gap-1.5">
							<span className={labelClass}>Phone *</span>
							<div className="flex items-stretch">
								<span className="grid shrink-0 place-items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-3 text-sm font-bold text-primaryDark select-none">
									+1
								</span>
								<input
									ref={phoneRef}
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									onBlur={handleBlur}
									required
									inputMode="numeric"
									autoComplete="tel"
									placeholder="(555) 234-5678"
									aria-invalid={Boolean(errorFor("phone"))}
									className={`${inputClassFor("phone")} rounded-l-none font-bold placeholder:italic placeholder-secondary`}
								/>
							</div>
							{errorFor("phone") ? (
								<span className={fieldErrorClass}>{errorFor("phone")}</span>
							) : null}
						</label>
					</div>

					<label className="nsm-fade nsm-d6 mt-4 flex flex-col gap-1.5">
						<div className="flex items-center justify-between gap-3">
							<span className={labelClass}>Email *</span>
							<span className="text-[0.7rem] font-semibold tracking-wide text-primary">
								Auto-filled from footer
							</span>
						</div>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							onBlur={handleBlur}
							required
							autoComplete="email"
							placeholder="e.g. name@company.com"
							aria-invalid={Boolean(errorFor("email"))}
							className={`${inputClassFor("email")} font-bold placeholder:italic placeholder-secondary`}
						/>
						{errorFor("email") ? (
							<span className={fieldErrorClass}>{errorFor("email")}</span>
						) : null}
					</label>

					{status === "error" && error ? (
						<p
							className={`mt-4 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
								isDuplicateWarning
									? "border-secondary/50 bg-secondary/10 text-secondary border"
									: "border border-red-200 bg-red-50 text-red-700"
							}`}
						>
							{error}
						</p>
					) : null}

					{status === "success" ? (
						<div className="nsm-fade relative mt-4 overflow-hidden rounded-2xl border border-primary/20 bg-tealSoft/60 p-5 text-center sm:p-6">
							<span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary to-secondary" />
							<p className="font-montserrat text-[1rem] font-black tracking-[0.16em] text-primaryDark uppercase">
								You&apos;re Subscribed
							</p>
							<p className="mt-2 text-[0.9rem] leading-relaxed text-slate-600 sm:text-[0.95rem]">
								Thank you. Your subscription was submitted successfully.
							</p>
						</div>
					) : null}
				</div>

				{/* ── Footer ─────────────────────────────────────────────────── */}
				<div className="flex shrink-0 items-center gap-4 px-6 pt-5 pb-6 flex-row justify-end sm:px-10">
					<CTAButton
						label="Cancel"
						bg="#0097A7"
						icon={null}
						onClick={onClose}
						className="px-5 py-3 lg:px-6 lg:py-4"
						textClassName="text-[13px] lg:text-[16px]"
					/>
					<CTAButton
						label={
							status === "loading"
								? "Submitting..."
								: status === "success"
									? "Subscribed"
									: "Subscribe"
						}
						type="submit"
						disabled={!isValid || status === "loading" || status === "success"}
						className="px-5 py-2.5 disabled:opacity-60 lg:px-6 lg:py-3"
						textClassName="text-[13px] lg:text-[16px]"
						iconClassName="w-6 lg:w-8 h-6 lg:h-8"
					/>
				</div>
			</form>
		</div>,
		document.body
	);
}

const NSM_STYLES = `
.nsm-backdrop {
  background: radial-gradient(120% 90% at 50% 0%, rgba(0,131,143,0.55) 0%, rgba(2,20,24,0.78) 55%, rgba(2,14,17,0.88) 100%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: nsm-fade-in 320ms ease-out both;
}
.nsm-card {
  animation: nsm-pop 520ms cubic-bezier(0.22, 1.15, 0.36, 1) both;
}
.nsm-header {
  background: linear-gradient(135deg, #00a7b8 0%, #0097a7 45%, #00727d 100%);
}
.nsm-aurora {
  position: absolute;
  border-radius: 9999px;
  filter: blur(38px);
  opacity: 0.55;
  pointer-events: none;
}
.nsm-aurora-1 {
  width: 18rem; height: 18rem;
  top: -8rem; left: -5rem;
  background: rgba(255,255,255,0.5);
  animation: nsm-drift 9s ease-in-out infinite;
}
.nsm-aurora-2 {
  width: 16rem; height: 16rem;
  bottom: -9rem; right: -4rem;
  background: rgba(254,119,2,0.45);
  animation: nsm-drift 11s ease-in-out infinite reverse;
}
.nsm-shine {
  position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.30) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: nsm-sweep 2.6s ease-out 0.35s both;
  pointer-events: none;
}
.nsm-x { background: rgba(255,255,255,0.16); }
.nsm-x:hover { background: rgba(255,255,255,0.30); transform: rotate(90deg); }
.nsm-x { transition: background 200ms ease, transform 300ms ease, color 200ms ease; }

.nsm-seal { animation: nsm-seal-in 620ms cubic-bezier(0.2, 1.4, 0.4, 1) 120ms both; }
.nsm-ring {
  position: absolute;
  border-radius: 9999px;
  border: 2px solid rgba(255,255,255,0.55);
  inset: 0;
}
.nsm-ring-1 { animation: nsm-halo 2.4s ease-out 0.5s infinite; }
.nsm-ring-2 { animation: nsm-halo 2.4s ease-out 1.4s infinite; }

.nsm-bell {
  transform-origin: 26px 7px;
  animation: nsm-swing 2.8s ease-in-out 0.9s infinite;
}
.nsm-draw-clapper {
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  animation: nsm-draw 460ms cubic-bezier(0.65, 0, 0.35, 1) 480ms both;
}
.nsm-draw-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: nsm-draw 420ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

.nsm-fade { animation: nsm-rise 560ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.nsm-d1 {
	animation-delay: 260ms;
	text-shadow: 1px 1px 1.6px rgba(0,0,0,0.82), 0 0 6px rgba(255,255,255,0.25);
}
.nsm-d2 {
	animation-delay: 340ms;
	text-shadow: 1px 2px 1.6px rgba(0,0,0,0.82), 0 0 6px rgba(255,255,255,0.25);
}
.nsm-d3 { animation-delay: 420ms; }
.nsm-d4 { animation-delay: 500ms; }
.nsm-d5 { animation-delay: 570ms; }
.nsm-d6 { animation-delay: 640ms; }
.nsm-d7 { animation-delay: 710ms; }

@keyframes nsm-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes nsm-pop {
  0% { opacity: 0; transform: translateY(26px) scale(0.94); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes nsm-seal-in {
  0% { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes nsm-halo {
  0% { transform: scale(0.78); opacity: 1; border-width: 3px; }
  100% { transform: scale(1.35); opacity: 0; border-width: 3px; }
}
@keyframes nsm-draw { to { stroke-dashoffset: 0; } }
@keyframes nsm-swing {
  0%, 62%, 100% { transform: rotate(0deg); }
  68% { transform: rotate(11deg); }
  74% { transform: rotate(-9deg); }
  80% { transform: rotate(6deg); }
  86% { transform: rotate(-4deg); }
  92% { transform: rotate(2deg); }
}
@keyframes nsm-rise {
  0% { opacity: 0; transform: translateY(14px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes nsm-sweep {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}
@keyframes nsm-drift {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(18px, 14px, 0) scale(1.12); }
}
`;
