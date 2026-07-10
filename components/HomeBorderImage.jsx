"use client";

import { useEffect, useState } from "react";

/**
 * Renders the decorative `home-border.svg` frame with `imageSrc` injected into
 * its image area. The SVG is large (embedded images), so it's a static asset in
 * /public instead of a JS module — we fetch it and swap the `__BANNER_IMAGE__`
 * token at runtime, keeping it out of the serverless bundle.
 */
// A 1x1 cream-colored SVG used to fill the banner area when `children` are
// rendered in place of a photo, so the frame's image region has a clean base.
const SOLID_FILL =
	"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1'%20height='1'%3E%3Crect%20width='1'%20height='1'%20fill='%23fbf6ec'/%3E%3C/svg%3E";

export default function HomeBorderImage({
	imageSrc,
	fallbackSrc = "/images/hero.png",
	alt = "",
	className = "w-full",
	children,
}) {
	const [svgMarkup, setSvgMarkup] = useState("");
	const url = children ? SOLID_FILL : imageSrc || fallbackSrc;

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
		<div className={`relative ${className}`}>
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

			{children && (
				<div
					className="absolute flex items-center justify-center"
					style={{
						left: "5.6%",
						right: "5.6%",
						top: "14%",
						bottom: "11.5%",
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
}
