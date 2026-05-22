"use client";
import { useEffect, useRef } from "react";

const TRAIL_DURATION = 2200; // ms — how long the rope persists
const SMOOTH_FACTOR = 0.6; // 0.05 = very floaty, 0.3 = snappier, 0.6 ≈ sticks to cursor
const MAX_POINTS = 150; // cap to keep perf stable
const IDLE_DELAY = TRAIL_DURATION + 100; // ms of no movement before the RAF pauses
const BUCKET_ALPHAS = [0.9, 0.7, 0.45, 0.2]; // 4 alpha bands for the tapered rope

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: -999, y: -999 },
    smoothed: null,
    points: [],
    raf: null,
    running: false,
    lastMoveTime: 0,
  });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const applySize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    window.addEventListener("resize", resize);

    function catmullRomSegment(p0, p1, p2, p3) {
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    const buckets = [[], [], [], []];

    const draw = () => {
      const now = Date.now();
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (!s.smoothed) s.smoothed = { x: s.mouse.x, y: s.mouse.y };
      s.smoothed.x += (s.mouse.x - s.smoothed.x) * SMOOTH_FACTOR;
      s.smoothed.y += (s.mouse.y - s.smoothed.y) * SMOOTH_FACTOR;

      const last = s.points[s.points.length - 1];
      const dist = last
        ? Math.hypot(s.smoothed.x - last.x, s.smoothed.y - last.y)
        : Infinity;
      if (dist > 1.5) {
        s.points.push({ x: s.smoothed.x, y: s.smoothed.y, t: now });
      }

      const pts = s.points;
      while (pts.length && now - pts[0].t > TRAIL_DURATION) pts.shift();
      if (pts.length > MAX_POINTS) pts.splice(0, pts.length - MAX_POINTS);

      ctx.clearRect(0, 0, w, h);

      if (pts.length >= 4) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Pass 1 — wide soft glow behind the rope (single stroke)
        ctx.beginPath();
        ctx.moveTo(pts[1].x, pts[1].y);
        for (let i = 1; i < pts.length - 2; i++) {
          catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
        }
        ctx.strokeStyle = "rgba(254, 119, 2, 0.07)";
        ctx.lineWidth = 14;
        ctx.stroke();

        // Pass 2 — main rope batched into 4 alpha buckets (≤4 strokes instead of ~78).
        // Safari's per-stroke overhead is the dominant cost; batching is the big win.
        buckets[0].length = 0;
        buckets[1].length = 0;
        buckets[2].length = 0;
        buckets[3].length = 0;
        for (let i = 1; i < pts.length - 2; i++) {
          const alpha = Math.max(0, 1 - (now - pts[i].t) / TRAIL_DURATION);
          let b;
          if (alpha > 0.775) b = 0;
          else if (alpha > 0.55) b = 1;
          else if (alpha > 0.275) b = 2;
          else b = 3;
          buckets[b].push(i);
        }
        for (let b = 0; b < 4; b++) {
          const ids = buckets[b];
          if (ids.length === 0) continue;
          const a = BUCKET_ALPHAS[b];
          ctx.strokeStyle = `rgba(254, 119, 2, ${a * 0.9})`;
          ctx.lineWidth = 2.5 * a + 0.4;
          ctx.beginPath();
          for (let k = 0; k < ids.length; k++) {
            const i = ids[k];
            ctx.moveTo(pts[i].x, pts[i].y);
            catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
          }
          ctx.stroke();
        }

        const tip = pts[pts.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 160, 60, 0.95)";
        ctx.fill();

        ctx.restore();
      }

      if (now - s.lastMoveTime > IDLE_DELAY && pts.length === 0) {
        ctx.clearRect(0, 0, w, h);
        s.running = false;
        s.raf = null;
        return;
      }

      s.raf = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (s.running) return;
      s.running = true;
      s.raf = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      const wasIdle = !s.running;
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.lastMoveTime = Date.now();
      if (wasIdle) {
        // Snap to the current cursor on resume so we don't sweep a line
        // from the cursor's last position to here.
        s.smoothed = { x: e.clientX, y: e.clientY };
        s.points.length = 0;
      }
      startLoop();
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.running = false;
      s.raf = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
