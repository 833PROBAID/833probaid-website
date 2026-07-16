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
			<div className='group flex flex-col items-center justify-center p-4 text-center sm:p-7 md:p-10 my-8 sm:my-12 rounded-3xl border-l-8 border-secondary transition-transform duration-300 ease-in-out hover:border-l-12 hover:translate-x-2'
				style={{
					boxShadow:
						"rgba(0, 0, 0, 0.4) 0px 8px 12px 0px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px",
				}}>
				<h1 className='font-anton text-3xl uppercase leading-tight text-primary group-hover:text-secondary sm:text-4xl md:text-5xl'>
					{withSuper(title)}
				</h1>
				<p className='font-montserrat mt-4 text-lg font-bold uppercase text-secondary group-hover:text-primary sm:mt-6 sm:text-xl md:text-2xl'>
					{withSuper(subtitle)}
				</p>
			</div>
			<div
				className='w-full my-8 sm:my-12 rounded-3xl'
				style={{
					boxShadow:
						"rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px 5px 12px 1px",
				}}>
				{svgMarkup ? (
					// eslint-disable-next-line react/no-danger
					<div className="rounded-3xl" style={{
						boxShadow:
						"rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px",
					}}>
						<div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
					</div>
				) : (
					<img src={bannerImage} alt={title} className='w-full' />
				)}
			</div>
		</div>
	);
}
