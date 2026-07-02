"use client";

import { useEffect, useState } from "react";

function withSuper(text) {
	if (!text?.includes("®")) return text;
	const [before, after] = text.split("®");
	return (
		<>
			{before}
			<span
				style={{
					verticalAlign: "super",
					fontSize: "0.9em",
					lineHeight: "0",
				}}>
				®
			</span>
			{after}
		</>
	);
}

export default function BooksHero({ bannerImage, title, subtitle }) {
	const [svgMarkup, setSvgMarkup] = useState("");

	// The decorative border SVG is large (embedded images), so it lives as a
	// static asset in /public instead of being imported as a JS module — that
	// keeps it out of the serverless bundle. Fetch it and inject the banner URL.
	useEffect(() => {
		let active = true;
		fetch("/home-border.svg")
			.then((res) => res.text())
			.then((raw) => {
				if (!active) return;
				const safe = (bannerImage || "").replace(/"/g, "&quot;");
				setSvgMarkup(raw.replaceAll("__BANNER_IMAGE__", safe));
			})
			.catch(() => active && setSvgMarkup(""));
		return () => {
			active = false;
		};
	}, [bannerImage]);

	return (
		<div>
			<div className='flex flex-col items-center justify-center p-4 text-center sm:p-7 md:p-10 my-8 sm:my-12 border-4 rounded-3xl border-l-18 border-secondary transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50'>
				<h1 className='font-anton text-3xl uppercase leading-tight text-primary hover:text-secondary sm:text-4xl md:text-5xl'>
					{withSuper(title)}
				</h1>
				<p className='font-montserrat mt-4 text-lg font-bold uppercase text-secondary hover:text-primary sm:mt-6 sm:text-xl md:text-2xl'>
					{withSuper(subtitle)}
				</p>
			</div>
			<div className='w-full my-8 sm:my-12 rounded-3xl shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50'>
				{svgMarkup ? (
					// eslint-disable-next-line react/no-danger
					<div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
				) : (
					<img src={bannerImage} alt={title} className='w-full' />
				)}
			</div>
		</div>
	);
}
