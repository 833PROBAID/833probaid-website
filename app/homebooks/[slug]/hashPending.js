/**
 * Hides a home book page opened with a #hash until HomeBookContentClient has
 * scrolled it to the target, so the viewer never sees the wrong position first.
 *
 * The script is inlined ahead of the page markup so it runs before the first
 * paint; React can't do this, since effects only run after the page is shown.
 * It also stops the browser restoring the previous scroll position on refresh.
 * The timeout is a safety net that reveals the page if the client bundle never
 * runs.
 */
export const HASH_PENDING_ATTR = "data-hash-pending";

/** Space kept above a #hash target, clearing the sticky navbar. */
export const HASH_OFFSET_PX = 200;

export const HASH_PENDING_SCRIPT = `(function(){if(location.hash.length<2)return;var d=document.documentElement;d.setAttribute("${HASH_PENDING_ATTR}","");try{history.scrollRestoration="manual"}catch(e){}setTimeout(function(){d.removeAttribute("${HASH_PENDING_ATTR}")},4000)})();`;

/**
 * Besides the hiding rule, gives every content anchor the same offset the
 * client scrolls to, so the browser's own fragment jumps (which can still fire
 * late, e.g. on `load`) land on the same spot instead of flush with the top.
 */
export const HASH_PENDING_CSS = `html[${HASH_PENDING_ATTR}] body{opacity:0}.homebook-content [id]{scroll-margin-top:${HASH_OFFSET_PX}px}`;
