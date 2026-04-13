"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import ReactQuill from "react-quill-new";
import Quill from "quill";
import "react-quill-new/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import Link from "next/link";
import MediaPickerModal from "@/components/MediaPickerModal";

const Font = Quill.import("formats/font");
Font.whitelist = ["montserrat", "anton", "serif", "monospace", "roboto"];
Quill.register(Font, true);

const Size = Quill.import("formats/size");
Size.whitelist = ["small", "large", "huge"];
Quill.register(Size, true);

const icons = Quill.import("ui/icons");
icons.undo =
	'<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M7 7H4V4"/><path class="ql-stroke" d="M4 7a6 6 0 1 1 2 4"/></svg>';
icons.redo =
	'<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M11 7h3V4"/><path class="ql-stroke" d="M14 7a6 6 0 1 0-2 4"/></svg>';
icons.hr =
	'<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/></svg>';
icons.emoji =
	'<svg viewbox="0 0 18 18"><circle class="ql-stroke" cx="9" cy="9" r="7"/><circle class="ql-fill" cx="6.5" cy="7" r="1"/><circle class="ql-fill" cx="11.5" cy="7" r="1"/><path class="ql-stroke" d="M6 11c1.5 1.5 4.5 1.5 6 0"/></svg>';

const Embed = Quill.import("blots/embed");
const Parchment = Quill.import("parchment");

class HrBlot extends Embed {
	static blotName = "hr";
	static tagName = "hr";
}

HrBlot.scope = Parchment.Scope.BLOCK_BLOT;
Quill.register(HrBlot, true);

const TableModule = Quill.import("modules/table");
if (TableModule?.register) {
	TableModule.register();
}

if (typeof window !== "undefined") {
	window.katex = katex;
}

const FONT_OPTIONS = {
	"": "Inherit",
	montserrat: "Montserrat",
	anton: "Anton",
	serif: "Serif",
	monospace: "Monospace",
	roboto: "Roboto",
};

const FONT_FAMILY_MAP = {
	montserrat: "Montserrat, sans-serif",
	anton: "Anton, sans-serif",
	serif: "Georgia, serif",
	monospace: '"Courier New", monospace',
	roboto: "Roboto, sans-serif",
};

const BASE_TEXT_STYLES = {
	color: "#000000",
	background: "",
	size: "normal",
	align: "left",
	bold: false,
	italic: false,
	underline: false,
	strike: false,
	font: "montserrat",
};

const BASE_HIGHLIGHT_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#0097a7",
	bold: true,
};

const BASE_LABEL_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#0097a7",
	bold: true,
};

const STEP_TITLE_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#fe7702",
	size: "huge",
	font: "anton",
};

const DISCLAIMER_TEXT_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#000000",
	font: "montserrat",
};

const DISCLAIMER_HIGHLIGHT_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#fe7702",
	bold: true,
	font: "montserrat",
};

const NAV_LABEL_STYLES = {
	...BASE_TEXT_STYLES,
	color: "#fe7702",
	size: "large",
	bold: false,
	font: "roboto",
};

const CALLOUT_WRAPPER_CLASSES = {
	standard:
		"bg-primary mt-4 rounded-lg p-4 md:mt-6 md:rounded-xl lg:mt-8 lg:rounded-2xl lg:p-7 xl:mt-10 xl:rounded-3xl",
	wide: "bg-primary container mx-auto mt-4 max-w-7xl rounded-lg p-4 md:mt-6 md:rounded-xl md:p-5 lg:mt-8 lg:rounded-2xl lg:p-7 xl:mt-10 xl:rounded-3xl xl:p-10",
};

const EMPTY_TEXT_STYLES = {
	color: "",
	background: "",
	size: "",
	align: "",
	bold: false,
	italic: false,
	underline: false,
	strike: false,
	font: "",
};

const BASE_IMAGE_STYLES = {
	width: "",
	maxWidth: "",
	height: "",
	borderRadius: "",
	borderWidth: "",
	borderColor: "",
	boxShadow: "",
	objectFit: "",
	align: "",
};

export const BLOG_PREVIEW_STORAGE_KEY = "blog-preview-content";

export const getStoredBlogContent = () => {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(BLOG_PREVIEW_STORAGE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
};

const BLOCK_STYLE_DEFAULTS = {
	paragraph: {
		textStyles: BASE_TEXT_STYLES,
		highlightStyles: BASE_HIGHLIGHT_STYLES,
	},
	heading: {
		textStyles: {
			...BASE_TEXT_STYLES,
			color: "#fe7702",
			size: "huge",
			bold: false,
			font: "anton",
		},
	},
	list: {
		itemLabelStyles: BASE_LABEL_STYLES,
		itemTextStyles: BASE_TEXT_STYLES,
	},
	features: {
		itemLabelStyles: BASE_LABEL_STYLES,
		itemTextStyles: BASE_TEXT_STYLES,
	},
	protip: {
		textStyles: BASE_TEXT_STYLES,
		highlightStyles: { ...BASE_HIGHLIGHT_STYLES, color: "#fe7702" },
	},
	image: {
		imageStyles: BASE_IMAGE_STYLES,
	},
	twoColumn: {},
};

const mapLegacySize = (size) => {
	const sizeMap = {
		xs: "small",
		sm: "small",
		base: "normal",
		lg: "large",
		xl: "large",
		"2xl": "huge",
		"3xl": "huge",
		"4xl": "huge",
	};
	return sizeMap[size] || "";
};

const mapLegacyFont = (fontFamily = "") => {
	const normalized = fontFamily.toLowerCase();
	if (normalized.includes("montserrat")) return "montserrat";
	if (normalized.includes("anton")) return "anton";
	if (normalized.includes("roboto")) return "roboto";
	if (normalized.includes("courier")) return "monospace";
	if (
		normalized.includes("times") ||
		normalized.includes("georgia") ||
		normalized.includes("garamond")
	) {
		return "serif";
	}
	return "";
};

const pickValue = (value, fallback) =>
	value !== undefined && value !== null && value !== "" ? value : fallback;

const pickBool = (value, fallback) =>
	typeof value === "boolean" ? value : fallback;

const normalizeStyle = (styles = {}, defaults = {}) => {
	const legacyBackground =
		styles.backgroundColor && styles.backgroundColor !== "transparent"
			? styles.backgroundColor
			: "";
	const legacyBold =
		typeof styles.fontWeight === "string"
			? ["bold", "extrabold", "semibold"].includes(styles.fontWeight)
			: undefined;
	const legacyItalic = styles.fontStyle === "italic";
	const legacyUnderline = styles.textDecoration === "underline";
	const legacyStrike = styles.textDecoration === "line-through";

	const normalized = {
		color: pickValue(styles.color, defaults.color || ""),
		background: pickValue(
			styles.background,
			pickValue(legacyBackground, defaults.background || ""),
		),
		size: pickValue(
			styles.size,
			pickValue(mapLegacySize(styles.fontSize), defaults.size || ""),
		),
		align: pickValue(
			styles.align,
			pickValue(styles.textAlign, defaults.align || ""),
		),
		bold: pickBool(styles.bold, pickBool(legacyBold, defaults.bold ?? false)),
		italic: pickBool(
			styles.italic,
			pickBool(legacyItalic, defaults.italic ?? false),
		),
		underline: pickBool(
			styles.underline,
			pickBool(legacyUnderline, defaults.underline ?? false),
		),
		strike: pickBool(
			styles.strike,
			pickBool(legacyStrike, defaults.strike ?? false),
		),
		font: pickValue(
			styles.font,
			pickValue(mapLegacyFont(styles.fontFamily), defaults.font || ""),
		),
	};

	return { ...styles, ...normalized };
};

const mergeStyles = (defaults, overrides) =>
	normalizeStyle(overrides, defaults);

const cloneStyles = (styles) => ({ ...(styles || {}) });

const getBlockStyleDefaults = (type) => BLOCK_STYLE_DEFAULTS[type] || {};

const createDefaultItem = (label, text, defaults) => ({
	label,
	text,
	labelStyles: cloneStyles(defaults.itemLabelStyles || BASE_LABEL_STYLES),
	textStyles: cloneStyles(defaults.itemTextStyles || BASE_TEXT_STYLES),
});

const createDefaultBlock = (type) => {
	const defaults = getBlockStyleDefaults(type);

	if (type === "paragraph") {
		return {
			type: "paragraph",
			text: "Type your paragraph...",
			highlight: "",
			textStyles: cloneStyles(defaults.textStyles),
			highlightStyles: cloneStyles(defaults.highlightStyles),
		};
	}

	if (type === "heading") {
		return {
			type: "heading",
			text: "Your Heading",
			level: 1,
			textStyles: cloneStyles(defaults.textStyles),
		};
	}

	if (type === "list") {
		return {
			type: "list",
			items: [createDefaultItem("Item:", "Description...", defaults)],
		};
	}

	if (type === "features") {
		return {
			type: "features",
			items: [createDefaultItem("Feature:", "Description...", defaults)],
		};
	}

	if (type === "protip") {
		return {
			type: "protip",
			text: "Your tip...",
			highlight: "Pro Tip:",
			textStyles: cloneStyles(defaults.textStyles),
			highlightStyles: cloneStyles(defaults.highlightStyles),
		};
	}

	if (type === "image") {
		return {
			type: "image",
			src: "/images/placeholder.png",
			alt: "Image",
			imageStyles: cloneStyles(defaults.imageStyles),
		};
	}

	if (type === "twoColumn") {
		return {
			type: "twoColumn",
			leftColumn: [],
			rightColumn: [],
		};
	}

	return { type };
};

// ==================== IMAGE STYLE EDITOR MODAL ====================

function ImageStyleEditor({ styles, onUpdate, onClose }) {
	const [editStyles, setEditStyles] = useState(styles || {});

	useEffect(() => {
		setEditStyles(styles || {});
	}, [styles]);

	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4'>
				<div className='rounded-3xl border border-white/40 bg-white/90 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div>
							<h2 className='text-lg font-semibold tracking-tight'>
								Image Settings
							</h2>
							<p className='text-xs text-slate-200/80'>
								Refine layout, borders, and fit
							</p>
						</div>
						<button
							onClick={onClose}
							className='rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'>
							Close
						</button>
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Width
							</label>
							<input
								type='text'
								value={editStyles.width || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, width: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='100% or 480px'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Max Width
							</label>
							<input
								type='text'
								value={editStyles.maxWidth || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, maxWidth: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='100% or 720px'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Height
							</label>
							<input
								type='text'
								value={editStyles.height || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, height: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='auto or 320px'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Object Fit
							</label>
							<select
								value={editStyles.objectFit || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, objectFit: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'>
								<option value=''>Default</option>
								<option value='cover'>Cover</option>
								<option value='contain'>Contain</option>
								<option value='fill'>Fill</option>
								<option value='none'>None</option>
								<option value='scale-down'>Scale Down</option>
							</select>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Border Radius
							</label>
							<input
								type='text'
								value={editStyles.borderRadius || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, borderRadius: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='16px'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Border Width
							</label>
							<input
								type='text'
								value={editStyles.borderWidth || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, borderWidth: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='1px'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Border Color
							</label>
							<input
								type='text'
								value={editStyles.borderColor || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, borderColor: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='#E2E8F0'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Box Shadow
							</label>
							<input
								type='text'
								value={editStyles.boxShadow || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, boxShadow: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
								placeholder='0 20px 30px rgba(15,23,42,0.12)'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-gray-700'>
								Align
							</label>
							<select
								value={editStyles.align || ""}
								onChange={(e) =>
									setEditStyles({ ...editStyles, align: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'>
								<option value=''>Default</option>
								<option value='left'>Left</option>
								<option value='center'>Center</option>
								<option value='right'>Right</option>
							</select>
						</div>
					</div>

					<div className='mt-6 flex gap-3'>
						<button
							onClick={() => {
								onUpdate(editStyles);
								onClose();
							}}
							className='flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:from-slate-800 hover:to-slate-600'>
							Apply
						</button>
						<button
							onClick={() => {
								setEditStyles({});
								onUpdate({});
							}}
							className='rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50'>
							Reset
						</button>
						<button
							onClick={onClose}
							className='rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function getStyleClasses(styles = {}) {
	const normalized = normalizeStyle(styles, {});
	const classes = [];

	const sizeMap = {
		small: "text-sm",
		normal: "text-base",
		large: "text-xl",
		huge: "text-4xl",
	};

	const alignMap = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
		justify: "text-justify",
	};

	if (normalized.size) classes.push(sizeMap[normalized.size]);
	if (normalized.align) classes.push(alignMap[normalized.align]);
	if (normalized.bold) classes.push("font-bold");
	if (normalized.italic) classes.push("italic");
	if (normalized.underline) classes.push("underline");
	if (normalized.strike) classes.push("line-through");
	if (normalized.font === "montserrat") classes.push("font-montserrat");
	if (normalized.font === "anton") classes.push("font-anton");
	if (normalized.font === "serif") classes.push("font-serif");
	if (normalized.font === "monospace") classes.push("font-mono");
	if (normalized.font === "roboto") classes.push("font-roboto");

	return classes.filter(Boolean).join(" ");
}

function getInlineStyles(styles = {}) {
	const normalized = normalizeStyle(styles, {});
	const inlineStyles = {};
	if (normalized.color) inlineStyles.color = normalized.color;
	if (normalized.background)
		inlineStyles.backgroundColor = normalized.background;
	const fontFamily = FONT_FAMILY_MAP[normalized.font];
	if (fontFamily) inlineStyles.fontFamily = fontFamily;
	return inlineStyles;
}
function getImageInlineStyles(styles = {}) {
	const inlineStyles = {};
	if (styles.width) inlineStyles.width = styles.width;
	if (styles.maxWidth) inlineStyles.maxWidth = styles.maxWidth;
	if (styles.height) inlineStyles.height = styles.height;
	if (styles.borderRadius) inlineStyles.borderRadius = styles.borderRadius;
	if (styles.borderWidth) {
		inlineStyles.borderWidth = styles.borderWidth;
		inlineStyles.borderStyle = "solid";
	}
	if (styles.borderColor) inlineStyles.borderColor = styles.borderColor;
	if (styles.boxShadow) inlineStyles.boxShadow = styles.boxShadow;
	if (styles.objectFit) inlineStyles.objectFit = styles.objectFit;
	return inlineStyles;
}

function getImageWrapperStyles(styles = {}) {
	const inlineStyles = {};
	if (styles.align === "center") {
		inlineStyles.marginLeft = "auto";
		inlineStyles.marginRight = "auto";
	}
	if (styles.align === "right") {
		inlineStyles.marginLeft = "auto";
	}
	if (styles.align === "left") {
		inlineStyles.marginRight = "auto";
	}
	return inlineStyles;
}

const getQuillDefaultStyles = (styles = {}) => {
	const normalized = normalizeStyle(styles, BASE_TEXT_STYLES);
	const sizeMap = {
		small: "0.875rem",
		normal: "1rem",
		large: "1.25rem",
		huge: "1.5rem",
	};
	const fontFamily =
		FONT_FAMILY_MAP[normalized.font] || "Montserrat, sans-serif";

	let decoration = "none";
	if (normalized.underline && normalized.strike) {
		decoration = "underline line-through";
	} else if (normalized.underline) {
		decoration = "underline";
	} else if (normalized.strike) {
		decoration = "line-through";
	}

	return {
		"--ql-color": normalized.color || "#0f172a",
		"--ql-bg": normalized.background || "transparent",
		"--ql-font": fontFamily,
		"--ql-size": sizeMap[normalized.size] || "1rem",
		"--ql-align": normalized.align || "left",
		"--ql-weight": normalized.bold ? "700" : "400",
		"--ql-style": normalized.italic ? "italic" : "normal",
		"--ql-decoration": decoration,
	};
};

const applyQuillDefaultFormats = (quill, styles = {}) => {
	const normalized = normalizeStyle(styles, BASE_TEXT_STYLES);
	const inlineFormats = {};
	const lineFormats = {};

	if (normalized.color) inlineFormats.color = normalized.color;
	if (normalized.background) inlineFormats.background = normalized.background;
	if (normalized.bold) inlineFormats.bold = true;
	if (normalized.italic) inlineFormats.italic = true;
	if (normalized.underline) inlineFormats.underline = true;
	if (normalized.strike) inlineFormats.strike = true;
	if (normalized.font) inlineFormats.font = normalized.font;
	if (normalized.size && normalized.size !== "normal")
		inlineFormats.size = normalized.size;
	if (normalized.align && normalized.align !== "left")
		lineFormats.align = normalized.align;

	const length = quill.getLength();
	const hasText = quill.getText().trim().length > 0;
	if (hasText) {
		if (length > 1 && Object.keys(inlineFormats).length > 0) {
			quill.formatText(0, length - 1, inlineFormats, "silent");
		}
		if (length > 1 && Object.keys(lineFormats).length > 0) {
			quill.formatLine(0, length - 1, lineFormats, "silent");
		}
		return;
	}

	Object.entries(inlineFormats).forEach(([key, value]) => {
		quill.format(key, value, "silent");
	});
	if (Object.keys(lineFormats).length > 0) {
		quill.formatLine(0, 1, lineFormats, "silent");
	}
};

export function SEOHead({ metadata = {}, structuredData }) {
	return (
		<>
			<title>{metadata.title}</title>
			<meta name='description' content={metadata.description} />
			{metadata.keywords && (
				<meta name='keywords' content={metadata.keywords} />
			)}
			{metadata.author && <meta name='author' content={metadata.author} />}
			<link rel='canonical' href={metadata.canonicalUrl} />
			<meta property='og:title' content={metadata.title} />
			<meta property='og:description' content={metadata.description} />
			<meta property='og:type' content={metadata.ogType || "article"} />
			<meta property='og:url' content={metadata.canonicalUrl} />
			{metadata.image && <meta property='og:image' content={metadata.image} />}
			<meta
				name='twitter:card'
				content={metadata.twitterCard || "summary_large_image"}
			/>
			{metadata.twitterSite && (
				<meta name='twitter:site' content={metadata.twitterSite} />
			)}
			<meta name='twitter:title' content={metadata.title} />
			<meta name='twitter:description' content={metadata.description} />
			{metadata.image && <meta name='twitter:image' content={metadata.image} />}
			{metadata.publishedDate && (
				<meta
					property='article:published_time'
					content={metadata.publishedDate}
				/>
			)}
			{metadata.modifiedDate && (
				<meta
					property='article:modified_time'
					content={metadata.modifiedDate}
				/>
			)}
			{metadata.category && (
				<meta property='article:section' content={metadata.category} />
			)}
			{(metadata.tags || []).map((tag) => (
				<meta key={tag} property='article:tag' content={tag} />
			))}
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
		</>
	);
}

function MetadataEditor({ metadata, structuredData, onUpdate, onClose }) {
	const [editData, setEditData] = useState({ ...metadata });
	const [editStructuredData, setEditStructuredData] = useState({
		...structuredData,
	});
	const [tagInput, setTagInput] = useState((metadata.tags || []).join(", "));

	const handleSyncStructuredData = () => {
		setEditStructuredData((prev) => ({
			...prev,
			headline: editData.title,
			description: editData.description,
			author: { "@type": "Person", name: editData.author || "" },
			datePublished: editData.publishedDate || prev.datePublished,
			dateModified: editData.modifiedDate || prev.dateModified,
			image: editData.image || prev.image,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": editData.canonicalUrl || prev?.mainEntityOfPage?.["@id"] || "",
			},
		}));
	};
	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto px-4'>
				<div className='rounded-3xl border border-white/40 bg-white/95 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div>
							<h2 className='text-lg font-semibold tracking-tight'>
								SEO Settings
							</h2>
							<p className='text-xs text-slate-200/80'>
								Tune metadata and structured data
							</p>
						</div>
						<button
							onClick={onClose}
							className='rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20'>
							Close
						</button>
					</div>
					<div className='space-y-6'>
						<div>
							<label className='mb-2 block text-sm font-semibold'>
								Page Title
							</label>
							<input
								type='text'
								value={editData.title}
								onChange={(e) =>
									setEditData({ ...editData, title: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								maxLength='60'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold'>
								Meta Description
							</label>
							<textarea
								value={editData.description}
								onChange={(e) =>
									setEditData({ ...editData, description: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								rows={3}
								maxLength='160'
							/>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Canonical URL
								</label>
								<input
									type='text'
									value={editData.canonicalUrl}
									onChange={(e) =>
										setEditData({ ...editData, canonicalUrl: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Author
								</label>
								<input
									type='text'
									value={editData.author}
									onChange={(e) =>
										setEditData({ ...editData, author: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Keywords
								</label>
								<input
									type='text'
									value={editData.keywords}
									onChange={(e) =>
										setEditData({ ...editData, keywords: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Tags (comma separated)
								</label>
								<input
									type='text'
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Category
								</label>
								<input
									type='text'
									value={editData.category}
									onChange={(e) =>
										setEditData({ ...editData, category: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Reading Time
								</label>
								<input
									type='text'
									value={editData.readingTime}
									onChange={(e) =>
										setEditData({ ...editData, readingTime: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Published Date
								</label>
								<input
									type='date'
									value={editData.publishedDate}
									onChange={(e) =>
										setEditData({ ...editData, publishedDate: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Modified Date
								</label>
								<input
									type='date'
									value={editData.modifiedDate}
									onChange={(e) =>
										setEditData({ ...editData, modifiedDate: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Open Graph Type
								</label>
								<input
									type='text'
									value={editData.ogType}
									onChange={(e) =>
										setEditData({ ...editData, ogType: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Twitter Card
								</label>
								<input
									type='text'
									value={editData.twitterCard}
									onChange={(e) =>
										setEditData({ ...editData, twitterCard: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Twitter Site
								</label>
								<input
									type='text'
									value={editData.twitterSite}
									onChange={(e) =>
										setEditData({ ...editData, twitterSite: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-semibold'>
									Social Image URL
								</label>
								<input
									type='text'
									value={editData.image}
									onChange={(e) =>
										setEditData({ ...editData, image: e.target.value })
									}
									className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								/>
							</div>
						</div>
						<div>
							<div className='mb-2 flex items-center justify-between'>
								<label className='text-sm font-semibold'>
									Structured Data (Schema.org)
								</label>
								<button
									onClick={handleSyncStructuredData}
									className='rounded-lg bg-blue-600 px-3 py-1 text-xs text-white'>
									Sync With SEO
								</button>
							</div>
							<div className='grid gap-4 md:grid-cols-2'>
								<div>
									<label className='mb-2 block text-sm font-semibold'>
										Headline
									</label>
									<input
										type='text'
										value={editStructuredData.headline || ""}
										onChange={(e) =>
											setEditStructuredData({
												...editStructuredData,
												headline: e.target.value,
											})
										}
										className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
									/>
								</div>
								<div>
									<label className='mb-2 block text-sm font-semibold'>
										Description
									</label>
									<input
										type='text'
										value={editStructuredData.description || ""}
										onChange={(e) =>
											setEditStructuredData({
												...editStructuredData,
												description: e.target.value,
											})
										}
										className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
									/>
								</div>
							</div>
							<div className='mt-4 grid gap-4 md:grid-cols-2'>
								<div>
									<label className='mb-2 block text-sm font-semibold'>
										Publisher Name
									</label>
									<input
										type='text'
										value={editStructuredData.publisher?.name || ""}
										onChange={(e) =>
											setEditStructuredData({
												...editStructuredData,
												publisher: {
													...(editStructuredData.publisher || {}),
													name: e.target.value,
												},
											})
										}
										className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
									/>
								</div>
								<div>
									<label className='mb-2 block text-sm font-semibold'>
										Publisher Logo URL
									</label>
									<input
										type='text'
										value={editStructuredData.publisher?.logo?.url || ""}
										onChange={(e) =>
											setEditStructuredData({
												...editStructuredData,
												publisher: {
													...(editStructuredData.publisher || {}),
													logo: {
														...(editStructuredData.publisher?.logo || {}),
														url: e.target.value,
													},
												},
											})
										}
										className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='mt-6 flex gap-3'>
						<button
							onClick={() => {
								const cleanedTags = tagInput
									.split(",")
									.map((tag) => tag.trim())
									.filter(Boolean);
								onUpdate({
									metadata: { ...editData, tags: cleanedTags },
									structuredData: editStructuredData,
								});
								onClose();
							}}
							className='flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:from-slate-800 hover:to-slate-600'>
							Save
						</button>
						<button
							onClick={onClose}
							className='rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function SectionSEOEditor({ seo, onUpdate, onClose }) {
	const [editData, setEditData] = useState({ ...seo });
	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4'>
				<div className='rounded-3xl border border-white/40 bg-white/95 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div>
							<h2 className='text-lg font-semibold tracking-tight'>
								Section SEO
							</h2>
							<p className='text-xs text-slate-200/80'>
								Edit anchor and section description
							</p>
						</div>
						<button
							onClick={onClose}
							className='rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20'>
							Close
						</button>
					</div>

					<div className='space-y-4'>
						<div>
							<label className='mb-2 block text-sm font-semibold text-slate-700'>
								Anchor
							</label>
							<input
								type='text'
								value={editData.anchor || ""}
								onChange={(e) =>
									setEditData({ ...editData, anchor: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								placeholder='section-anchor'
							/>
						</div>
						<div>
							<label className='mb-2 block text-sm font-semibold text-slate-700'>
								Meta Description
							</label>
							<textarea
								value={editData.metaDescription || ""}
								onChange={(e) =>
									setEditData({ ...editData, metaDescription: e.target.value })
								}
								className='w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
								placeholder='Section meta description'
								rows={4}
							/>
						</div>
					</div>

					<div className='mt-6 flex gap-3'>
						<button
							onClick={() => {
								onUpdate(editData);
								onClose();
							}}
							className='flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:from-slate-800 hover:to-slate-600'>
							Apply
						</button>
						<button
							onClick={onClose}
							className='rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function RichTextModalEditor({
	value,
	onSave,
	onClose,
	title = "Edit Text",
	defaultStyles = {},
}) {
	const [currentValue, setCurrentValue] = useState(value || "");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const quillRef = useRef(null);
	const appliedDefaultsRef = useRef(false);
	const modalClassRef = useRef(
		`quill-modal-${Math.random().toString(36).slice(2)}`,
	);
	const emojiOptions = [
		"😀",
		"😄",
		"😁",
		"😊",
		"😉",
		"😍",
		"😘",
		"😎",
		"🤔",
		"👍",
		"👏",
		"🙌",
		"🔥",
		"🎯",
		"✅",
		"✨",
		"💡",
		"📌",
		"📈",
		"📣",
		"🎉",
		"📝",
		"📎",
		"💬",
	];
	const defaultCss = getQuillDefaultStyles(defaultStyles);
	const defaultStyleKey = useMemo(
		() => JSON.stringify(normalizeStyle(defaultStyles, BASE_TEXT_STYLES)),
		[defaultStyles],
	);
	const getQuill = () => {
		const ref = quillRef.current;
		if (!ref || typeof ref !== "object") return null;
		if ("editor" in ref && ref.editor) return ref.editor;
		return null;
	};

	useEffect(() => {
		setCurrentValue(value || "");
		appliedDefaultsRef.current = false;
	}, [value, defaultStyleKey]);

	useEffect(() => {
		let cancelled = false;
		let attempts = 0;

		const tryApplyDefaults = () => {
			if (cancelled || appliedDefaultsRef.current) return;
			const quill = getQuill();
			if (!quill) {
				if (attempts < 6) {
					attempts += 1;
					setTimeout(tryApplyDefaults, 60);
				}
				return;
			}
			const delta = quill.getContents();
			const hasFormatting = (delta.ops || []).some(
				(op) => op.attributes && Object.keys(op.attributes).length > 0,
			);
			if (!hasFormatting) {
				applyQuillDefaultFormats(quill, defaultStyles);
			}
			appliedDefaultsRef.current = true;
		};

		tryApplyDefaults();
		return () => {
			cancelled = true;
		};
	}, [currentValue, defaultStyleKey, defaultStyles]);

	const fontValues = Object.keys(FONT_OPTIONS).filter((value) => value);
	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ font: fontValues }],
					[{ header: [1, 2, 3, false] }],
					[{ size: ["small", false, "large", "huge"] }],
					["bold", "italic", "underline", "strike", "code"],
					[{ color: [] }, { background: [] }],
					[{ script: "sub" }, { script: "super" }],
					[{ direction: "rtl" }, { align: [] }],
					[
						{ list: "ordered" },
						{ list: "bullet" },
						{ indent: "-1" },
						{ indent: "+1" },
					],
					["blockquote", "code-block", "formula"],
					["link", "image", "video", "table"],
					["emoji", "hr", "undo", "redo", "clean"],
				],
				handlers: {
					undo: () => {
						const quill = getQuill();
						quill?.history?.undo();
					},
					redo: () => {
						const quill = getQuill();
						quill?.history?.redo();
					},
					hr: () => {
						const quill = getQuill();
						if (!quill) return;
						const range = quill.getSelection(true);
						if (!range) return;
						quill.insertEmbed(range.index, "hr", true, "user");
						quill.insertText(range.index + 1, "\n", "user");
						quill.setSelection(range.index + 2, 0, "user");
					},
					emoji: () => {
						setShowEmojiPicker((prev) => !prev);
					},
					table: () => {
						const quill = getQuill();
						const tableModule = quill?.getModule?.("table");
						if (!tableModule) return;
						tableModule.insertTable(2, 2);
					},
				},
			},
			history: {
				delay: 500,
				maxStack: 200,
				userOnly: true,
			},
			clipboard: {
				matchVisual: false,
				matchers: [
					[
						Node.TEXT_NODE,
						(node, delta) => {
							// Preserve line breaks from pasted text
							const text = node.data || "";
							if (text.includes("\n") || text.includes("\r")) {
								const ops = [];
								const lines = text.split(/\r?\n/);
								lines.forEach((line, index) => {
									if (line) {
										ops.push({ insert: line });
									}
									if (index < lines.length - 1) {
										ops.push({ insert: "\n" });
									}
								});
								return { ops };
							}
							return delta;
						},
					],
				],
			},
			table: true,
		}),
		[fontValues],
	);

	const formats = [
		"font",
		"header",
		"size",
		"bold",
		"italic",
		"underline",
		"strike",
		"code",
		"script",
		"color",
		"background",
		"align",
		"direction",
		"list",
		"indent",
		"blockquote",
		"code-block",
		"formula",
		"table",
		"hr",
		"link",
		"image",
		"video",
	];

	const portalTarget = typeof document === "undefined" ? null : document.body;
	if (!portalTarget) return null;

	return createPortal(
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-4 max-h-[90vh] overflow-y-auto'>
				<div className='rounded-3xl border border-white/40 bg-white/95 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div>
							<h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
							<p className='text-xs text-slate-200/80'>
								Select text and apply styles
							</p>
						</div>
						<button
							onClick={onClose}
							className='rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20'>
							Close
						</button>
					</div>

					<div
						className={`rounded-2xl border border-slate-200 bg-white/80 shadow-inner ${modalClassRef.current}`}
						style={defaultCss}>
						<style>{`
              .${modalClassRef.current} .ql-toolbar {
                border: 0;
                border-bottom: 1px solid rgba(226, 232, 240, 0.9);
                border-radius: 16px 16px 0 0;
                background: #f8fafc;
              }
              .${modalClassRef.current} .ql-container {
                border: 0;
                border-radius: 0 0 16px 16px;
                background: transparent;
              }
              .${modalClassRef.current} .ql-editor {
                min-height: 240px;
                color: var(--ql-color);
                background-color: var(--ql-bg);
                font-family: var(--ql-font);
                font-size: var(--ql-size);
                text-align: var(--ql-align);
                font-weight: var(--ql-weight);
                font-style: var(--ql-style);
                text-decoration: var(--ql-decoration);
              }
              .${modalClassRef.current} .ql-editor.ql-blank::before {
                color: #94a3b8;
              }
              .${modalClassRef.current} .ql-size-small {
                font-size: 0.875rem;
              }
              .${modalClassRef.current} .ql-size-large {
                font-size: 1.25rem;
              }
              .${modalClassRef.current} .ql-size-huge {
                font-size: 1.5rem;
              }
              .${modalClassRef.current} .ql-font-montserrat {
                font-family: ${FONT_FAMILY_MAP.montserrat};
              }
              .${modalClassRef.current} .ql-font-anton {
                font-family: ${FONT_FAMILY_MAP.anton};
              }
              .${modalClassRef.current} .ql-font-serif {
                font-family: ${FONT_FAMILY_MAP.serif};
              }
              .${modalClassRef.current} .ql-font-monospace {
                font-family: ${FONT_FAMILY_MAP.monospace};
              }
              .${modalClassRef.current} .ql-font-roboto {
                font-family: ${FONT_FAMILY_MAP.roboto};
              }
            `}</style>
						<ReactQuill
							ref={quillRef}
							theme='snow'
							value={currentValue}
							onChange={setCurrentValue}
							modules={modules}
							formats={formats}
						/>
					</div>

					{showEmojiPicker && (
						<div className='mt-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-inner'>
							<div className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
								Emoji
							</div>
							<div className='grid grid-cols-8 gap-2 sm:grid-cols-10'>
								{emojiOptions.map((emoji) => (
									<button
										key={emoji}
										onClick={() => {
											const quill = getQuill();
											if (!quill) return;
											const range = quill.getSelection(true);
											if (!range) return;
											quill.insertText(range.index, emoji, "user");
											quill.setSelection(range.index + emoji.length, 0, "user");
											setShowEmojiPicker(false);
										}}
										className='rounded-lg border border-slate-200 bg-white px-2 py-1 text-lg shadow-sm transition hover:border-slate-300 hover:bg-slate-50'
										type='button'>
										{emoji}
									</button>
								))}
							</div>
						</div>
					)}

					<div className='mt-6 flex gap-3'>
						<button
							onClick={() => onSave(currentValue)}
							className='flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:from-slate-800 hover:to-slate-600'>
							Apply
						</button>
						<button
							onClick={onClose}
							className='rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>,
		portalTarget,
	);
}

function EditableText({
	value,
	onChange,
	className,
	style = {},
	multiline = false,
	placeholder = "Click to edit...",
	richText = true,
	editInModal = true,
	modalTitle = "Edit Text",
	modalDefaultStyles = {},
	as: Component = "span",
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const editableRef = useRef(null);

	useEffect(() => {
		if (isEditing && editableRef.current) {
			editableRef.current.focus();
		}
	}, [isEditing]);

	const handleBlur = () => {
		setIsEditing(false);
		const newValue = richText
			? editableRef.current?.innerHTML || ""
			: editableRef.current?.innerText || "";
		if (newValue !== value) {
			onChange(newValue);
		}
	};

	const handleKeyDown = (e) => {
		if (!multiline && e.key === "Enter") {
			e.preventDefault();
			handleBlur();
		}
		if (e.key === "Escape") {
			setIsEditing(false);
		}
	};

	if (richText && editInModal) {
		return (
			<>
				<Component
					onClick={(e) => {
						e.stopPropagation();
						setShowModal(true);
					}}
					className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-1`}
					style={style}
					title='Click to edit'
					dangerouslySetInnerHTML={
						richText ? { __html: value || placeholder } : undefined
					}>
					{!richText ? value || placeholder : null}
				</Component>
				{showModal && (
					<RichTextModalEditor
						value={value}
						title={modalTitle}
						onSave={(updated) => {
							onChange(updated);
							setShowModal(false);
						}}
						onClose={() => setShowModal(false)}
						defaultStyles={modalDefaultStyles}
					/>
				)}
			</>
		);
	}

	if (isEditing) {
		return (
			<Component
				ref={editableRef}
				contentEditable
				suppressContentEditableWarning
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className={`${className} cursor-text select-text ring-2 ring-blue-400 ring-offset-2 outline-none`}
				style={style}
				dangerouslySetInnerHTML={
					richText ? { __html: value || "" } : undefined
				}>
				{!richText ? value || "" : null}
			</Component>
		);
	}

	return (
		<Component
			onClick={(e) => {
				e.stopPropagation();
				setIsEditing(true);
			}}
			className={`${className} cursor-text hover:ring-2 hover:ring-blue-300 hover:ring-offset-1`}
			style={style}
			title='Click to edit'
			dangerouslySetInnerHTML={
				richText ? { __html: value || placeholder } : undefined
			}>
			{!richText ? value || placeholder : null}
		</Component>
	);
}

function RichText({ html, className, style, as: Component = "span" }) {
	return (
		<Component
			className={className}
			style={style}
			dangerouslySetInnerHTML={{ __html: html || "" }}
		/>
	);
}

function ImageEditor({
	src,
	alt,
	seo,
	onUpdate,
	isEditMode,
	imageStyles = {},
	wrapperStyles = {},
	onOpenMediaPicker,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [editSrc, setEditSrc] = useState(src);
	const [editAlt, setEditAlt] = useState(alt);
	const editorRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (editorRef.current && !editorRef.current.contains(event.target)) {
				onUpdate({ src: editSrc, alt: editAlt, seo: seo || {} });
				setIsEditing(false);
			}
		}
		if (isEditing) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isEditing, editSrc, editAlt]);

	return (
		<div ref={editorRef} className='group relative' style={wrapperStyles}>
			<img
				src={src}
				alt={alt}
				className={`h-auto w-full rounded-lg ${isEditMode ? "cursor-pointer hover:ring-2 hover:ring-blue-400" : ""}`}
				style={imageStyles}
				onClick={() => isEditMode && setIsEditing(true)}
			/>
			{isEditMode && isEditing && (
				<div className='absolute top-full right-0 left-0 z-50 mt-2 rounded-lg bg-white p-4 shadow-2xl ring-2 ring-blue-400'>
					<div className='mb-2 flex gap-2'>
						<input
							type='text'
							value={editSrc}
							onChange={(e) => setEditSrc(e.target.value)}
							className='w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
							placeholder='Image URL'
						/>
						{onOpenMediaPicker && (
							<button
								type='button'
								onClick={() => {
									onOpenMediaPicker((file) => setEditSrc(file.url));
								}}
								className='rounded-lg border border-slate-300 bg-white p-2 transition hover:bg-slate-50'
								title='Select from gallery'>
								<svg
									className='h-6 w-6 text-gray-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
									/>
								</svg>
							</button>
						)}
					</div>
					<input
						type='text'
						value={editAlt}
						onChange={(e) => setEditAlt(e.target.value)}
						className='w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none'
						placeholder='Alt text'
					/>
				</div>
			)}
		</div>
	);
}

function ControlButtons({ onDelete, onMoveUp, onMoveDown, extraButtons }) {
	return (
		<div className='flex gap-1'>
			{onMoveUp && (
				<button
					onClick={onMoveUp}
					className='rounded bg-gray-600 px-2 py-1 text-xs text-white'>
					↑
				</button>
			)}
			{onMoveDown && (
				<button
					onClick={onMoveDown}
					className='rounded bg-gray-600 px-2 py-1 text-xs text-white'>
					↓
				</button>
			)}
			{extraButtons}
			{onDelete && (
				<button
					onClick={onDelete}
					className='rounded bg-red-600 px-2 py-1 text-xs text-white'>
					🗑️
				</button>
			)}
		</div>
	);
}

function AddTypeModal({ onSelectType, onClose }) {
	const options = [
		{
			type: "step",
			icon: "📋",
			label: "Add Step",
			description: "Structured step-by-step content",
		},
		{
			type: "flat",
			icon: "📄",
			label: "Add Flat Content",
			description: "Add content without steps",
		},
	];

	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4'>
				<div className='rounded-3xl border border-white/40 bg-white/90 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div className='text-lg font-semibold tracking-tight'>
							Choose Content Type
						</div>
						<div className='text-xs text-slate-200/80'>
							Select whether to add a step or flat content
						</div>
					</div>
					<div className='grid gap-4'>
						{options.map((item) => (
							<button
								key={item.type}
								onClick={() => onSelectType(item.type)}
								className='group rounded-2xl border border-slate-200 bg-white/70 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md'>
								<div className='flex items-center gap-4'>
									<div className='text-4xl transition group-hover:scale-105'>
										{item.icon}
									</div>
									<div className='flex-1'>
										<div className='text-base font-semibold text-slate-800'>
											{item.label}
										</div>
										<div className='mt-1 text-xs text-slate-500'>
											{item.description}
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function AddContentModal({ onAdd, onClose }) {
	const types = [
		{ type: "paragraph", icon: "📝", label: "Paragraph" },
		{ type: "heading", icon: "📌", label: "Heading" },
		{ type: "list", icon: "📋", label: "List" },
		{ type: "features", icon: "⭐", label: "Features" },
		{ type: "protip", icon: "💡", label: "Pro Tip" },
		{ type: "image", icon: "🖼️", label: "Image" },
		{ type: "twoColumn", icon: "📱", label: "Two Column" },
	];

	const handleAdd = (type) => {
		const newContent = createDefaultBlock(type);
		onAdd(newContent);
		onClose();
	};

	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md'
				onClick={onClose}
			/>
			<div className='fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto px-4'>
				<div className='rounded-3xl border border-white/40 bg-white/90 p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-black/5'>
					<div className='mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-4 text-white shadow-lg'>
						<div className='text-lg font-semibold tracking-tight'>
							Add Content
						</div>
						<div className='text-xs text-slate-200/80'>
							Choose a block type to insert
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
						{types.map((item) => (
							<button
								key={item.type}
								onClick={() => handleAdd(item.type)}
								className='group rounded-2xl border border-slate-200 bg-white/70 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md'>
								<div className='text-3xl transition group-hover:scale-105'>
									{item.icon}
								</div>
								<div className='mt-2 text-sm font-semibold text-slate-800'>
									{item.label}
								</div>
								<div className='mt-1 text-xs text-slate-500'>
									Click to insert
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export function ContentBlock({
	block,
	onUpdate,
	onDelete,
	onMoveUp,
	onMoveDown,
	isEditMode,
	onAddAfter,
	columnPath = [],
	onOpenMediaPicker,
}) {
	const [levelMenuOpen, setLevelMenuOpen] = useState(false);
	const [showImageStyleEditor, setShowImageStyleEditor] = useState(false);
	const [showAddModalLeft, setShowAddModalLeft] = useState(false);
	const [showAddModalRight, setShowAddModalRight] = useState(false);
	const [addAfterIndexLeft, setAddAfterIndexLeft] = useState(null);
	const [addAfterIndexRight, setAddAfterIndexRight] = useState(null);

	const blockDefaults = getBlockStyleDefaults(block.type);
	const resolvedTextStyles = mergeStyles(
		blockDefaults.textStyles,
		block.textStyles,
	);
	const resolvedHighlightStyles = mergeStyles(
		blockDefaults.highlightStyles,
		block.highlightStyles,
	);
	const resolvedItemLabelDefaults =
		blockDefaults.itemLabelStyles || BASE_LABEL_STYLES;
	const resolvedItemTextDefaults =
		blockDefaults.itemTextStyles || BASE_TEXT_STYLES;

	const handleUpdateField = (field, value) => {
		onUpdate({ ...block, [field]: value });
	};

	const handleUpdateItem = (index, field, value) => {
		const newItems = [...block.items];
		newItems[index][field] = value;
		onUpdate({ ...block, items: newItems });
	};

	const handleAddItem = () => {
		const defaultLabel = block.type === "features" ? "Feature:" : "Item:";
		const newItem = {
			label: defaultLabel,
			text: "Description...",
			labelStyles: cloneStyles(resolvedItemLabelDefaults),
			textStyles: cloneStyles(resolvedItemTextDefaults),
		};
		const newItems = [...(block.items || []), newItem];
		onUpdate({ ...block, items: newItems });
	};

	const handleDeleteItem = (index) => {
		if (confirm("Delete this item?")) {
			const newItems = block.items.filter((_, i) => i !== index);
			onUpdate({ ...block, items: newItems });
		}
	};

	const handleMoveItem = (index, direction) => {
		const newItems = [...block.items];
		const newIndex = direction === "up" ? index - 1 : index + 1;
		if (newIndex >= 0 && newIndex < newItems.length) {
			[newItems[index], newItems[newIndex]] = [
				newItems[newIndex],
				newItems[index],
			];
			onUpdate({ ...block, items: newItems });
		}
	};

	const handleUpdateColumnContent = (column, index, newContent) => {
		const updatedBlock = { ...block };
		updatedBlock[column][index] = newContent;
		onUpdate(updatedBlock);
	};

	const handleDeleteColumnContent = (column, index) => {
		if (confirm("Delete this content?")) {
			const updatedBlock = { ...block };
			updatedBlock[column].splice(index, 1);
			onUpdate(updatedBlock);
		}
	};

	const handleMoveColumnContent = (column, index, direction) => {
		const updatedBlock = { ...block };
		const newIndex = direction === "up" ? index - 1 : index + 1;
		const content = updatedBlock[column];

		if (newIndex >= 0 && newIndex < content.length) {
			[content[index], content[newIndex]] = [content[newIndex], content[index]];
			onUpdate(updatedBlock);
		}
	};

	const handleAddColumnContent = (column, newContent, afterIndex = null) => {
		const updatedBlock = { ...block };
		if (afterIndex !== null) {
			updatedBlock[column].splice(afterIndex + 1, 0, newContent);
		} else {
			updatedBlock[column].push(newContent);
		}
		onUpdate(updatedBlock);
	};

	const renderContent = () => {
		switch (block.type) {
			case "paragraph":
				const textClasses = getStyleClasses(resolvedTextStyles);
				const textInlineStyles = getInlineStyles(resolvedTextStyles);
				const highlightClasses = getStyleClasses(resolvedHighlightStyles);
				const highlightInlineStyles = getInlineStyles(resolvedHighlightStyles);

				return (
					<div className='group relative'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons
									onMoveUp={onMoveUp}
									onMoveDown={onMoveDown}
									onDelete={onDelete}
									extraButtons={
										<button
											onClick={() =>
												handleUpdateField(
													"highlight",
													block.highlight ? "" : "Title:",
												)
											}
											className='rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700'>
											{block.highlight ? "Remove Highlight" : "Add Highlight"}
										</button>
									}
								/>
							</div>
						)}

						<p
							className={`font-montserrat mt-2 rounded-lg bg-white p-3 shadow-[0_8px_12px_rgba(0,0,0,0.20),0_-5px_12px_1px_rgba(0,0,0,0.20)] sm:rounded-xl md:mt-4 md:rounded-2xl md:p-5 lg:mt-6 lg:rounded-3xl lg:p-7 xl:mt-8 xl:rounded-4xl xl:p-9 ${textClasses}`}>
							{block.highlight && (
								<>
									<span className='group/highlight relative inline-block'>
										{isEditMode ? (
											<>
												<EditableText
													value={block.highlight}
													onChange={(val) =>
														handleUpdateField("highlight", val)
													}
													className={highlightClasses}
													style={highlightInlineStyles}
													modalDefaultStyles={resolvedHighlightStyles}
													placeholder='Highlight...'
													as='b'
												/>
											</>
										) : (
											<RichText
												html={block.highlight}
												className={highlightClasses}
												style={highlightInlineStyles}
												as='b'
											/>
										)}
									</span>{" "}
								</>
							)}
							<span className='group/text relative inline-block'>
								{isEditMode ? (
									<>
										<EditableText
											value={block.text}
											onChange={(val) => handleUpdateField("text", val)}
											style={textInlineStyles}
											modalDefaultStyles={resolvedTextStyles}
											multiline={true}
											placeholder='Paragraph text...'
										/>
									</>
								) : (
									<RichText html={block.text} style={textInlineStyles} />
								)}
							</span>
						</p>
					</div>
				);

			case "heading":
				const HeadingTag = `h${block.level || 1}`;
				const headingClasses = getStyleClasses(resolvedTextStyles);
				const headingInlineStyles = getInlineStyles(resolvedTextStyles);

				return (
					<div className='group relative'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons
									onMoveUp={onMoveUp}
									onMoveDown={onMoveDown}
									onDelete={onDelete}
									extraButtons={
										<div className='relative'>
											<button
												onClick={() => setLevelMenuOpen(!levelMenuOpen)}
												className='rounded bg-purple-600 px-2 py-1 text-xs text-white hover:bg-purple-700'>
												H{block.level || 1}
											</button>
											{levelMenuOpen && (
												<>
													<div
														className='fixed inset-0 z-40'
														onClick={() => setLevelMenuOpen(false)}
													/>
													<div className='absolute top-full right-0 z-50 mt-1 rounded bg-white shadow-lg'>
														{[1, 2, 3].map((level) => (
															<button
																key={level}
																onClick={() => {
																	handleUpdateField("level", level);
																	setLevelMenuOpen(false);
																}}
																className='block w-full px-4 py-2 text-left text-sm hover:bg-gray-100'>
																H{level}
															</button>
														))}
													</div>
												</>
											)}
										</div>
									}
								/>
							</div>
						)}

						<span className='group/heading relative inline-block'>
							<HeadingTag
								className={`font-anton mt-4 md:mt-8 lg:mt-12 xl:mt-14 ${headingClasses}`}
								style={headingInlineStyles}>
								{isEditMode ? (
									<EditableText
										value={block.text}
										onChange={(val) => handleUpdateField("text", val)}
										className='font-anton'
										modalDefaultStyles={resolvedTextStyles}
										placeholder='Heading...'
									/>
								) : (
									<RichText html={block.text} as='span' />
								)}
							</HeadingTag>
						</span>
					</div>
				);

			case "list":
				return (
					<div className='group relative'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons
									onMoveUp={onMoveUp}
									onMoveDown={onMoveDown}
									onDelete={onDelete}
									extraButtons={
										<button
											onClick={handleAddItem}
											className='rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700'>
											+ Item
										</button>
									}
								/>
							</div>
						)}

						<div className='font-montserrat mt-2 rounded-lg bg-white p-3 text-base shadow-[0_8px_12px_rgba(0,0,0,0.20),0_-5px_12px_1px_rgba(0,0,0,0.20)] sm:rounded-xl sm:shadow-[0_9px_13px_rgba(0,0,0,0.22),0_-6px_13px_1.5px_rgba(0,0,0,0.22)] md:mt-4 md:rounded-2xl md:p-5 md:text-xl md:shadow-[0_10px_14px_rgba(0,0,0,0.25),0_-7px_14px_2px_rgba(0,0,0,0.25)] lg:mt-6 lg:rounded-3xl lg:p-7 lg:text-2xl lg:shadow-[0_11px_15px_rgba(0,0,0,0.27),0_-8px_15px_2px_rgba(0,0,0,0.27)] xl:mt-8 xl:rounded-4xl xl:p-9 xl:shadow-[0_12px_16px_rgba(0,0,0,0.30),0_-9px_16px_2.5px_rgba(0,0,0,0.30)]'>
							<ul className='m-6 list-disc space-y-4 xl:mt-8'>
								{(block.items || []).map((item, index) => {
									const labelStyles = mergeStyles(
										resolvedItemLabelDefaults,
										item.labelStyles,
									);
									const textStyles = mergeStyles(
										resolvedItemTextDefaults,
										item.textStyles,
									);
									const labelClasses = getStyleClasses(labelStyles);
									const labelInlineStyles = getInlineStyles(labelStyles);
									const textClasses = getStyleClasses(textStyles);
									const textInlineStyles = getInlineStyles(textStyles);

									return (
										<li key={index} className='text-primary'>
											<span className='group/itemlabel'>
												{isEditMode ? (
													<>
														<EditableText
															value={item.label}
															onChange={(val) =>
																handleUpdateItem(index, "label", val)
															}
															className={`font-semibold ${labelClasses}`}
															style={labelInlineStyles}
															modalDefaultStyles={labelStyles}
															as='span'
														/>
													</>
												) : (
													<b className={labelClasses} style={labelInlineStyles}>
														<RichText html={item.label} as='span' />
													</b>
												)}
											</span>
											<span className='text-black group/itemtext'>
												{isEditMode ? (
													<>
														<EditableText
															value={item.text}
															onChange={(val) =>
																handleUpdateItem(index, "text", val)
															}
															className={textClasses}
															style={textInlineStyles}
															modalDefaultStyles={textStyles}
															as='span'
														/>
													</>
												) : (
													<span
														className={textClasses}
														style={textInlineStyles}>
														<RichText html={item.text} as='span' />
													</span>
												)}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				);
			case "features":
				return (
					<div className='relative'>
						{isEditMode && (
							<button
								onClick={handleAddItem}
								className='mb-2 w-full rounded-lg border-2 border-dashed border-green-400 bg-green-50 p-2 text-sm font-semibold text-green-600 hover:bg-green-100'>
								+ Add Feature
							</button>
						)}
						{(block.items || []).map((item, index) => {
							const labelStyles = mergeStyles(
								resolvedItemLabelDefaults,
								item.labelStyles,
							);
							const textStyles = mergeStyles(
								resolvedItemTextDefaults,
								item.textStyles,
							);
							const labelClasses = getStyleClasses(labelStyles);
							const labelInlineStyles = getInlineStyles(labelStyles);
							const textClasses = getStyleClasses(textStyles);
							const textInlineStyles = getInlineStyles(textStyles);

							return (
								<div
									key={index}
									className='group/feature relative mt-2 flex items-start gap-4 rounded-lg p-5 shadow-[0_0_10px_rgba(0,0,0,0.20)] md:mt-4 md:rounded-xl lg:mt-6 lg:rounded-2xl'>
									{isEditMode && (
										<div className='absolute top-2 right-2 opacity-0 transition-opacity group-hover/feature:opacity-100'>
											<ControlButtons
												onMoveUp={
													index > 0 ? () => handleMoveItem(index, "up") : null
												}
												onMoveDown={
													index < block.items.length - 1
														? () => handleMoveItem(index, "down")
														: null
												}
												onDelete={() => handleDeleteItem(index)}
											/>
										</div>
									)}
									<img
										src='/images/arrow.png'
										className='mt-1 w-4 flex-shrink-0 md:w-6 lg:w-8'
										alt='arrow'
									/>
									<div className='font-montserrat flex-1 text-base md:text-xl lg:text-2xl'>
										<span className='group/featlabel relative inline-block'>
											{isEditMode ? (
												<>
													<EditableText
														value={item.label}
														onChange={(val) =>
															handleUpdateItem(index, "label", val)
														}
														className={labelClasses}
														style={labelInlineStyles}
														modalDefaultStyles={labelStyles}
														as='b'
													/>
												</>
											) : (
												<RichText
													html={item.label}
													className={labelClasses}
													style={labelInlineStyles}
													as='b'
												/>
											)}
										</span>{" "}
										<span className='group/feattext relative inline-block'>
											{isEditMode ? (
												<>
													<EditableText
														value={item.text}
														onChange={(val) =>
															handleUpdateItem(index, "text", val)
														}
														className={textClasses}
														style={textInlineStyles}
														modalDefaultStyles={textStyles}
														multiline={true}
													/>
												</>
											) : (
												<RichText
													html={item.text}
													className={textClasses}
													style={textInlineStyles}
												/>
											)}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				);

			case "protip":
				return (
					<div className='group relative'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons onDelete={onDelete} />
							</div>
						)}
						<ProTipBlock
							protip={block}
							onUpdate={(updated) => onUpdate({ ...block, ...updated })}
							isEditMode={isEditMode}
							textDefaults={blockDefaults.textStyles}
							highlightDefaults={blockDefaults.highlightStyles}
						/>
					</div>
				);

			case "image": {
				const imageStyles = block.imageStyles || {};
				const imageInlineStyles = getImageInlineStyles(imageStyles);
				const imageWrapperStyles = getImageWrapperStyles(imageStyles);

				return (
					<div className='group relative my-4 md:my-6'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons
									onMoveUp={onMoveUp}
									onMoveDown={onMoveDown}
									onDelete={onDelete}
									extraButtons={
										<button
											onClick={() => setShowImageStyleEditor(true)}
											className='rounded bg-indigo-600 px-2 py-1 text-xs text-white'>
											Edit
										</button>
									}
								/>
							</div>
						)}
						<ImageEditor
							src={block.src}
							alt={block.alt}
							seo={block.seo}
							onUpdate={({ src, alt, seo }) =>
								onUpdate({ ...block, src, alt, seo })
							}
							isEditMode={isEditMode}
							imageStyles={imageInlineStyles}
							wrapperStyles={imageWrapperStyles}
							onOpenMediaPicker={onOpenMediaPicker}
						/>
						{showImageStyleEditor && (
							<ImageStyleEditor
								styles={imageStyles}
								onUpdate={(newStyles) =>
									onUpdate({ ...block, imageStyles: newStyles })
								}
								onClose={() => setShowImageStyleEditor(false)}
							/>
						)}
					</div>
				);
			}

			case "twoColumn":
				return (
					<div className='group relative'>
						{isEditMode && (
							<div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
								<ControlButtons
									onMoveUp={onMoveUp}
									onMoveDown={onMoveDown}
									onDelete={onDelete}
								/>
							</div>
						)}

						<div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
							<div className='space-y-4'>
								{isEditMode && (
									<div className='mb-3 flex items-center justify-between'>
										<h3 className='font-bold text-gray-700'>Left Column</h3>
										<button
											onClick={() => setShowAddModalLeft(true)}
											className='rounded bg-blue-500 px-3 py-1 text-xs text-white'>
											+ Add
										</button>
									</div>
								)}

								{(block.leftColumn || []).map((item, index) => (
									<div key={index}>
										<ContentBlock
											block={item}
											onUpdate={(newContent) =>
												handleUpdateColumnContent(
													"leftColumn",
													index,
													newContent,
												)
											}
											onDelete={() =>
												handleDeleteColumnContent("leftColumn", index)
											}
											onMoveUp={
												index > 0
													? () =>
															handleMoveColumnContent("leftColumn", index, "up")
													: null
											}
											onMoveDown={
												index < block.leftColumn.length - 1
													? () =>
															handleMoveColumnContent(
																"leftColumn",
																index,
																"down",
															)
													: null
											}
											isEditMode={isEditMode}
											onAddAfter={() => {
												setAddAfterIndexLeft(index);
												setShowAddModalLeft(true);
											}}
											columnPath={[...columnPath, "leftColumn", index]}
											onOpenMediaPicker={onOpenMediaPicker}
										/>
									</div>
								))}

								{block.leftColumn.length === 0 && isEditMode && (
									<p className='text-center text-sm text-gray-400'>
										Click "+ Add"
									</p>
								)}
							</div>

							<div className='space-y-4'>
								{isEditMode && (
									<div className='mb-3 flex items-center justify-between'>
										<h3 className='font-bold text-gray-700'>Right Column</h3>
										<button
											onClick={() => setShowAddModalRight(true)}
											className='rounded bg-green-500 px-3 py-1 text-xs text-white'>
											+ Add
										</button>
									</div>
								)}

								{(block.rightColumn || []).map((item, index) => (
									<div key={index}>
										<ContentBlock
											block={item}
											onUpdate={(newContent) =>
												handleUpdateColumnContent(
													"rightColumn",
													index,
													newContent,
												)
											}
											onDelete={() =>
												handleDeleteColumnContent("rightColumn", index)
											}
											onMoveUp={
												index > 0
													? () =>
															handleMoveColumnContent(
																"rightColumn",
																index,
																"up",
															)
													: null
											}
											onMoveDown={
												index < block.rightColumn.length - 1
													? () =>
															handleMoveColumnContent(
																"rightColumn",
																index,
																"down",
															)
													: null
											}
											isEditMode={isEditMode}
											onAddAfter={() => {
												setAddAfterIndexRight(index);
												setShowAddModalRight(true);
											}}
											columnPath={[...columnPath, "rightColumn", index]}
											onOpenMediaPicker={onOpenMediaPicker}
										/>
									</div>
								))}

								{block.rightColumn.length === 0 && isEditMode && (
									<p className='text-center text-sm text-gray-400'>
										Click "+ Add"
									</p>
								)}
							</div>
						</div>

						{showAddModalLeft && (
							<AddContentModal
								onAdd={(newContent) => {
									handleAddColumnContent(
										"leftColumn",
										newContent,
										addAfterIndexLeft,
									);
									setShowAddModalLeft(false);
									setAddAfterIndexLeft(null);
								}}
								onClose={() => {
									setShowAddModalLeft(false);
									setAddAfterIndexLeft(null);
								}}
							/>
						)}

						{showAddModalRight && (
							<AddContentModal
								onAdd={(newContent) => {
									handleAddColumnContent(
										"rightColumn",
										newContent,
										addAfterIndexRight,
									);
									setShowAddModalRight(false);
									setAddAfterIndexRight(null);
								}}
								onClose={() => {
									setShowAddModalRight(false);
									setAddAfterIndexRight(null);
								}}
							/>
						)}
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<>
			{renderContent()}
			{isEditMode && onAddAfter && columnPath.length === 0 && (
				<button
					onClick={onAddAfter}
					className='my-4 w-full rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 p-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-500 hover:bg-blue-100'>
					+ Add Content Here
				</button>
			)}
		</>
	);
}

export function Step({
	number,
	title,
	titleStyles,
	children,
	onDelete,
	onMoveUp,
	onMoveDown,
	isEditMode,
	onUpdateTitle,
	seo,
	onUpdateSEO,
	onAddStepAfter,
	onAddContent,
}) {
	const [showSEOEditor, setShowSEOEditor] = useState(false);
	const stepTitleClasses = getStyleClasses(titleStyles || {});
	const stepTitleInlineStyles = getInlineStyles(titleStyles || {});
	const stepTitleModalStyles = normalizeStyle(
		titleStyles || {},
		STEP_TITLE_STYLES,
	);

	return (
		<div
			id={seo?.anchor}
			className='group relative rounded-xl p-4 shadow-[1px_0px_10px_rgba(0,0,0,0.5)] sm:rounded-2xl md:rounded-3xl md:p-9 lg:p-10 xl:mt-10'>
			{isEditMode && (
				<div className='absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
					<ControlButtons
						onMoveUp={onMoveUp}
						onMoveDown={onMoveDown}
						onDelete={onDelete}
						extraButtons={
							<div className='flex gap-1'>
								<button
									onClick={() => setShowSEOEditor(true)}
									className='rounded bg-purple-600 px-2 py-1 text-xs text-white'>
									🔍
								</button>
								{onAddContent && (
									<button
										onClick={onAddContent}
										className='rounded bg-blue-600 px-2 py-1 text-xs text-white'>
										+ Add
									</button>
								)}
							</div>
						}
					/>
				</div>
			)}

			<div className='flex gap-2 rounded-lg p-4 shadow-[0_8px_12px_rgba(0,0,0,0.25),0_-5px_12px_1px_rgba(0,0,0,0.25)] sm:rounded-xl md:gap-3 md:rounded-2xl md:p-6 lg:gap-5 lg:rounded-3xl lg:p-8'>
				<div>
					<div className='bg-primary/20 font-anton text-secondary hidden aspect-square w-10 items-center justify-center rounded-full text-[clamp(1rem,3.5vw,4rem)] md:flex md:w-18 lg:w-24'>
						{number}
					</div>
				</div>
				<div className='flex-1'>
					<div className='flex items-center gap-2 sm:mt-5'>
						<div className='bg-primary/20 font-anton text-secondary flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-full text-[clamp(1rem,3.5vw,4rem)] md:hidden'>
							{number}
						</div>

						{isEditMode ? (
							<div className='group/steptitle flex items-center gap-2'>
								<EditableText
									value={title}
									onChange={onUpdateTitle}
									className={`font-anton text-secondary text-[clamp(1rem,3.15vw,3.7rem)] ${stepTitleClasses}`}
									style={stepTitleInlineStyles}
									richText={true}
									editInModal={true}
									modalTitle='Edit Step Title'
									modalDefaultStyles={stepTitleModalStyles}
									as='h1'
								/>
							</div>
						) : (
							<h1
								className={`font-anton text-secondary text-[clamp(1rem,3.15vw,3.7rem)] ${stepTitleClasses}`}
								style={stepTitleInlineStyles}>
								<RichText html={title} as='span' />
							</h1>
						)}
					</div>
					{children}
				</div>
			</div>

			{showSEOEditor && (
				<SectionSEOEditor
					seo={seo}
					onUpdate={onUpdateSEO}
					onClose={() => setShowSEOEditor(false)}
				/>
			)}
			{isEditMode && onAddStepAfter && (
				<button
					onClick={onAddStepAfter}
					className='my-4 w-full rounded-lg border-2 border-dashed border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 p-4 font-bold text-purple-600'>
					+ Add Step After This
				</button>
			)}
		</div>
	);
}

function CalloutBlock({
	data,
	onUpdate,
	isEditMode,
	textDefaults = DISCLAIMER_TEXT_STYLES,
	highlightDefaults = DISCLAIMER_HIGHLIGHT_STYLES,
	wrapperClassName = CALLOUT_WRAPPER_CLASSES.wide,
}) {
	if (!data) return null;

	const resolvedTextStyles = mergeStyles(textDefaults, data.textStyles);
	const resolvedHighlightStyles = mergeStyles(
		highlightDefaults,
		data.highlightStyles,
	);
	const textClasses = getStyleClasses(resolvedTextStyles);
	const textInlineStyles = getInlineStyles(resolvedTextStyles);
	const highlightClasses = getStyleClasses(resolvedHighlightStyles);
	const highlightInlineStyles = getInlineStyles(resolvedHighlightStyles);

	const handleUpdateField = (field, value) => {
		onUpdate({ ...data, [field]: value });
	};

	return (
		<div className={wrapperClassName}>
			<div className='drop-shadow-[2px_-3px_6px_rgba(0,0,0,0.3),-1px_1px_4px_rgba(0,0,0,0.25)] filter sm:drop-shadow-[3px_-4px_8px_rgba(0,0,0,0.35),-2px_2px_6px_rgba(0,0,0,0.3)] md:drop-shadow-[4px_-6px_10px_rgba(0,0,0,0.3),6px_5px_10px_rgba(0,0,0,0.3),-2px_1px_14px_rgba(0,0,0,0.12)] lg:drop-shadow-[5px_-8px_12px_rgba(0,0,0,0.3),8px_7px_12px_rgba(0,0,0,0.3),-3px_2px_17.9px_rgba(0,0,0,0.15),-7px_5px_4px_rgba(0,0,0,0.25),-4px_-6px_4px_rgba(0,0,0,0.20)]'>
				<div className='flex items-start gap-2 rounded-lg bg-white px-2 py-8 [clip-path:polygon(0_0,100%_0,100%_80%,82%_100%,0_100%)] sm:rounded-xl md:[clip-path:polygon(0_0,100%_0,100%_72%,92%_100%,0_100%)] lg:rounded-2xl xl:rounded-3xl'>
					<img
						className='w-4 flex-shrink-0 md:w-6 lg:w-8 xl:w-10'
						src='/images/info.png'
						alt=''
					/>
					<div className='font-montserrat text-[clamp(1rem,2vw,2rem)] lg:text-2xl'>
						{data.highlight && (
							<span className='group/callouthighlight relative inline-block'>
								{isEditMode ? (
									<EditableText
										value={data.highlight}
										onChange={(val) => handleUpdateField("highlight", val)}
										className={highlightClasses}
										style={highlightInlineStyles}
										modalDefaultStyles={resolvedHighlightStyles}
										as='b'
									/>
								) : (
									<RichText
										html={data.highlight}
										className={highlightClasses}
										style={highlightInlineStyles}
										as='b'
									/>
								)}
							</span>
						)}{" "}
						<span className='group/callouttext relative inline-block'>
							{isEditMode ? (
								<EditableText
									value={data.text}
									onChange={(val) => handleUpdateField("text", val)}
									className={textClasses}
									style={textInlineStyles}
									modalDefaultStyles={resolvedTextStyles}
									multiline={true}
									placeholder='Callout...'
								/>
							) : (
								<RichText
									html={data.text}
									className={textClasses}
									style={textInlineStyles}
								/>
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export function DisclaimerBlock({ disclaimer, onUpdate, isEditMode }) {
	return (
		<CalloutBlock
			data={disclaimer}
			onUpdate={onUpdate}
			isEditMode={isEditMode}
			textDefaults={DISCLAIMER_TEXT_STYLES}
			highlightDefaults={DISCLAIMER_HIGHLIGHT_STYLES}
			wrapperClassName={CALLOUT_WRAPPER_CLASSES.wide}
		/>
	);
}

function ProTipBlock({
	protip,
	onUpdate,
	isEditMode,
	textDefaults = BASE_TEXT_STYLES,
	highlightDefaults = BASE_HIGHLIGHT_STYLES,
}) {
	return (
		<CalloutBlock
			data={protip}
			onUpdate={onUpdate}
			isEditMode={isEditMode}
			textDefaults={textDefaults}
			highlightDefaults={highlightDefaults}
			wrapperClassName={CALLOUT_WRAPPER_CLASSES.standard}
		/>
	);
}

export default function BlogLiveEditor({ blogContent, onUpdate }) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showAddTypeModal, setShowAddTypeModal] = useState(false);
	const [showMetadataEditor, setShowMetadataEditor] = useState(false);
	const [addToStepIndex, setAddToStepIndex] = useState(null);
	const [addAfterContentIndex, setAddAfterContentIndex] = useState(null);
	const [showMediaPicker, setShowMediaPicker] = useState(false);
	const [mediaPickerCallback, setMediaPickerCallback] = useState(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(
				BLOG_PREVIEW_STORAGE_KEY,
				JSON.stringify(blogContent),
			);
		} catch {}
	}, [blogContent]);

	// Flat content handlers
	const handleMoveFlatContent = (contentIndex, direction) => {
		const updatedBlog = { ...blogContent };
		if (!updatedBlog.flatContent) updatedBlog.flatContent = [];
		const newIndex = direction === "up" ? contentIndex - 1 : contentIndex + 1;
		const content = updatedBlog.flatContent;
		if (newIndex >= 0 && newIndex < content.length) {
			[content[contentIndex], content[newIndex]] = [
				content[newIndex],
				content[contentIndex],
			];
			onUpdate(updatedBlog);
		}
	};

	const handleAddFlatContent = (newContent, afterIndex = null) => {
		const updatedBlog = { ...blogContent };
		if (!updatedBlog.flatContent) {
			updatedBlog.flatContent = [];
		}
		if (afterIndex !== null) {
			updatedBlog.flatContent.splice(afterIndex + 1, 0, newContent);
		} else {
			updatedBlog.flatContent.push(newContent);
		}
		onUpdate(updatedBlog);
	};

	const handleUpdateFlatContent = (contentIndex, newContent) => {
		const updatedBlog = { ...blogContent };
		if (!updatedBlog.flatContent) {
			updatedBlog.flatContent = [];
		}
		updatedBlog.flatContent[contentIndex] = newContent;
		onUpdate(updatedBlog);
	};

	const handleDeleteFlatContent = (contentIndex) => {
		if (confirm("Delete content?")) {
			const updatedBlog = { ...blogContent };
			if (updatedBlog.flatContent) {
				updatedBlog.flatContent.splice(contentIndex, 1);
				onUpdate(updatedBlog);
			}
		}
	};

	// Steps content handlers
	const handleMoveContent = (stepIndex, contentIndex, direction) => {
		const updatedBlog = { ...blogContent };
		const newIndex = direction === "up" ? contentIndex - 1 : contentIndex + 1;
		const content = updatedBlog.steps[stepIndex].content;
		if (newIndex >= 0 && newIndex < content.length) {
			[content[contentIndex], content[newIndex]] = [
				content[newIndex],
				content[contentIndex],
			];
			onUpdate(updatedBlog);
		}
	};

	const handleAddContent = (stepIndex, newContent, afterIndex = null) => {
		const updatedBlog = { ...blogContent };
		if (afterIndex !== null) {
			updatedBlog.steps[stepIndex].content.splice(
				afterIndex + 1,
				0,
				newContent,
			);
		} else {
			updatedBlog.steps[stepIndex].content.push(newContent);
		}
		onUpdate(updatedBlog);
	};
	const handleUpdateContent = (stepIndex, contentIndex, newContent) => {
		const updatedBlog = { ...blogContent };
		updatedBlog.steps[stepIndex].content[contentIndex] = newContent;
		onUpdate(updatedBlog);
	};

	const handleDeleteContent = (stepIndex, contentIndex) => {
		if (confirm("Delete content?")) {
			const updatedBlog = { ...blogContent };
			updatedBlog.steps[stepIndex].content.splice(contentIndex, 1);
			onUpdate(updatedBlog);
		}
	};

	const handleUpdateStepTitle = (stepIndex, newTitle) => {
		const updatedBlog = { ...blogContent };
		updatedBlog.steps[stepIndex].title = newTitle;
		onUpdate(updatedBlog);
	};

	const handleUpdateStepSEO = (stepIndex, newSEO) => {
		const updatedBlog = { ...blogContent };
		updatedBlog.steps[stepIndex].seo = newSEO;
		onUpdate(updatedBlog);
	};

	const handleDeleteStep = (stepIndex) => {
		if (confirm("Delete step?")) {
			const updatedBlog = { ...blogContent };
			updatedBlog.steps.splice(stepIndex, 1);
			updatedBlog.steps.forEach((step, index) => {
				step.number = index + 1;
			});
			onUpdate(updatedBlog);
		}
	};

	const handleMoveStep = (stepIndex, direction) => {
		const updatedBlog = { ...blogContent };
		const newIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
		if (newIndex >= 0 && newIndex < updatedBlog.steps.length) {
			[updatedBlog.steps[stepIndex], updatedBlog.steps[newIndex]] = [
				updatedBlog.steps[newIndex],
				updatedBlog.steps[stepIndex],
			];
			updatedBlog.steps.forEach((step, index) => {
				step.number = index + 1;
			});
			onUpdate(updatedBlog);
		}
	};

	const handleAddStep = (afterIndex = null) => {
		const updatedBlog = { ...blogContent };
		if (!updatedBlog.steps) {
			updatedBlog.steps = [];
		}
		const newStep = {
			number: updatedBlog.steps.length + 1,
			title: "New Step",
			titleStyles: cloneStyles(STEP_TITLE_STYLES),
			seo: { anchor: `step-${updatedBlog.steps.length + 1}` },
			content: [],
		};
		if (afterIndex !== null) {
			updatedBlog.steps.splice(afterIndex + 1, 0, newStep);
			updatedBlog.steps.forEach((step, index) => {
				step.number = index + 1;
			});
		} else {
			updatedBlog.steps.push(newStep);
		}
		onUpdate(updatedBlog);
	};

	const handleUpdateDisclaimer = (disclaimer) => {
		onUpdate({ ...blogContent, disclaimer });
	};

	const handleExport = () => {
		const dataStr = JSON.stringify(blogContent, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `blog-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					onUpdate(JSON.parse(event.target.result));
					alert("Imported!");
				} catch {
					alert("Invalid file");
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<>
			<SEOHead
				metadata={blogContent.metadata}
				structuredData={blogContent.structuredData}
			/>
			<div className='min-h-screen bg-gray-50 '>
				{/* Clean Header Bar */}
				<div className='sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm'>
					<div className='mx-auto max-w-7xl px-4 py-4'>
						<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
							<div className='flex items-center gap-3'>
								<Link
									href='/dashboard/blogs'
									className='rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50'>
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</Link>
								<div>
									<h1 className='font-anton text-xl text-gray-900'>
										Blog Editor
									</h1>
									<p className='font-montserrat text-xs text-gray-500'>
										Create and edit your blog post
									</p>
								</div>
							</div>
							<div className='flex flex-wrap gap-2'>
								{isEditMode && (
									<button
										onClick={() => setShowMetadataEditor(true)}
										className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
										SEO Settings
									</button>
								)}
								<label className='cursor-pointer rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
									Import
									<input
										type='file'
										accept='.json'
										onChange={handleImport}
										className='hidden'
									/>
								</label>
								<button
									onClick={handleExport}
									className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
									Export
								</button>
								<button
									onClick={() => setIsEditMode(!isEditMode)}
									className={`rounded-lg px-6 py-2 font-montserrat text-sm font-semibold transition-colors ${isEditMode ? "bg-primary text-white hover:bg-primary/90" : "border border-primary text-primary hover:bg-primary hover:text-white"}`}>
									{isEditMode ? "Preview" : "Edit Mode"}
								</button>
							</div>
						</div>
					</div>
				</div>

				<section className='font-montserrat mx-auto max-w-7xl px-4 py-8 ql-editor'>
					{/* FLAT CONTENT */}
					{(blogContent.flatContent || []).map((block, contentIndex) => (
						<ContentBlock
							key={`flat-${contentIndex}`}
							block={block}
							onUpdate={(c) => handleUpdateFlatContent(contentIndex, c)}
							onDelete={() => handleDeleteFlatContent(contentIndex)}
							onMoveUp={
								contentIndex > 0
									? () => handleMoveFlatContent(contentIndex, "up")
									: null
							}
							onMoveDown={
								contentIndex < (blogContent.flatContent || []).length - 1
									? () => handleMoveFlatContent(contentIndex, "down")
									: null
							}
							isEditMode={isEditMode}
							onAddAfter={() => {
								setAddToStepIndex(null);
								setAddAfterContentIndex(contentIndex);
								setShowAddModal(true);
							}}
							onOpenMediaPicker={(callback) => {
								setMediaPickerCallback(() => callback);
								setShowMediaPicker(true);
							}}
						/>
					))}

					{/* STEPS CONTENT */}
					{(blogContent.steps || []).map((step, stepIndex) => (
						<Step
							key={step.number}
							number={step.number}
							title={step.title}
							titleStyles={step.titleStyles}
							seo={step.seo}
							onUpdateTitle={(t) => handleUpdateStepTitle(stepIndex, t)}
							onUpdateSEO={(s) => handleUpdateStepSEO(stepIndex, s)}
							onDelete={() => handleDeleteStep(stepIndex)}
							onMoveUp={
								stepIndex > 0 ? () => handleMoveStep(stepIndex, "up") : null
							}
							onMoveDown={
								stepIndex < (blogContent.steps || []).length - 1
									? () => handleMoveStep(stepIndex, "down")
									: null
							}
							isEditMode={isEditMode}
							onAddStepAfter={() => handleAddStep(stepIndex)}
							onAddContent={() => {
								setAddToStepIndex(stepIndex);
								setAddAfterContentIndex(null);
								setShowAddModal(true);
							}}>
							{isEditMode && step.content.length === 0 && (
								<div className='mt-4 flex flex-col items-start gap-2'>
									<div className='text-sm text-slate-500'>No content yet.</div>
									<button
										onClick={() => {
											setAddToStepIndex(stepIndex);
											setAddAfterContentIndex(null);
											setShowAddModal(true);
										}}
										className='rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-md hover:bg-slate-800'>
										+ Add Content
									</button>
								</div>
							)}
							{step.content.map((block, contentIndex) => (
								<ContentBlock
									key={contentIndex}
									block={block}
									onUpdate={(c) =>
										handleUpdateContent(stepIndex, contentIndex, c)
									}
									onDelete={() => handleDeleteContent(stepIndex, contentIndex)}
									onMoveUp={
										contentIndex > 0
											? () => handleMoveContent(stepIndex, contentIndex, "up")
											: null
									}
									onMoveDown={
										contentIndex < step.content.length - 1
											? () => handleMoveContent(stepIndex, contentIndex, "down")
											: null
									}
									isEditMode={isEditMode}
									onAddAfter={() => {
										setAddToStepIndex(stepIndex);
										setAddAfterContentIndex(contentIndex);
										setShowAddModal(true);
									}}
									onOpenMediaPicker={(callback) => {
										setMediaPickerCallback(() => callback);
										setShowMediaPicker(true);
									}}
								/>
							))}
						</Step>
					))}

					{isEditMode && (
						<button
							onClick={() => setShowAddTypeModal(true)}
							className='my-8 w-full rounded-lg border-2 border-dashed border-primary/30 bg-tealSoft p-6 font-anton text-lg text-primary transition-colors hover:border-primary hover:bg-primary/10'>
							+ Add New
						</button>
					)}

					<DisclaimerBlock
						disclaimer={blogContent.disclaimer}
						onUpdate={handleUpdateDisclaimer}
						isEditMode={isEditMode}
					/>
				</section>

				{showAddModal && (
					<AddContentModal
						onAdd={(c) => {
							if (addToStepIndex !== null) {
								handleAddContent(addToStepIndex, c, addAfterContentIndex);
							} else {
								handleAddFlatContent(c, addAfterContentIndex);
							}
							setShowAddModal(false);
						}}
						onClose={() => setShowAddModal(false)}
					/>
				)}

				{showAddTypeModal && (
					<AddTypeModal
						onSelectType={(type) => {
							if (type === "step") {
								handleAddStep();
							} else if (type === "flat") {
								setAddToStepIndex(null);
								setAddAfterContentIndex(null);
								setShowAddModal(true);
							}
							setShowAddTypeModal(false);
						}}
						onClose={() => setShowAddTypeModal(false)}
					/>
				)}

				{showMetadataEditor && (
					<MetadataEditor
						metadata={blogContent.metadata}
						structuredData={blogContent.structuredData}
						onUpdate={({ metadata, structuredData }) => {
							onUpdate({
								...blogContent,
								metadata,
								structuredData,
							});
							setShowMetadataEditor(false);
						}}
						onClose={() => setShowMetadataEditor(false)}
					/>
				)}

				{showMediaPicker && (
					<MediaPickerModal
						isOpen={showMediaPicker}
						onClose={() => {
							setShowMediaPicker(false);
							setMediaPickerCallback(null);
						}}
						onSelect={(file) => {
							if (mediaPickerCallback) {
								mediaPickerCallback(file);
							}
							setShowMediaPicker(false);
							setMediaPickerCallback(null);
						}}
						allowedTypes={["image"]}
					/>
				)}
			</div>
		</>
	);
}
