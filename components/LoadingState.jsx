"use client";

import React from "react";

function BrandLogo({ size = "md" }) {
	const logoClass =
		size === "sm"
			? "h-12 w-auto"
			: size === "lg"
				? "h-16 sm:h-20 w-auto"
				: "h-14 sm:h-16 w-auto";

	return (
		<img
			src='/images/footer-logo.png'
			alt='833PROBAID'
			className={`mx-auto ${logoClass} drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]`}
			loading='eager'
			decoding='async'
		/>
	);
}

function RingSpinner({ size = "md" }) {
	const sizeClass =
		size === "sm"
			? "h-14 w-14"
			: size === "lg"
				? "h-20 w-20 sm:h-24 sm:w-24"
				: "h-16 w-16 sm:h-20 sm:w-20";

	const outerBorder = size === "sm" ? "border-[3px]" : "border-4";
	const innerBorder = size === "sm" ? "border-2" : "border-[3px]";

	return (
		<div className={`relative mx-auto ${sizeClass}`} role='status' aria-label='Loading'>
			<div className={`absolute inset-0 rounded-full ${outerBorder} border-primary/20`} />
			<div
				className={`absolute inset-0 rounded-full ${outerBorder} border-transparent border-t-primary border-r-secondary animate-spin motion-reduce:animate-none`}
			/>
			<div
				className={`absolute inset-[20%] rounded-full ${innerBorder} border-transparent border-b-primary/70 border-l-secondary/70 animate-spin motion-reduce:animate-none`}
				style={{ animationDuration: "1.7s" }}
			/>
		</div>
	);
}

function LoadingPulseDots() {
	const dotClass = "h-2.5 w-2.5 rounded-full bg-primary";

	return (
		<div className='mt-4 flex items-center justify-center gap-2' aria-hidden='true'>
			<span className={`${dotClass} animate-bounce`} style={{ animationDelay: "0ms" }} />
			<span
				className={`${dotClass} animate-bounce bg-secondary`}
				style={{ animationDelay: "130ms" }}
			/>
			<span className={`${dotClass} animate-bounce`} style={{ animationDelay: "260ms" }} />
		</div>
	);
}

function LoadingShell({ children, compact = false }) {
	return (
		<div
			className={`w-full rounded-3xl border border-primary/20 bg-white/85 backdrop-blur-sm ${
				compact ? "max-w-2xl p-4 sm:p-5" : "max-w-xl p-5 sm:p-7"
			} text-center shadow-[0_20px_45px_rgba(0,0,0,0.12)]`}
			role='status'
			aria-live='polite'>
			{children}
		</div>
	);
}

export function PageLoading({ title = "Loading", message }) {
	return (
		<div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(0,151,167,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(254,119,2,0.18),transparent_38%),linear-gradient(180deg,#f8fbfc_0%,#eef5f7_100%)] px-4 py-10 sm:py-16'>
			<LoadingShell>
				<BrandLogo size='lg' />
				<div className='mt-4'>
					<RingSpinner size='lg' />
				</div>
				<h2 className='mt-4 font-anton text-xl sm:text-2xl uppercase tracking-wide text-primary'>
					{title}
				</h2>
				{message ? (
					<p className='mt-2 font-montserrat text-md text-secondary wrap-break-word'>
						{message}
					</p>
				) : null}
				<LoadingPulseDots />
				<span className='sr-only'>Loading…</span>
			</LoadingShell>
		</div>
	);
}

export function SectionLoading({ title = "Loading", message, size = "md" }) {
	return (
		<div className='flex w-full items-center justify-center px-4 py-8 sm:py-12'>
			<LoadingShell compact>
				<BrandLogo size='sm' />
				<div className='mt-3'>
					<RingSpinner size={size} />
				</div>
				<p className='mt-3 font-anton text-lg sm:text-xl uppercase tracking-wide text-primary'>
					{title}
				</p>
				{message ? (
					<p className='mt-1 font-montserrat text-md text-secondary wrap-break-word'>
						{message}
					</p>
				) : null}
				<LoadingPulseDots />
				<span className='sr-only'>Loading…</span>
			</LoadingShell>
		</div>
	);
}
