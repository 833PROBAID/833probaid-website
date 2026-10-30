"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import newsletterSubscriptionsApi from "@/app/lib/api/newsletterSubscriptions";
import { formatUSPhone, isValidEmail, isValidUSPhone } from "@/app/utils/formValidation";
import CTAButton from "./CTAButton";

// ---------------------------------------------------------------------------
// 833PROBAID® newsletter pop-up — same look as the tool-access pop-up.
//   form    → first name, last name, phone, email
//   success → "Welcome to the 833PROBAID® family"
// Saving (dashboard + Constant Contact) is unchanged: newsletterSubscriptionsApi.create
// ---------------------------------------------------------------------------

const TEAL = "#0097A7";
const PHONE_HREF = "tel:+18337762243";

const NEWSLETTER_SIGNAL = /(newsletter|email|mailchimp|constantcontact|klaviyo|convertkit)/i;
const NEWSLETTER_QUERY_KEYS = ["source", "from", "origin", "ref", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "campaign", "channel"];

function getSourceContext() {
	const blank = { source: "", medium: "", campaign: "", term: "", content: "", referrer: "" };
	if (typeof window === "undefined") return { sourceType: "website", sourceDetails: blank };
	const params = new URLSearchParams(window.location.search);
	const explicitSource = params.get("source") || params.get("from") || params.get("origin") || params.get("ref") || params.get("utm_source") || "";
	const hasNewsletterSignal = NEWSLETTER_QUERY_KEYS.some((k) => NEWSLETTER_SIGNAL.test(String(params.get(k) || "")));
	return {
		sourceType: hasNewsletterSignal ? "newsletter" : "website",
		sourceDetails: {
			source: explicitSource,
			medium: params.get("utm_medium") || "",
			campaign: params.get("utm_campaign") || "",
			term: params.get("utm_term") || "",
			content: params.get("utm_content") || "",
			referrer: document.referrer || "",
		},
	};
}

const EMPTY = { firstName: "", lastName: "", phone: "", email: "" };
const lettersOnly = (v) => v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' .-]/g, "").replace(/\s{2,}/g, " ");

// Soft two-note "ding" on success (plays only right after the visitor clicks Subscribe)
function ding() {
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		[
			[880, 0],
			[1318.5, 0.14],
		].forEach(([hz, at]) => {
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = "sine";
			o.frequency.value = hz;
			g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
			g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + at + 0.02);
			g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.9);
			o.connect(g).connect(ctx.destination);
			o.start(ctx.currentTime + at);
			o.stop(ctx.currentTime + at + 1);
		});
		setTimeout(() => ctx.close?.(), 1500);
	} catch {
		/* sound is optional */
	}
}

const Brand = () => (
	<span style={{ color: TEAL, fontWeight: 800 }}>
		833PROBAID<sup style={{ fontSize: ".6em" }}>®</sup>
	</span>
);

export default function NewsletterSubscriptionModal({ isOpen, initialEmail, entryMessage = "", onClose, onSuccess }) {
	const [mounted, setMounted] = useState(false);
	const [step, setStep] = useState("form");
	const [f, setF] = useState(EMPTY);
	const [err, setErr] = useState({});
	const [msg, setMsg] = useState("");
	const [busy, setBusy] = useState(false);
	const honey = useRef(null);
	const firstRef = useRef(null);
	const openedAt = useRef(0);

	useEffect(() => setMounted(true), []);

	// Fresh form each time it opens; footer email carried in
	useEffect(() => {
		if (!isOpen) return;
		setStep("form");
		openedAt.current = Date.now();
		setF({ ...EMPTY, email: String(initialEmail || "").trim() });
		setErr({});
		setMsg("");
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const t = setTimeout(() => firstRef.current?.focus(), 300);
		const onKey = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			clearTimeout(t);
			document.removeEventListener("keydown", onKey);
		};
	}, [isOpen, initialEmail, onClose]);

	if (!mounted || !isOpen) return null;

	const set = (k, fn) => (e) => {
		const v = fn ? fn(e.target.value) : e.target.value;
		setF((s) => ({ ...s, [k]: v }));
		setErr((s) => ({ ...s, [k]: "" }));
		setMsg("");
	};

	const submit = async () => {
		const e = {};
		if (f.firstName.trim().length < 1) e.firstName = "Enter your first name.";
		if (f.lastName.trim().length < 1) e.lastName = "Enter your last name.";
		if (!isValidUSPhone(f.phone) || f.phone.replace(/\D/g, "").slice(3, 6) === "555" || /^(\d)\1{9}$/.test(f.phone.replace(/\D/g, ""))) e.phone = "Enter a real 10-digit US phone number.";
		if (!isValidEmail(f.email)) e.email = "Enter a valid email address.";
		setErr(e);
		if (Object.keys(e).length || busy) return;

		// Bots fill the hidden field — pretend it worked, save nothing
		if (honey.current?.value) return setStep("success");

		setBusy(true);
		setMsg("");
		try {
			const ctx = getSourceContext();
			const result = await newsletterSubscriptionsApi.create({
				fullName: `${f.firstName.trim()} ${f.lastName.trim()}`,
				firstName: f.firstName.trim(),
				lastName: f.lastName.trim(),
				email: f.email.trim().toLowerCase(),
				phone: f.phone,
				capturePoint: "footer",
				pageUrl: window.location.href,
				sourceType: ctx.sourceType,
				sourceDetails: ctx.sourceDetails,
				website: honey.current?.value || "",
				startedAt: openedAt.current,
			});
			if (!result?.success) throw new Error(result?.error || "We couldn’t subscribe you right now. Please try again.");
			setStep("success");
			ding();
			onSuccess?.(result.subscription);
		} catch (x) {
			const text = x?.message || "";
			if (/already subscribed/i.test(text)) setMsg("already");
			else setMsg(text || "We couldn’t subscribe you right now. Please try again.");
		} finally {
			setBusy(false);
		}
	};

	const fld =
		"h-[52px] w-full rounded-[14px] border-2 bg-white px-4 font-poppins text-base font-bold normal-case tracking-normal text-[#FD7702] outline-none placeholder:font-bold placeholder:italic placeholder:text-[#FD7702] focus:ring-[3px] focus:ring-[#FD7702]/35 focus:placeholder:text-transparent";
	const bc = (k) => (err[k] ? "border-[#E51B23]" : "border-[#0097A7]");
	const lbl = "flex flex-col gap-2 font-montserrat text-xs font-extrabold uppercase tracking-[0.14em] text-[#007a87]";
	const errTxt = "font-montserrat text-[13px] font-bold normal-case tracking-normal text-[#E51B23]";
	const fine = "m-0 font-montserrat text-sm font-semibold leading-relaxed text-gray-700";
	const btnText = "text-[13px] leading-tight min-[400px]:text-[15px]";
	const success = step === "success";

	return createPortal(
		<div
			className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-[#0d3f46]/80 px-3 py-6 backdrop-blur-sm sm:py-10"
			role="dialog"
			aria-modal="true"
			aria-labelledby="nl-title"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose?.();
			}}
		>
			<style>{`
				@keyframes nlWave{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.75);opacity:0}}
				.nl-ic::before,.nl-ic::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(255,255,255,.55);animation:nlWave 2.4s ease-out infinite;pointer-events:none}
				.nl-ic::after{animation-delay:1.2s}
				@keyframes nlRing{0%,100%{transform:rotate(0)}10%{transform:rotate(16deg)}20%{transform:rotate(-14deg)}30%{transform:rotate(11deg)}40%{transform:rotate(-8deg)}50%{transform:rotate(5deg)}60%{transform:rotate(-3deg)}70%{transform:rotate(0)}}
				.nl-ring{transform-origin:50% 8%;animation:nlRing 1.6s ease-in-out .1s 2}
				@keyframes nlPop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
				.nl-pop{animation:nlPop .45s cubic-bezier(.2,1.4,.4,1) .35s both}
				.nl-seesaw > .nl-bob{display:inline-flex;animation:floatBounce 2s ease-in-out infinite}
				.nl-seesaw > .nl-bob + .nl-bob{animation-delay:-1s}
				.nl-seesaw .nl-bob > button{animation:none !important}
			`}</style>
			<div className="my-auto w-full max-w-[680px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
				<div className="relative px-6 pt-9 pb-7 text-center text-white" style={{ background: "linear-gradient(160deg,#3fbcc8 0%,#0097A7 45%,#00737f 100%)" }}>
					<button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					</button>
					<div className="nl-ic relative mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.28)]">
						{success ? (
							<span className="nl-ring relative inline-flex">
								<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
									<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
								</svg>
								<span className="nl-pop absolute -right-2.5 -bottom-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2E7D32] ring-2 ring-white">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
										<path d="M5 12.5l4.5 4.5L19 7" />
									</svg>
								</span>
							</span>
						) : (
							<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
								<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
							</svg>
						)}
					</div>
					<div className="mt-[18px] inline-block rounded-full bg-white px-4 py-1.5 font-montserrat text-[17px] font-extrabold tracking-[0.12em] text-[#0097A7]">
						833PROBAID<sup className="text-[.6em]">®</sup>
					</div>
					<h2 id="nl-title" className="mt-3.5 font-montserrat text-[clamp(24px,6vw,34px)] leading-[1.15] font-black uppercase [text-shadow:0_3px_0_rgba(0,0,0,0.25)]">
						{success ? "You’re Subscribed" : "Join Our Newsletter"}
					</h2>
					<p className="mt-2.5 font-montserrat text-base font-semibold">
						{success ? "Thank you for joining us." : "Probate, trust & conservatorship real estate news — straight to your inbox."}
					</p>
					<div className="mx-auto mt-[18px] h-1 w-[120px] rounded-sm bg-[#FD7702]" />
				</div>

				{!success ? (
					<form
						className="flex flex-col gap-5 px-[clamp(16px,5vw,40px)] pt-7 pb-9"
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
						noValidate
					>
						{entryMessage ? <p className="m-0 rounded-[14px] border-2 border-[#0097A7] bg-[#f2fafb] px-4 py-3 font-montserrat text-[15px] font-bold text-[#FD7702]">{entryMessage}</p> : null}
						<input ref={honey} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<label className={lbl}>
								First name *
								<input ref={firstRef} className={`${fld} ${bc("firstName")}`} value={f.firstName} onChange={set("firstName", lettersOnly)} autoComplete="given-name" placeholder="e.g. John" maxLength={70} />
								{err.firstName ? <span className={errTxt}>{err.firstName}</span> : null}
							</label>
							<label className={lbl}>
								Last name *
								<input className={`${fld} ${bc("lastName")}`} value={f.lastName} onChange={set("lastName", lettersOnly)} autoComplete="family-name" placeholder="e.g. Doe" maxLength={70} />
								{err.lastName ? <span className={errTxt}>{err.lastName}</span> : null}
							</label>
							<label className={lbl}>
								Phone *
								<span className="flex items-stretch">
									<span className="flex items-center rounded-l-[14px] border-2 border-r-0 border-[#0097A7] bg-[#f2fafb] px-3.5 font-poppins text-base font-bold tracking-normal text-[#00727e]">+1</span>
									<input className={`${fld} ${bc("phone")} rounded-l-none`} value={f.phone} onChange={set("phone", formatUSPhone)} inputMode="tel" autoComplete="tel-national" placeholder="(555) 234-5678" />
								</span>
								{err.phone ? <span className={errTxt}>{err.phone}</span> : null}
							</label>
							<label className={lbl}>
								Email *
								<input className={`${fld} ${bc("email")}`} value={f.email} onChange={set("email")} type="email" autoComplete="email" placeholder="e.g. name@email.com" maxLength={180} />
								{err.email ? <span className={errTxt}>{err.email}</span> : null}
							</label>
						</div>
						{msg === "already" ? (
							<p className="m-0 rounded-[14px] border-2 border-[#0097A7] bg-[#f2fafb] px-4 py-3.5 font-montserrat text-[15px] font-bold text-[#0097A7]">
								You’re already part of the <Brand /> family — this email is already subscribed.
							</p>
						) : msg ? (
							<p className="m-0 rounded-[14px] border-2 border-[#E51B23] bg-[#fdeaea] px-4 py-3.5 font-montserrat text-[15px] font-bold text-[#b3121a]">{msg}</p>
						) : null}
						<p className={fine}>
							By subscribing you agree to receive emails from <Brand />. Unsubscribe anytime. See our{" "}
							<a href="/terms" className="font-bold text-[#0097A7] underline">
								Website Terms of Use, Privacy Policy &amp; Disclosures
							</a>
							.
						</p>
						<div className="nl-seesaw mt-[7px] flex flex-wrap items-center justify-end gap-4">
							<span className="nl-bob"><CTAButton type="button" label="Cancel" bg={TEAL} icon={null} onClick={onClose} className="min-h-[52px] justify-center px-5 py-2" textClassName={btnText} /></span>
							<span className="nl-bob"><CTAButton type="submit" label={busy ? "Please wait…" : "Subscribe"} disabled={busy} className="min-h-[52px] justify-center px-5 py-2 disabled:opacity-60" textClassName={btnText} iconClassName="h-7 w-7" /></span>
						</div>
					</form>
				) : (
					<div className="flex flex-col gap-4 px-[clamp(16px,5vw,40px)] pt-8 pb-9">
						<p className="m-0 font-montserrat text-2xl font-black text-[#0097A7]">
							Welcome to the 833PROBAID<sup className="text-[.6em]">®</sup> family{f.firstName ? `, ${f.firstName.trim()}` : ""}!
						</p>
						<p className={`${fine} text-base`}>
							You’ll receive our newsletter with practical updates on probate, trust and conservatorship real estate — from <Brand />, your trusted probate real estate team.
						</p>
						<p className={`${fine} text-base`}>
							Questions about a property in an estate, trust or conservatorship? Call us anytime — we’re always here to help.
							<a href={PHONE_HREF} className="mt-3 block font-bold whitespace-nowrap text-[#FD7702] no-underline">
								(833) PROBAID — (833) 776-2243
							</a>
						</p>
						<div className="nl-seesaw mt-[21px] flex flex-wrap items-center justify-end gap-4">
							<span className="nl-bob"><CTAButton
								type="button"
								label="Call (833) PROBAID"
								bg={TEAL}
								onClick={() => {
									window.location.href = PHONE_HREF;
								}}
								className="min-h-[52px] justify-center px-5 py-2"
								textClassName={btnText}
								iconClassName="h-7 w-7"
							/></span>
							<span className="nl-bob"><CTAButton type="button" label="Done" onClick={onClose} className="min-h-[52px] justify-center px-5 py-2" textClassName={btnText} iconClassName="h-7 w-7" /></span>
						</div>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}

// Kept for any other file that still imports it
export const NSM_STYLES = ``;
