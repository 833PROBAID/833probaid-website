import { radioPillHTML } from "./GrapesjsCustomBlocks";

/**
 * Extra buttons for the rich-text toolbar that pops up when text is selected
 * inside a text component (next to bold / italic / link / wrap).
 *
 * "Radio button" turns the selection into a radio pill — the same markup the
 * Radio Button block drops, so a question can be written as ordinary copy and
 * then have its answers converted in place. The action toggles: with the caret
 * inside an existing pill the button lights up and pressing it unwraps the
 * pill back to plain text.
 */

// GrapesJS action states (RichTextEditorActionState is internal to the lib).
const ACTIVE = 1;
const INACTIVE = 0;

// GrapesJS selects whatever carries this attribute once the RTE closes, then
// strips it — the built-in link action works the same way.
const SELECT_ATTR = "data-selectme";

// MDI "radiobox-marked", sized like the built-in link/wrap SVG icons.
const RADIO_ICON = `<svg viewBox="0 0 24 24">
	<path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
</svg>`;

/** "Not sure yet" -> "not-sure-yet", so the radio submits a readable value. */
const slugify = (text) =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const toElement = (node) =>
	node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;

/** The `.radio-pill` the current selection sits in, if any. */
const getPill = (rte) => {
	const { anchorNode, focusNode } = rte?.selection() || {};
	return (
		toElement(anchorNode)?.closest?.(".radio-pill") ||
		toElement(focusNode)?.closest?.(".radio-pill") ||
		null
	);
};

/** Replaces a pill with its label text and leaves that text selected. */
const unwrapPill = (rte, pill) => {
	const doc = rte.doc || pill.ownerDocument;
	const label = pill.querySelector(".radio-pill-label");
	const text = doc.createTextNode(label?.textContent || pill.textContent || "");
	pill.replaceWith(text);

	const selection = doc.getSelection();
	const range = doc.createRange();
	range.selectNodeContents(text);
	selection?.removeAllRanges();
	selection?.addRange(range);
	rte.updateActiveActions();
};

const loadRteActions = (editor) => {
	editor.RichTextEditor.add("radio-pill", {
		icon: RADIO_ICON,
		attributes: {
			title: "Radio button",
			style: "font-size:1.4rem;padding:0 4px 2px;",
		},
		state: (rte) => (rte?.selection() && getPill(rte) ? ACTIVE : INACTIVE),
		result: (rte) => {
			const pill = getPill(rte);
			if (pill) return unwrapPill(rte, pill);

			// Selections spanning line breaks would otherwise carry newlines
			// into the pill label.
			const selected = `${rte.selection() || ""}`.replace(/\s+/g, " ").trim();
			const label = selected || "Option";
			rte.insertHTML(
				radioPillHTML({
					label,
					value: slugify(label) || "option-1",
					attrs: SELECT_ATTR,
				}),
				{ select: true }
			);
		},
	});
};

export default loadRteActions;
