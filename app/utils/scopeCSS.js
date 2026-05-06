/**
 * Scopes GrapesJS-generated CSS to a container class to prevent style leakage
 * into the rest of the page. At-rules (@media, @keyframes, etc.) and :root
 * selectors are passed through unchanged; html/body rules are stripped.
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
          return t.startsWith(scope) ? t : `${scope} ${t}`;
        })
        .join(", ");
      return `${scoped} { ${declarations} }`;
    },
  );
}
