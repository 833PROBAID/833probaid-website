/**
 * Preview of homebook content changes, outside the live site.
 *
 * Homebook content lives in the database, and edits saved from /dashboard go
 * live immediately. This lets a change be previewed first: it rewrites the
 * HTML on its way to the page — on `npm run dev` and on Vercel preview
 * deployments (branch URLs such as the Inna one), never on the production
 * site. The database is never touched.
 *
 * Once a change is approved, make it for real in the /dashboard editor and
 * remove its entry here.
 */

/** Returns the full `<section id="…">…</section>` markup, or null. */
function findSection(html, id) {
	const start = html.indexOf(`<section id="${id}"`);
	if (start === -1) return null;
	const tag = /<(\/?)section\b/g;
	tag.lastIndex = start;
	let depth = 0;
	let match;
	while ((match = tag.exec(html))) {
		depth += match[1] ? -1 : 1;
		if (depth === 0) return html.slice(start, html.indexOf(">", match.index) + 1);
	}
	return null;
}

// your-resource-center: a red-framed (#E51B23) container above "COURT
// REQUIRING A SURETY BOND?", holding a copy of the content of the top
// container ("A RESOURCE FOR YOUR ENTIRE JOURNEY…"). Runs after
// resourceCenterFrames, so that container is already framed. Inline style,
// because Tailwind only generates classes it finds in the source, and this
// colour isn't there. Inner ids are kept so the copy gets the same
// per-element styles the editor saved for them.
function resourceRedCopy(html) {
	const heading = '<section id="court-required-surety-bond"';
	const container = findSection(html, "intro");
	const frame = 'class="content-block shadow-card !bg-secondary step-container"';
	if (!container || !container.includes(frame) || !html.includes(heading)) return html;
	const copy = container
		.replace(
			'<section id="intro" class="!mb-[2.5rem]"',
			'<section id="intro-red" class="!mt-[2.5rem] !mb-[2.5rem]"'
		)
		.replace(frame, 'class="content-block shadow-card step-container" style="background-color:#E51B23"');
	return html.replace(heading, copy + heading);
}

// Puts a white step-container inside a coloured frame, the way the framed
// containers further down the page are built: coloured step-container >
// white `!mt-0 !p-[1.5rem]` panel > the original content.
function frameSection(html, id, bgClass) {
	const section = findSection(html, id);
	const plain = '<div class="content-block shadow-card step-container">';
	if (!section || !section.includes(plain)) return html;
	const framed = section
		.replace(
			plain,
			`<div class="content-block shadow-card ${bgClass} step-container"><div class="content-block shadow-card !mt-0 !p-[1.5rem]">`
		)
		.replace(/<\/section>$/, "</div></section>");
	return html.replace(section, framed);
}

// your-resource-center: frame the first three containers orange / teal /
// orange, like the ones below them.
function resourceCenterFrames(html) {
	html = frameSection(html, "intro", "!bg-secondary");
	html = frameSection(html, "intro-3", "!bg-primary");
	html = frameSection(html, "intro-3-2", "!bg-secondary");
	return html;
}

// A heading framed in orange starts teal and turns orange on hover (of the
// heading or of its container). Only the colour changes: .text-secondary is
// kept because the page's saved CSS sizes `.section-title.text-secondary`
// (4rem), and the important Tailwind colours win over that CSS's colours.
const TEAL_HEADING =
	"!text-primary hover:!text-secondary [.content-block:hover_&]:!text-secondary";

function tealHeading(html, sectionId, headingId) {
	const section = findSection(html, sectionId);
	const from = `<h2 id="${headingId}" class="section-title text-secondary`;
	if (!section || !section.includes(from)) return html;
	return html.replace(section, section.replace(from, `${from} ${TEAL_HEADING}`));
}

const PREVIEWS = {
	"your-resource-center": (html) => {
		html = resourceRedCopy(resourceCenterFrames(html));
		// After the red copy is taken, so only the orange-framed originals change.
		html = tealHeading(html, "intro", "i2wmw");
		html = tealHeading(html, "intro-3-2", "i2wmw-4-3");
		return html;
	},
};

// Vercel sets VERCEL_ENV to "preview" on branch deployments and to
// "production" on the live site; NODE_ENV is "production" on both.
const PREVIEW_ENABLED =
	process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

export function applyLocalPreview(slug, html) {
	if (!PREVIEW_ENABLED) return html;
	const preview = PREVIEWS[slug];
	return preview ? preview(html) : html;
}
