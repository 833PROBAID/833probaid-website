"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import toolAccessApi from "@/app/lib/api/toolAccess";
import { markToolAccessGranted } from "@/app/lib/toolAccessGrant";
import {
	formatUSPhone,
	isValidEmail,
	isValidUSPhone,
} from "@/app/utils/formValidation";
import AnimatedText from "./AnimatedText";
import CTAButton from "./CTAButton";
import { NSM_STYLES } from "./NewsletterSubscriptionModal";

const EMPTY_FORM = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
};
const EMPTY_DIGITS = ["", "", "", "", "", ""];

export default function ToolAccessModal({
	isOpen,
	toolPage,
	onClose,
	onVerified,
}) {
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [step, setStep] = useState("details");
	const [form, setForm] = useState(EMPTY_FORM);
	const [digits, setDigits] = useState(EMPTY_DIGITS);
	const [status, setStatus] = useState("idle");
	const [error, setError] = useState("");
	const digitRefs = useRef([]);
	const attemptRef = useRef("");
	const verifyRef = useRef(null);
	const requestRef = useRef(0);
	const wasOpenRef = useRef(isOpen);

	const resetPopup = () => {
		requestRef.current += 1;
		attemptRef.current = "";
		setStep("details");
		setForm(EMPTY_FORM);
		setDigits(EMPTY_DIGITS);
		setStatus("idle");
		setError("");
	};

	const handleClose = () => {
		resetPopup();
		onClose?.();
	};

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (isOpen) {
			wasOpenRef.current = true;
			return;
		}
		if (!wasOpenRef.current) return;
		wasOpenRef.current = false;
		resetPopup();
	}, [isOpen]);

	useEffect(() => {
		if (step !== "code") return;
		digitRefs.current[0]?.focus();
	}, [step]);

	useEffect(() => {
		if (!isOpen || step !== "code") return;
		const currentCode = digits.join("");
		if (currentCode.length !== 6 || digits.some((digit) => !digit)) return;
		if (attemptRef.current === currentCode || !verifyRef.current) return;
		attemptRef.current = currentCode;
		verifyRef.current();
	}, [digits, isOpen, step]);

	useEffect(() => {
		if (!isOpen || typeof document === "undefined") return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	if (!mounted || !isOpen) return null;

	const email = form.email.trim().toLowerCase();
	const detailsValid =
		form.firstName.trim().length >= 2 &&
		form.lastName.trim().length >= 2 &&
		isValidEmail(email) &&
		isValidUSPhone(form.phone);

	const updateField = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({
			...current,
			[name]: name === "phone" ? formatUSPhone(value) : value,
		}));
		if (error) setError("");
	};

	const sendCode = async (event) => {
		event?.preventDefault();
		if (!detailsValid || status === "loading") return;
		const requestId = requestRef.current;
		setStatus("loading");
		setError("");
		try {
			await toolAccessApi.requestCode({
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				email,
				phone: form.phone,
				toolPage,
				pageUrl: window.location.href,
			});
			if (requestId !== requestRef.current) return;
			attemptRef.current = "";
			setDigits(EMPTY_DIGITS);
			setStep("code");
			setStatus("idle");
		} catch (requestError) {
			if (requestId !== requestRef.current) return;
			setStatus("error");
			setError(requestError.message || "Unable to send the verification code.");
		}
	};

	const code = digits.join("");

	const writeDigits = (index, raw) => {
		const cleaned = String(raw || "").replace(/\D/g, "");
		setDigits((current) => {
			const next = [...current];
			if (!cleaned) {
				next[index] = "";
				return next;
			}
			if (cleaned.length > 1) {
				const pasted = cleaned.slice(0, 6).split("");
				for (let slot = 0; slot < 6; slot += 1) next[slot] = pasted[slot] || "";
				return next;
			}
			next[index] = cleaned;
			return next;
		});
		if (cleaned.length > 1) {
			digitRefs.current[Math.min(cleaned.length, 5)]?.focus();
		} else if (cleaned && index < 5) {
			digitRefs.current[index + 1]?.focus();
		}
		if (error) setError("");
	};

	const verifyCode = async (event) => {
		event?.preventDefault();
		if (status === "loading") return;
		const currentCode = digits.join("").trim();
		if (currentCode.length !== 6) return;
		const requestId = requestRef.current;
		setStatus("loading");
		setError("");
		try {
			await toolAccessApi.verifyCode({ email, code: currentCode });
			if (requestId !== requestRef.current) return;
			markToolAccessGranted();
			setStatus("idle");
			onVerified?.();
			const path = `/${String(toolPage || "").replace(/^\/+/, "").split("/")[0]}`;
			if (toolPage && window.location.pathname !== path) {
				router.push(path);
			}
		} catch (verifyError) {
			if (requestId !== requestRef.current) return;
			setStatus("error");
			setError(verifyError.message || "That code is not valid.");
		}
	};

	verifyRef.current = verifyCode;

	const inputClass =
		"nsm-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
	const labelClass =
		"font-montserrat text-[0.72rem] font-black tracking-[0.14em] text-primaryDark uppercase";

	return createPortal(
		<div
			className="nsm-root fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="tool-access-title"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) handleClose();
			}}
		>
			<style>{NSM_STYLES}</style>
			<div className="nsm-backdrop absolute inset-0" onMouseDown={handleClose} />
			<form
				onSubmit={step === "details" ? sendCode : verifyCode}
				className="nsm-card relative flex w-full max-w-[46rem] flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-[0_40px_120px_-20px_rgba(0,60,66,0.55)] ring-1 ring-black/5"
				style={{
					maxHeight: "calc(100dvh - 1.5rem)",
					fontFamily: "var(--font-poppins), sans-serif",
				}}
			>
				<div className="nsm-header relative shrink-0 overflow-hidden px-6 pt-6 pb-4 text-center sm:px-10">
					<span className="nsm-aurora nsm-aurora-1" />
					<span className="nsm-aurora nsm-aurora-2" />
					<span className="nsm-shine" />
					<button
						type="button"
						onClick={handleClose}
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
								<g className="nsm-bell" stroke="url(#tool-access-icon-grad)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
									<path d="M26 9c-6.6 0-12 5.4-12 12v6.5c0 2.6-1 5-2.8 6.8-.7.7-.2 1.9.8 1.9h28c1 0 1.5-1.2.8-1.9A9.6 9.6 0 0 1 38 27.5V21c0-6.6-5.4-12-12-12z" />
									<path d="M26 9V5" />
									<path className="nsm-draw-clapper" d="M21.5 36.2a4.5 4.5 0 0 0 9 0" />
								</g>
								<defs>
									<linearGradient id="tool-access-icon-grad" x1="10" y1="36" x2="40" y2="16" gradientUnits="userSpaceOnUse">
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
						id="tool-access-title"
						className="nsm-fade nsm-d2 my-2 font-montserrat text-[1.35rem] leading-[1.15] font-black tracking-wide text-white uppercase sm:text-[1.85rem]"
					>
						Tool Access
					</h2>
					<p className="nsm-fade nsm-d4 text-center text-[0.95rem] leading-relaxed text-white sm:text-base">
						{step === "details"
							? "Fill in your details below. It only takes a few seconds."
							: `Enter the verification code sent to ${email}.`}
					</p>
					<span className="nsm-fade nsm-d3 mx-auto mt-4 block h-[3px] w-20 rounded-full bg-secondary/90" />
				</div>
				<svg
					className="-mt-14 block w-full shrink-0"
					viewBox="0 0 1440 90"
					preserveAspectRatio="none"
					aria-hidden="true"
					style={{ height: "56px" }}
				>
					<path fill="var(--color-secondary)" d="M0 90V30c240 40 480 46 720 20S1200 -6 1440 16v74z" />
					<path fill="#fff" d="M0 90V50c240 40 480 46 720 20S1200 14 1440 36v54z" />
				</svg>
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 sm:px-10">
					{step === "details" ? (
						<>
							<div className="nsm-fade nsm-d5 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<label className="flex flex-col gap-1.5">
									<span className={labelClass}>First Name *</span>
									<input
										name="firstName"
										value={form.firstName}
										onChange={updateField}
										autoComplete="given-name"
										required
										className={`${inputClass} font-bold`}
									/>
								</label>
								<label className="flex flex-col gap-1.5">
									<span className={labelClass}>Last Name *</span>
									<input
										name="lastName"
										value={form.lastName}
										onChange={updateField}
										autoComplete="family-name"
										required
										className={`${inputClass} font-bold`}
									/>
								</label>
							</div>
							<label className="nsm-fade nsm-d6 mt-4 flex flex-col gap-1.5">
								<span className={labelClass}>Email *</span>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={updateField}
									autoComplete="email"
									placeholder="e.g. name@company.com"
									required
									className={`${inputClass} font-bold placeholder:italic placeholder-secondary`}
								/>
							</label>
							<label className="mt-4 flex flex-col gap-1.5">
								<span className={labelClass}>Phone *</span>
								<div className="flex items-stretch">
									<span className="grid shrink-0 place-items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-3 text-sm font-bold text-primaryDark select-none">
										+1
									</span>
									<input
										type="tel"
										name="phone"
										value={form.phone}
										onChange={updateField}
										autoComplete="tel"
										inputMode="numeric"
										placeholder="(555) 234-5678"
										required
										className={`${inputClass} rounded-l-none font-bold placeholder:italic placeholder-secondary`}
									/>
								</div>
							</label>
						</>
					) : (
						<div className="mt-6 mb-2 text-center">
							<p className="font-montserrat text-[1.05rem] font-bold text-slate-800">
								Enter the 6-digit code sent to {email}
							</p>
							<div className="mt-6 flex justify-center gap-2 sm:gap-3">
								{digits.map((digit, index) => (
									<input
										key={index}
										ref={(node) => {
											digitRefs.current[index] = node;
										}}
										value={digit}
										onChange={(event) => writeDigits(index, event.target.value)}
										onKeyDown={(event) => {
											if (event.key === "Backspace" && !digit && index > 0) {
												digitRefs.current[index - 1]?.focus();
											}
										}}
										onPaste={(event) => {
											event.preventDefault();
											writeDigits(0, event.clipboardData.getData("text"));
										}}
										inputMode="numeric"
										autoComplete={index === 0 ? "one-time-code" : "off"}
										aria-label={`Digit ${index + 1}`}
										maxLength={index === 0 ? 6 : 1}
										className="h-16 w-12 rounded-2xl border-2 border-primary bg-white text-center text-3xl font-black text-primary outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 sm:h-[4.5rem] sm:w-14"
									/>
								))}
							</div>
							<button
								type="button"
								onClick={sendCode}
								disabled={status === "loading"}
								className="mt-5 text-sm font-bold text-primary underline"
							>
								Resend code
							</button>
						</div>
					)}
					{error ? (
						<p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-700">
							{error}
						</p>
					) : null}
				</div>
				<div className="flex shrink-0 items-center justify-end gap-4 px-6 pt-5 pb-6 sm:px-10">
					<CTAButton
						label="Cancel"
						bg="#0097A7"
						icon={null}
						onClick={handleClose}
						className="px-5 py-3 lg:px-6 lg:py-4"
						textClassName="text-[13px] lg:text-[16px]"
					/>
					<CTAButton
						label={
							status === "loading"
								? "Please wait..."
								: step === "details"
									? "Send Code"
									: "Verify"
						}
						type="submit"
						disabled={
							status === "loading" ||
							(step === "details" ? !detailsValid : code.length !== 6 || digits.some((digit) => !digit))
						}
						className="px-5 py-2.5 disabled:opacity-60 lg:px-6 lg:py-3"
						textClassName="text-[13px] lg:text-[16px]"
						iconClassName="h-6 w-6 lg:h-8 lg:w-8"
					/>
				</div>
			</form>
		</div>,
		document.body,
	);
}
