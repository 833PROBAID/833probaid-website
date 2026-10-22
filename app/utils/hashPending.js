/**
 * Hides a page opened with a #hash until useHashPin has scrolled it to the
 * target, so the viewer never sees the wrong position first.
 *
 * The script is inlined ahead of the page markup (see HashPendingGuard) so it
 * runs before the first paint; React can't do this, since effects only run
 * after the page is shown. It also stops the browser restoring the previous
 * scroll position on refresh. The timeout is a safety net that reveals the page
 * if the client bundle never runs.
 */
export const HASH_PENDING_ATTR = "data-hash-pending";

export const HASH_PENDING_SCRIPT = `(function(){if(location.hash.length<2)return;var d=document.documentElement;d.setAttribute("${HASH_PENDING_ATTR}","");try{history.scrollRestoration="manual"}catch(e){}setTimeout(function(){d.removeAttribute("${HASH_PENDING_ATTR}")},4000)})();`;

/**
 * Covers the page instead of hiding it (opacity/visibility): WebKit treats a
 * hidden body as visually empty and holds back the first render for ~3s, and
 * with it the frames and resize observations useHashPin relies on.
 */
export const HASH_PENDING_CSS = `html[${HASH_PENDING_ATTR}]::after{content:"";position:fixed;inset:0;z-index:2147483647;background:#fff}`;
