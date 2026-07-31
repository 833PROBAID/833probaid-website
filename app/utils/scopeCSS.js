/**
 * Scopes GrapesJS-generated CSS to a container class to prevent style leakage
 * into the rest of the page. At-rules (@media, @keyframes, etc.) and :root
 * selectors are passed through unchanged; html/body rules are stripped.
 *
 * Any element (or subtree) that carries the data-no-scope attribute is
 * automatically excluded from all scoped rules — no configuration needed.
 */

/**
 * Matches a whole @keyframes block, including its nested percentage rules.
 * These must be passed through untouched: the scoping pass below sees the
 * nested `0% { … }` rules as ordinary rules and would rewrite them into
 * `.scope 0%:not([data-no-scope])`, silently killing the animation.
 */
const KEYFRAMES_BLOCK =
  /@(?:-webkit-|-moz-|-o-)?keyframes\s+[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/gi;

export function scopeCSS(css, scope) {
  if (!css) return "";
  let out = "";
  let cursor = 0;
  for (const match of css.matchAll(KEYFRAMES_BLOCK)) {
    out += scopeRules(css.slice(cursor, match.index), scope) + match[0];
    cursor = match.index + match[0].length;
  }
  return out + scopeRules(css.slice(cursor), scope);
}

function scopeRules(css, scope) {
  if (!css) return "";
  return css.replace(
    /([^{}]+)\{([^{}]*)\}/g,
    (match, selector, declarations) => {
      const s = selector.trim();
      if (s.startsWith("@")) return match;
      if (s.includes(":root")) return match;
      if (s === "html" || s === "body") return "";
      if (s.startsWith(scope)) return match;
      const scoped = s
        .split(",")
        .map((sel) => {
          const t = sel.trim();
          const prefixed = t.startsWith(scope) ? t : `${scope} ${t}`;
          return `${prefixed}:not([data-no-scope]):not([data-no-scope] *)`;
        })
        .join(", ");
      return `${scoped} { ${declarations} }`;
    },
  );
}
