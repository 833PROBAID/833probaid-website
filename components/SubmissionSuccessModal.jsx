"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AnimatedText from "./AnimatedText";

const BRAND_SPLIT = /(833PROBAID®?)/g;
const IS_BRAND = /^833PROBAID®?$/;

/**
 * Renders copy with every "833PROBAID®" mention routed through <AnimatedText>,
 * so the ® lands as a true superscript (and the mark reads as the brand)
 * instead of sitting inline at full size.
 */
function withBrand(text, brandClassName = "font-semibold text-primaryDark") {
	return String(text)
		.split(BRAND_SPLIT)
		.filter((part) => part !== "")
		.map((part, i) =>
			IS_BRAND.test(part) ? (
				<AnimatedText key={i} text={part} className={brandClassName} top="0.35em" fontSize="28px" />
			) : (
				part
			)
		);
}

/**
 * Celebration dialog shown after a public intake form (Referral / Vendor) is
 * accepted by the API.
 *
 * Rendered through a portal on <body> so it is never clipped or mis-positioned
 * by the zoomed/transformed form canvas it is triggered from.
 */
export default function SubmissionSuccessModal({
	open,
	onClose,
	eyebrow = "833PROBAID®",
	title,
	paragraphs = [],
	footnote,
	phone = { display: "(833) PROBAID / (833) 776-2243", tel: "8337762243" },
	closeLabel = "Close",
}) {
	const [mounted, setMounted] = useState(false);
	const closeRef = useRef(null);
	const cardRef = useRef(null);

	useEffect(() => setMounted(true), []);

	// Esc to dismiss + scroll lock + keep focus inside the dialog.
	useEffect(() => {
		if (!open || typeof document === "undefined") return;

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
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
			document.removeEventListener("keydown", onKeyDown);
			clearTimeout(focusTimer);
			document.body.style.overflow = previousOverflow;
			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
		};
	}, [open, onClose]);

	if (!mounted || !open) return null;

	return createPortal(
		<div
			className="psm-root fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="psm-title"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose?.();
			}}
		>
			<style>{PSM_STYLES}</style>

			<div className="psm-backdrop absolute inset-0" />

			<div
				ref={cardRef}
				className="psm-card relative flex w-full max-w-[46rem] flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-[0_40px_120px_-20px_rgba(0,60,66,0.55)] ring-1 ring-black/5"
				style={{
					maxHeight: "calc(100dvh - 1.5rem)",
					fontFamily: "var(--font-poppins), sans-serif",
				}}
			>
				{/* ── Crest / header ─────────────────────────────────────────── */}
				<div className="psm-header relative shrink-0 overflow-hidden px-6 pt-6 pb-4 text-center sm:px-10">
					<span className="psm-aurora psm-aurora-1" />
					<span className="psm-aurora psm-aurora-2" />
					<span className="psm-shine" />

					<button
						ref={closeRef}
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="psm-x absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
					>
						<svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					</button>

					<div className="relative mx-auto flex h-20 w-20 items-center justify-center">
						<span className="psm-ring psm-ring-1" />
						<span className="psm-ring psm-ring-2" />
						<span className="psm-seal relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.35)]">
							<svg viewBox="0 0 52 52" className="h-10 w-10 sm:h-12 sm:w-12" fill="none">
								<path
									className="psm-check"
									d="M13 27.5 L22 36 L39 17"
									stroke="url(#psm-check-grad)"
									strokeWidth="5.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<defs>
									<linearGradient id="psm-check-grad" x1="10" y1="36" x2="40" y2="16" gradientUnits="userSpaceOnUse">
										<stop stopColor="#0097a7" />
										<stop offset="1" stopColor="#00838f" />
									</linearGradient>
								</defs>
							</svg>
						</span>
					</div>

					{eyebrow ? (
						<AnimatedText
							as="p"
							text={eyebrow}
							top="0.15em"
							className="psm-fade psm-d1 mt-5 font-montserrat text-[16px] font-black tracking-[0.34em] text-white/85 uppercase"
							fontSize="20px"
						/>
					) : null}

					<h2
						id="psm-title"
						className="psm-fade psm-d2 mt-2 font-montserrat text-[1.35rem] leading-[1.15] font-black tracking-wide text-white uppercase sm:text-[1.85rem]"
						style={{ textShadow: "0 2px 10px rgba(0,0,0,0.28)" }}
					>
						{withBrand(title, "text-white")}
					</h2>

					<span className="psm-fade psm-d3 mx-auto mt-4 block h-[3px] w-20 rounded-full bg-secondary/90" />
				</div>

				{/* Curved cut between header and body */}
				<svg
					className="-mt-14 block w-full shrink-0 text-white"
					viewBox="0 0 1440 90"
					preserveAspectRatio="none"
					aria-hidden="true"
					style={{ height: "56px" }}
				>
					<path fill="currentColor" d="M0 90V44c240 40 480 46 720 20S1200 8 1440 30v60z" />
				</svg>

				{/* ── Body ───────────────────────────────────────────────────── */}
				<div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 sm:px-10">
					<div className="space-y-3.5">
						{paragraphs.map((text, i) => (
							<p
								key={i}
								className={`psm-fade psm-d${Math.min(i + 4, 7)} text-[0.95rem] leading-relaxed text-slate-600 sm:text-base`}
							>
								{withBrand(text)}
							</p>
						))}
					</div>

					{footnote ? (
						<div className="psm-fade psm-d7 relative mt-4 overflow-hidden rounded-2xl border border-primary/20 bg-tealSoft/60 p-5 text-center sm:p-6">
							<span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary to-secondary" />
							{footnote.heading ? (
								<p className="font-montserrat text-[1rem] font-black tracking-[0.16em] text-primaryDark uppercase">
									{withBrand(footnote.heading, "text-primaryDark")}
								</p>
							) : null}
							{footnote.text ? (
								<p className="mt-2 text-[0.9rem] leading-relaxed text-slate-600 sm:text-[0.95rem]">
									{withBrand(footnote.text)}
								</p>
							) : null}
							{phone ? (
								<a
									href={`tel:${phone.tel}`}
									className="psm-phone mt-4 inline-flex items-center gap-2.5 rounded-xl bg-secondary px-5 py-3 font-montserrat text-[0.82rem] font-black tracking-wide text-white uppercase transition sm:text-[0.95rem]"
								>
									<img src="/svgs/phone-icon-white.svg" style={{ width: "20px", marginTop: "2px" }} alt="Phone" />
									{phone.display}
								</a>
							) : null}
						</div>
					) : null}
				</div>

				{/* ── Footer ─────────────────────────────────────────────────── */}
				<div className="shrink-0 px-6 pt-5 pb-6 sm:px-10">
					<button
						type="button"
						onClick={onClose}
						className="psm-cta w-full rounded-xl bg-gradient-to-r from-primary to-primaryDark px-6 py-3.5 font-montserrat text-sm font-black tracking-[0.12em] text-white uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
					>
						{closeLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}

const PSM_STYLES = `
.psm-backdrop {
  background: radial-gradient(120% 90% at 50% 0%, rgba(0,131,143,0.55) 0%, rgba(2,20,24,0.78) 55%, rgba(2,14,17,0.88) 100%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: psm-fade-in 320ms ease-out both;
}
.psm-card {
  animation: psm-pop 520ms cubic-bezier(0.22, 1.15, 0.36, 1) both;
}
.psm-header {
  background: linear-gradient(135deg, #00a7b8 0%, #0097a7 45%, #00727d 100%);
}
.psm-aurora {
  position: absolute;
  border-radius: 9999px;
  filter: blur(38px);
  opacity: 0.55;
  pointer-events: none;
}
.psm-aurora-1 {
  width: 18rem; height: 18rem;
  top: -8rem; left: -5rem;
  background: rgba(255,255,255,0.5);
  animation: psm-drift 9s ease-in-out infinite;
}
.psm-aurora-2 {
  width: 16rem; height: 16rem;
  bottom: -9rem; right: -4rem;
  background: rgba(254,119,2,0.45);
  animation: psm-drift 11s ease-in-out infinite reverse;
}
.psm-shine {
  position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.30) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: psm-sweep 2.6s ease-out 0.35s both;
  pointer-events: none;
}
.psm-x { background: rgba(255,255,255,0.16); }
.psm-x:hover { background: rgba(255,255,255,0.30); transform: rotate(90deg); }
.psm-x { transition: background 200ms ease, transform 300ms ease, color 200ms ease; }

.psm-seal { animation: psm-seal-in 620ms cubic-bezier(0.2, 1.4, 0.4, 1) 120ms both; }
.psm-ring {
  position: absolute;
  border-radius: 9999px;
  border: 2px solid rgba(255,255,255,0.55);
  inset: 0;
}
.psm-ring-1 { animation: psm-halo 2.4s ease-out 0.5s infinite; }
.psm-ring-2 { animation: psm-halo 2.4s ease-out 1.4s infinite; }

.psm-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: psm-draw 520ms cubic-bezier(0.65, 0, 0.35, 1) 430ms both;
}

.psm-fade { animation: psm-rise 560ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.psm-d1 { animation-delay: 260ms; }
.psm-d2 { animation-delay: 340ms; }
.psm-d3 { animation-delay: 420ms; }
.psm-d4 { animation-delay: 500ms; }
.psm-d5 { animation-delay: 570ms; }
.psm-d6 { animation-delay: 640ms; }
.psm-d7 { animation-delay: 710ms; }

.psm-phone { box-shadow: 0 8px 20px -6px rgba(254,119,2,0.75); }
.psm-phone:hover { transform: translateY(-2px); filter: brightness(1.06); }
.psm-cta { box-shadow: 0 10px 26px -10px rgba(0,151,167,0.9); }
.psm-cta:hover { transform: translateY(-2px); filter: brightness(1.06); }

@keyframes psm-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes psm-pop {
  0% { opacity: 0; transform: translateY(26px) scale(0.94); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes psm-seal-in {
  0% { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes psm-halo {
  0% { transform: scale(0.78); opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0; }
}
@keyframes psm-draw { to { stroke-dashoffset: 0; } }
@keyframes psm-rise {
  0% { opacity: 0; transform: translateY(14px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes psm-sweep {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}
@keyframes psm-drift {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(18px, 14px, 0) scale(1.12); }
}

@media (prefers-reduced-motion: reduce) {
  .psm-backdrop, .psm-card, .psm-seal, .psm-check, .psm-fade, .psm-shine,
  .psm-ring-1, .psm-ring-2, .psm-aurora-1, .psm-aurora-2 {
    animation: none !important;
  }
  .psm-check { stroke-dashoffset: 0; }
  .psm-shine { display: none; }
  .psm-fade { opacity: 1; transform: none; }
}
`;
