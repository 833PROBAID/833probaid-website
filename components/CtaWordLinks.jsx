"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Site-wide inline CTA wiring for underlined keywords.
 *
 * Certain words show up underlined all over the site: hard-coded in React
 * pages, and inside CMS/GrapesJS HTML that is injected with
 * dangerouslySetInnerHTML (home books, blogs) where we can't reach them from
 * JSX. Rather than patching every source, this scans the rendered DOM and
 * makes every *underlined* occurrence open its destination:
 *
 *   SOLD              -> the seller guide PDF (new tab)
 *   FORM              -> the referral intake home book (same tab)
 *   NOW in "call now" -> tel:8337762243
 *
 * Rules:
 *  - SOLD / FORM only touch underlined occurrences (plain "sold" / "form" in
 *    body copy stays plain text); NOW is styled wherever "call now" appears,
 *    underlined or not;
 *  - a rule may highlight just one capture group of its pattern (`wrapGroup`),
 *    which is how "call now" leaves the "call" untouched;
 *  - if the word already sits inside a link / clickable element, that element
 *    is re-pointed at the destination instead of nesting a new anchor
 *    (skipped for NOW, so a "Call Now" button keeps its own destination);
 *  - otherwise just the word itself is wrapped in an anchor / span.
 *
 * Styling (primary colour, uppercase, thicker underline) lives in
 * app/global.css under .sold-cta / .form-cta / .now-cta and friends so it
 * applies at first paint too.
 */

const RULES = [
  {
    word: /\bsold\b/i,
    href: "/books/seller-guide.pdf",
    newTab: true,
    attr: "data-sold-guide",
    linkClass: "sold-guide-link",
    markerClass: "sold-cta",
  },
  {
    word: /\bform\b/i,
    href: "/homebooks/833probaid-referral-intake",
    newTab: false,
    attr: "data-form-cta",
    linkClass: "form-cta-link",
    markerClass: "form-cta",
  },
  {
    // Only the "now" of a "call now" prompt — a bare "now" is body copy.
    // The `d` flag gives the group's offset; wrapGroup keeps "call" as-is.
    word: /\bcall\s+(now)\b/di,
    wrapGroup: 1,
    // "call now" is already a phone prompt, so it is wired everywhere it
    // shows up — no underline needed to opt in.
    requireUnderline: false,
    // Never hijack a surrounding "Call Now" control — it has its own action.
    repointClickable: false,
    // No href of our own: `.probaid-phone` hands the click to
    // components/ContactActionHandler.jsx, which dials tel:8337762243 and
    // adds the role/tabindex/aria-label. Inside an existing link or button
    // that handler defers, so the wrapper is purely decorative there.
    tag: "span",
    attr: "data-now-cta",
    linkClass: "now-cta probaid-phone",
    markerClass: "now-cta",
  },
];

/** Anything already wired by a previous pass. */
const WIRED_SELECTOR = RULES.map((rule) => `[${rule.attr}]`).join(",");

/** Never walk into these — their text is not body copy. */
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
  "SVG",
  "CANVAS",
  "IFRAME",
]);

/** How far up we look for the element that draws the underline. */
const ANCESTOR_DEPTH = 6;

// Runs before paint on the client, no-ops during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function isUnderlined(element) {
  let el = element;
  for (let i = 0; el && i < ANCESTOR_DEPTH; i += 1) {
    if (el.tagName === "U") return true;
    if (RULES.some((rule) => el.classList?.contains(rule.markerClass))) return true;
    const style = window.getComputedStyle(el);
    const decoration = style.textDecorationLine || style.textDecoration || "";
    if (decoration.includes("underline")) return true;
    if (el === document.body) break;
    el = el.parentElement;
  }
  return false;
}

/** The link / clickable wrapper the word already lives in, if any. */
function clickableAncestor(element) {
  return element.closest("a, button, [onclick], [role='link'], [role='button']");
}

/**
 * The slice of `match` that actually gets wrapped: the whole match by default,
 * or `rule.wrapGroup` when only part of the pattern is the CTA.
 */
function wrapRange(match, rule) {
  const group = rule.wrapGroup;
  if (!group || match[group] === undefined) {
    return { index: match.index, length: match[0].length };
  }
  const text = match[group];
  // `match.indices` comes from the pattern's `d` flag; on engines without it,
  // fall back to locating the group — ours sit at the tail of the match.
  const start =
    match.indices?.[group]?.[0] ?? match.index + match[0].lastIndexOf(text);
  return { index: start, length: text.length };
}

/** First keyword occurrence in `text` among `rules`, or null. */
function firstMatch(text, rules = RULES) {
  let best = null;
  rules.forEach((rule) => {
    const match = text.match(rule.word);
    if (!match) return;
    const range = wrapRange(match, rule);
    if (!best || range.index < best.range.index) {
      best = { rule, match, range };
    }
  });
  return best;
}

function pointAtTarget(element, rule, navigate) {
  element.setAttribute(rule.attr, "");
  element.classList.add(rule.linkClass);

  if (element.tagName === "A") {
    element.setAttribute("href", rule.href);
    if (rule.newTab) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    } else {
      element.removeAttribute("target");
    }
    return;
  }

  // Inline onclick handlers (GrapesJS content uses window.open) are replaced so
  // there is exactly one navigation, always to our destination.
  element.removeAttribute("onclick");
  element.onclick = null;
  element.style.cursor = "pointer";
  element.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(rule);
  });
}

/**
 * Wraps the keyword inside `node` in its own element (an anchor, or whatever
 * `rule.tag` asks for when the rule carries no href of its own).
 * Returns the trailing text node so the caller can keep scanning it.
 */
function wrapWord(node, range, rule, navigate) {
  const wordNode = node.splitText(range.index);
  const tail = wordNode.splitText(range.length);

  const link = document.createElement(rule.tag || "a");
  if (rule.href) {
    link.href = rule.href;
    if (rule.newTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }
  link.className = rule.linkClass;
  link.setAttribute(rule.attr, "");
  link.textContent = wordNode.nodeValue;

  // Internal destinations stay in the SPA instead of doing a full reload.
  if (rule.href && !rule.newTab) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(rule);
    });
  }

  wordNode.parentNode.replaceChild(link, wordNode);
  return tail;
}

function enhance(root, navigate) {
  if (!root || typeof window === "undefined") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !firstMatch(node.nodeValue)) {
        return NodeFilter.FILTER_REJECT;
      }
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
      if (parent.closest(WIRED_SELECTOR)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets = [];
  while (walker.nextNode()) targets.push(walker.currentNode);

  targets.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || !parent.isConnected) return;

    // The underline is drawn by the parent, so one verdict covers every
    // occurrence in this text node.
    const underlined = isUnderlined(parent);
    const rules = underlined
      ? RULES
      : RULES.filter((rule) => rule.requireUnderline === false);
    if (!rules.length) return;

    const first = firstMatch(node.nodeValue, rules);
    if (!first) return;

    if (first.rule.repointClickable !== false) {
      const clickable = clickableAncestor(parent);
      if (clickable && isUnderlined(clickable)) {
        pointAtTarget(clickable, first.rule, navigate);
        return;
      }
    }

    // Wrap each occurrence in this text node.
    let current = node;
    let hit = first;
    while (hit) {
      current = wrapWord(current, hit.range, hit.rule, navigate);
      hit = firstMatch(current.nodeValue, rules);
    }
  });
}

export default function CtaWordLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useIsomorphicLayoutEffect(() => {
    let frame = 0;
    let running = false;

    const navigate = (rule) => {
      if (rule.newTab) {
        window.open(rule.href, "_blank", "noopener,noreferrer");
        return;
      }
      routerRef.current.push(rule.href);
    };

    const run = () => {
      running = true;
      try {
        enhance(document.body, navigate);
      } finally {
        running = false;
      }
    };

    run();

    // CMS content, animations and lazy sections mount after the first pass.
    const observer = new MutationObserver(() => {
      if (running || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        run();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
