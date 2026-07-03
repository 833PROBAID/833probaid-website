/**
 * Removes empty container elements from GrapesJS-generated HTML so they don't
 * leave visible blank areas (they often carry padding/margin classes).
 *
 * An element is considered empty when it contains nothing but whitespace,
 * `&nbsp;`, or `<br>` — i.e. no text and no media/void children (img, svg,
 * iframe, video, hr, input, …). Those media elements are NOT in the tag list
 * below, so any container holding one is preserved.
 *
 * The replacement runs in a loop until the output stops changing, which
 * cascades correctly through nesting: an inner empty <div> is removed first,
 * which then makes its wrapping <section> empty, so it's removed on the next
 * pass.
 *
 * The `referral-intake` / `vendor-intake` placeholders are intentionally empty
 * in the raw HTML — React portals their form content in on the client — so the
 * negative lookahead below keeps them (and therefore their wrappers) intact.
 */

// Container tags safe to drop when they render nothing.
const EMPTY_TAGS =
  "section|div|p|span|article|header|footer|aside|ul|ol|li|figure|figcaption|h[1-6]";

// IDs whose (deliberately empty) elements must never be stripped.
const PRESERVE_IDS = "referral-intake|vendor-intake";

const EMPTY_ELEMENT_RE = new RegExp(
  `<(${EMPTY_TAGS})\\b(?![^>]*\\b(?:${PRESERVE_IDS})\\b)[^>]*>(?:\\s|&nbsp;|<br\\s*/?>)*<\\/\\1>`,
  "gi",
);

export function stripEmptyHtml(html) {
  if (!html) return "";
  let out = html;
  let prev;
  do {
    prev = out;
    out = out.replace(EMPTY_ELEMENT_RE, "");
  } while (out !== prev);
  return out;
}
