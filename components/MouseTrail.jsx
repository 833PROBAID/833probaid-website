"use client";
import { useEffect, useRef } from "react";

// ── Visual tuning ────────────────────────────────────────────────────
// All knobs are at the top so the trail can be re-tuned without
// touching the loop.
const TRAIL_DURATION = 1400; // ms — was 2200; shorter persistence
const SMOOTH_FACTOR = 0.6; // 0.05 = very floaty, 0.6 ≈ sticks to cursor
const MAX_POINTS = 80; // safety cap — was 150
const IDLE_DELAY = TRAIL_DURATION + 100;
const BUCKET_ALPHAS = [0.85, 0.55, 0.25]; // 3 alpha bands — was 4
const POINT_DIST_SQ = 3 * 3; // squared threshold; avoids sqrt in hot path
const TIP_RADIUS = 2.5;

// ── Perf tuning ─────────────────────────────────────────────────────
// Cap rendering DPR. The canvas backing store is W × H × 4 bytes × DPR²,
// re-uploaded to the GPU each draw. DPR=1 cuts that 4× on Retina with
// no visible change for a soft trail. Raise to 1.5 / 2 if you want
// crisper edges at the cost of memory/upload bandwidth.
const MAX_DPR = 1;

// Cap render rate. 30 fps stays fluid for cursor following and halves
// per-frame work compared to display refresh on 60 Hz screens
// (≈75% reduction on 120 Hz).
const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

// Skip on plausibly low-end machines. `pointer: fine` already filters
// touch devices; this catches old / low-spec laptops where the canvas
// overlay still costs more than it's worth.
function isDeviceCapable() {
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  return cores > 2 && mem > 2;
}

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: -999, y: -999 },
    smoothed: null,
    points: [],
    raf: null,
    running: false,
    lastMoveTime: 0,
    lastFrameTime: 0,
    visible: true,
    focused: true,
  });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!isDeviceCapable()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    const s = stateRef.current;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    // Dirty-rect tracking. Only clear the bbox of the previous frame's
    // drawn region instead of the whole viewport — the full clearRect
    // was forcing the entire canvas backing store to upload to the GPU
    // every frame on Safari.
    let lastDirty = null;

    const clearDirty = () => {
      if (!lastDirty) return;
      ctx.clearRect(lastDirty.x, lastDirty.y, lastDirty.w, lastDirty.h);
      lastDirty = null;
    };

    const applySize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      if (dpr !== 1) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDirty = null;
    };
    applySize();

    let resizeScheduled = false;
    const resize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        applySize();
      });
    };
    window.addEventListener("resize", resize, { passive: true });

    function catmullRomSegment(p0, p1, p2, p3) {
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    // Pre-computed stroke styles — building the rgba string inside the
    // loop allocates a new String every frame.
    const STROKE_STYLES = BUCKET_ALPHAS.map(
      (a) => `rgba(254, 119, 2, ${a * 0.9})`,
    );
    const STROKE_WIDTHS = BUCKET_ALPHAS.map((a) => 2.5 * a + 0.4);

    const buckets = [[], [], []];

    const draw = (now) => {
      // Frame throttle — skip rAF callback if we rendered too recently.
      if (now - s.lastFrameTime < FRAME_INTERVAL_MS - 1) {
        s.raf = requestAnimationFrame(draw);
        return;
      }
      s.lastFrameTime = now;

      if (!s.smoothed) s.smoothed = { x: s.mouse.x, y: s.mouse.y };
      s.smoothed.x += (s.mouse.x - s.smoothed.x) * SMOOTH_FACTOR;
      s.smoothed.y += (s.mouse.y - s.smoothed.y) * SMOOTH_FACTOR;

      // Squared-distance check avoids Math.hypot/sqrt in the hot path.
      const pts = s.points;
      const last = pts[pts.length - 1];
      if (!last) {
        pts.push({ x: s.smoothed.x, y: s.smoothed.y, t: now });
      } else {
        const ddx = s.smoothed.x - last.x;
        const ddy = s.smoothed.y - last.y;
        if (ddx * ddx + ddy * ddy > POINT_DIST_SQ) {
          pts.push({ x: s.smoothed.x, y: s.smoothed.y, t: now });
        }
      }

      while (pts.length && now - pts[0].t > TRAIL_DURATION) pts.shift();
      if (pts.length > MAX_POINTS) pts.splice(0, pts.length - MAX_POINTS);

      clearDirty();

      if (pts.length >= 4) {
        // Bbox of the current trail — used to clear this frame's drawing
        // on the NEXT call. Smaller PAD now that the wide glow pass is
        // gone — the widest stroke is 2.5 * 0.85 + 0.4 ≈ 2.5 px.
        let minX = pts[0].x;
        let minY = pts[0].y;
        let maxX = pts[0].x;
        let maxY = pts[0].y;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i];
          if (p.x < minX) minX = p.x;
          else if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          else if (p.y > maxY) maxY = p.y;
        }
        const PAD = 6;
        const cssW = window.innerWidth;
        const cssH = window.innerHeight;
        const dx = Math.max(0, Math.floor(minX - PAD));
        const dy = Math.max(0, Math.floor(minY - PAD));
        lastDirty = {
          x: dx,
          y: dy,
          w: Math.min(cssW - dx, Math.ceil(maxX - minX + 2 * PAD)),
          h: Math.min(cssH - dy, Math.ceil(maxY - minY + 2 * PAD)),
        };

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Main rope — batched into 3 alpha buckets (≤3 strokes total).
        // Outer-glow pass removed: a 14 px wide stroke over the entire
        // rope path was the dominant per-frame fill-rate cost on Safari.
        buckets[0].length = 0;
        buckets[1].length = 0;
        buckets[2].length = 0;
        const inv = 1 / TRAIL_DURATION;
        for (let i = 1; i < pts.length - 2; i++) {
          const alpha = 1 - (now - pts[i].t) * inv;
          if (alpha <= 0) continue;
          let b;
          if (alpha > 0.7) b = 0;
          else if (alpha > 0.4) b = 1;
          else b = 2;
          buckets[b].push(i);
        }
        for (let b = 0; b < 3; b++) {
          const ids = buckets[b];
          if (ids.length === 0) continue;
          ctx.strokeStyle = STROKE_STYLES[b];
          ctx.lineWidth = STROKE_WIDTHS[b];
          ctx.beginPath();
          for (let k = 0; k < ids.length; k++) {
            const i = ids[k];
            ctx.moveTo(pts[i].x, pts[i].y);
            catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
          }
          ctx.stroke();
        }

        // Tip dot
        const tip = pts[pts.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, TIP_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 160, 60, 0.95)";
        ctx.fill();

        ctx.restore();
      }

      // Idle — fully exit the rAF loop. Restarts on next mousemove.
      if (now - s.lastMoveTime > IDLE_DELAY && pts.length === 0) {
        clearDirty();
        s.running = false;
        s.raf = null;
        return;
      }

      s.raf = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (s.running) return;
      if (!s.visible || !s.focused) return;
      s.running = true;
      s.lastFrameTime = 0;
      s.raf = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = null;
      s.running = false;
      s.points.length = 0;
      s.smoothed = null;
      clearDirty();
    };

    const handleMouseMove = (e) => {
      const wasIdle = !s.running;
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.lastMoveTime = performance.now();
      if (wasIdle) {
        // Snap to current cursor on resume so we don't sweep a line
        // from the cursor's last position to here.
        s.smoothed = { x: e.clientX, y: e.clientY };
        s.points.length = 0;
      }
      startLoop();
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleVisibility = () => {
      s.visible = document.visibilityState === "visible";
      if (!s.visible) stopLoop();
    };
    const handleBlur = () => {
      s.focused = false;
      stopLoop();
    };
    const handleFocus = () => {
      s.focused = true;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.running = false;
      s.raf = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        // Hint to the browser that this element's painting is fully
        // independent — Safari can keep it on its own compositor layer
        // without invalidating siblings.
        contain: "strict",
      }}
    />
  );
}
