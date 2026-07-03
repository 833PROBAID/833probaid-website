"use client";

import { useEffect, useState } from "react";

/**
 * Renders the decorative `home-border.svg` frame with `imageSrc` injected into
 * its image area. The SVG is large (embedded images), so it's a static asset in
 * /public instead of a JS module — we fetch it and swap the `__BANNER_IMAGE__`
 * token at runtime, keeping it out of the serverless bundle.
 */
export default function HomeBorderImage({
	imageSrc,
	fallbackSrc = "/images/hero.png",
	alt = "",
	className = "w-full",
}) {
	const [svgMarkup, setSvgMarkup] = useState("");
	const url = imageSrc || fallbackSrc;

	useEffect(() => {
		let active = true;
		fetch("/home-border.svg")
			.then((res) => res.text())
			.then((raw) => {
				if (!active) return;
				const safe = url.replace(/"/g, "&quot;");
				setSvgMarkup(raw.replaceAll("__BANNER_IMAGE__", safe));
			})
			.catch(() => active && setSvgMarkup(""));
		return () => {
			active = false;
		};
	}, [url]);

	// `className` sizes the box (e.g. width + aspect ratio); the SVG/img is
	// forced to fill it so its height never collapses inside a flex parent.
	return (
		<div className={className}>
			{svgMarkup ? (
				<div
					className="h-full w-full [&>svg]:h-full! [&>svg]:w-full!"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: svgMarkup }}
				/>
			) : (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={url} alt={alt} className="h-full w-full object-cover" />
			)}
		</div>
	);
}
