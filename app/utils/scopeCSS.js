/**
 * Scopes GrapesJS-generated CSS to a container class to prevent style leakage
 * into the rest of the page. At-rules (@media, @keyframes, etc.) and :root
 * selectors are passed through unchanged; html/body rules are stripped.
 *
 * Any element (or subtree) that carries the data-no-scope attribute is
 * automatically excluded from all scoped rules — no configuration needed.
 */

export function scopeCSS(css, scope) {
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
