# Safari Performance Findings

Findings from auditing the homepage and `/blogs` page for the Safari
memory-pressure / lag problem. Items are ordered by **impact × ease**, so
working top-to-bottom gives the largest wins first.

Each section includes:
- **Where** — exact file + line range
- **What** — what the code is doing
- **Why it hurts Safari** — the mechanism (so you can judge edge cases)
- **Fix** — concrete change
- **Risk** — what could regress

---

## Why Safari is hit harder than Chrome (context)

Two WebKit behaviors matter for every item below:

1. **Safari does not aggressively cull / evict GPU layers like Chromium.**
   Every element with `transform: translateZ`, `will-change`,
   `preserve-3d`, `backface-visibility`, `filter`, or `contain: paint`
   becomes its own compositor layer. On Retina each layer's texture is
   `width × height × 4 bytes × devicePixelRatio²` — so DPR=2 means 4× the
   memory of @1x. Safari holds these until memory pressure, then evicts
   and re-rasterises (the "blank rectangle" flash + scroll lag).
2. **Safari rasterises SVG filters (`feGaussianBlur`) and large
   `box-shadow` on the CPU,** not the GPU. Both re-run on every repaint.

---

## ✅ Done

### ✅ 1. `MouseTrail` — full-viewport canvas at DPR² with full-frame clear

- **Was:** fixed-position canvas at `zIndex 9999` sized
  `innerWidth × DPR` by `innerHeight × DPR`. At 1440×900 Retina that's a
  ~10 MB backing store re-uploaded to the GPU on every rAF tick. Every
  frame ran `clearRect(0, 0, w, h)`, invalidating the entire overlay
  layer and forcing Safari to recomposite the page underneath. Per
  frame: 1 wide soft-glow stroke (lineWidth 14 over the whole rope) +
  4 alpha-bucket strokes + tip dot, over up to 150 points.
- **Now:** [`components/MouseTrail.jsx`](components/MouseTrail.jsx)
  - DPR capped at 1 → 4× smaller backing store + 4× lower per-frame
    upload bandwidth.
  - Dirty-rect clearing — only clears the bbox of last frame's drawn
    region instead of the whole viewport.
  - **30 fps cap** (was 60) — halves per-frame work on 60 Hz, ~75 %
    cut on 120 Hz.
  - **Outer soft-glow stroke removed** — was the dominant fill-rate
    cost (14 px wide stroke over the whole rope). Trail still has
    tapered alpha bands so it doesn't look like a plain line.
  - **Alpha buckets reduced from 4 → 3** + pre-computed `strokeStyle`
    strings (no per-frame `rgba()` allocation).
  - **`MAX_POINTS` 150 → 80**, **`TRAIL_DURATION` 2200ms → 1400ms** —
    fewer points alive at once, shorter persistence.
  - Squared-distance check (no `Math.hypot` / `sqrt` in hot path).
  - Pause on `visibilitychange` (tab hidden) and `blur` (window
    unfocused).
  - Skip on low-end devices (`hardwareConcurrency ≤ 2 ||
    deviceMemory ≤ 2`).
  - `contain: strict` + `desynchronized: true` context hint.
- **Tuning knobs** at the top of the file: `MAX_DPR`, `TARGET_FPS`,
  `TRAIL_DURATION`, `MAX_POINTS`, `BUCKET_ALPHAS`, `POINT_DIST_SQ`.
  Restore the outer glow by adding back a single `ctx.stroke()` pass
  with `strokeStyle = "rgba(254,119,2,0.07)"` and `lineWidth = 14`
  before the bucket loop.

### ✅ 2. `AIChatbot` — DOM clone on every route change

- **Was:** [`components/AIChatbot.jsx`] ran
  `document.body.cloneNode(true)` on every route change, then
  `querySelectorAll(...)` + `.remove()` on the clone, then `innerText`.
  On content-heavy pages this cloned thousands of nodes and forced a
  layout flush, blocking the main thread for hundreds of ms.
- **Now:** lazy `getPageContext()` using `TreeWalker` with
  `FILTER_REJECT` on matched element subtrees. No DOM clone, no DOM
  mutation. Runs only when the user actually sends a message, cached
  per pathname so subsequent messages on the same page are free.

---

## 🔧 To Do — ordered by impact

### ✅ 3. Every blog card preloads a 1000×1000 image with `priority`

- **Was:** [`app/blogs/BlogsPageClient.jsx:327`](app/blogs/BlogsPageClient.jsx#L327)
  passed `priority={true}` to all 5 cards, and
  [`app/blogs/BlogCardNew.jsx`](app/blogs/BlogCardNew.jsx) declared the
  banner `<Image>` as `width={1000} height={1000}` with an explicit
  `loading={priority ? undefined : "eager"}` that overrode lazy loading
  for the non-priority cards too.
- **Now:**
  1. `priority={index < 2}` — only the two above-the-fold cards get the
     high-priority preload. Cards 3–5 download lazily on scroll.
  2. `width={800} height={500}` on the `<Image>` — declared at the real
     rendered ratio (banners max out in a 550-px-wide container).
  3. Dropped the explicit `loading="eager"` so Next falls back to its
     default lazy loading for non-priority cards.
- **Net effect:** 3 of the 5 priority preloads removed, no more
  simultaneous decode pile-up on Safari, decoded bitmap per card drops
  from ~4 MB to ~1.6 MB at the largest srcset variant.

### ✅ 4. Every idle BlogCard permanently promotes 4–6 compositor layers

- **Was:**
  - Stage wrapper had `contain: "layout paint style"` +
    `transform: translateZ(0)` (and the `-webkit-` variant) — every card
    was promoted to its own GPU layer at idle, ~6.6 MB on Retina × 5
    cards ≈ 33 MB of compositor texture for the blog grid alone.
  - `LearnMoreButton` had `willChange: "transform"` set unconditionally
    plus an infinite `floatBounce` animation, so Safari treated every
    button as a permanently active layer that could never be evicted.
- **Now:**
  1. **Stage wrapper unconditional promotion removed.** Dropped
     `transform: translateZ(0)`, `WebkitTransform: translateZ(0)`, and
     `contain: layout paint style`. Kept `containerType: inline-size`
     (needed for `cqw` units inside) and `isolation: isolate` (cheap,
     scopes z-index). The 3D context is still gated behind `flipping`
     in the book wrapper, so the flip animation still works.
  2. **IntersectionObserver added** to `BookCardInner` with a 100 px
     rootMargin. An `inView` state is threaded down to both
     `LearnMoreButton` call sites.
  3. **`LearnMoreButton` accepts `inView`** and sets
     `animationPlayState: inView ? "running" : "paused"`, so off-screen
     cards' buttons no longer hold an active GPU layer. `willChange` is
     now only set during active hover (`hov ? "transform" : "auto"`),
     not unconditionally.
- **Net effect:** the blog grid no longer keeps ~33 MB of compositor
  texture active at idle. Off-screen cards' animations are paused so
  Safari is free to evict their textures without triggering the
  "blank-rectangle on scroll-back" flash.
- **Note on `.floating-text`:** the global rule still exists in
  `app/global.css:1182-1187`. It's not used inside `BlogCardNew` (only
  the homepage cards in `app/new-page/*.jsx` reference it), so it
  doesn't affect the blogs page. If/when you tackle homepage perf, the
  same `inView` pattern can be applied there — `BookCardBig.jsx` already
  has the IntersectionObserver and just needs `NewBook.jsx` /
  `BookCard.jsx` to follow suit.

### 🔧 5. Inner cover has 4–6 large `box-shadow`s painted on the CPU

- **Where:**
  - Base shell:
    [`BlogCardNew.jsx:273-279`](app/blogs/BlogCardNew.jsx#L273-L279)
  - Staples:
    [`:300-303`, `:315-318`](app/blogs/BlogCardNew.jsx#L300-L318)
  - Inner page: [`:355`](app/blogs/BlogCardNew.jsx#L355)
  - Cover surface stack of `inset` + outer shadows.
- **Why it hurts Safari:** Safari paints `inset` shadows pixel-by-pixel
  on the main thread. Every time a card enters or leaves the viewport
  on scroll, all 5+ shadowed elements per card repaint.
- **Fix:** consolidate the multi-stop `box-shadow` on the base shell
  into a pre-rendered SVG or PNG used as `background-image`. The shape
  is static — there's no reason to redraw it every paint. Keep the
  staples as inline `box-shadow` (they're tiny so cheap).
- **Risk:** visual drift if the rendered asset doesn't match the live
  shadow stack exactly. Export from a screenshot of the current card to
  guarantee parity.
- **Expected win:** removes per-card paint cost on scroll. Most
  noticeable as scroll smoothness, less as steady-state memory.

### 🔧 6. Smaller contributors (do last, if needed)

- **`AnimatedText` with `animate={true}`:**
  [`components/AnimatedText.jsx:51-69`](components/AnimatedText.jsx#L51-L69)
  splits headings into per-word `<span>`s with `animationDelay` and
  `md:hover:scale-110` hover transitions. Multiplied across all homepage
  headings, that's a couple hundred extra elements Safari has to track
  for hover state. Worth keeping unless other items don't move the
  needle.
- **Footer marquee:**
  [`app/global.css:567-595`](app/global.css#L567-L595) —
  `animation-duration: 110s` / `400s` with `will-change: transform`
  keeps a wide compositor layer alive forever. Pause it when off-screen
  with `IntersectionObserver`.
- **`responseCacheRef` in BlogsPageClient:**
  [`app/blogs/BlogsPageClient.jsx:21, 129`](app/blogs/BlogsPageClient.jsx#L21)
  keeps every paginated response in memory for the session. Small (5
  blogs per page) but bounded growth — fine for now.
- **`BookCardDefs` SVG filter:**
  [`BlogCardNew.jsx:70-101`](app/blogs/BlogCardNew.jsx#L70-L101) —
  `feGaussianBlur` is CPU-rasterised on Safari. Already gated behind
  `flipping` for the inner usage inside the card, so it only runs during
  the active flip. No action needed.

---

## How to verify each step

1. Open Safari → Develop → Web Inspector → Timelines → start recording
   on the homepage.
2. Hover, scroll, and navigate to `/blogs`. Stop recording after ~10 s.
3. Compare:
   - **Memory tab** → "JavaScript heap" + "Layers" memory before and
     after the change.
   - **Frames tab** → look for long paint / composite bars.
4. Web Inspector → Layers tab also shows the layer count per page. After
   step 4 the blog grid should drop from ~30+ layers to <10.
