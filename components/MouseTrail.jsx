"use client";
import { useEffect, useRef, useState } from "react";

const TRAIL_DURATION = 900;
const SMOOTHING_TIME = 24;
const MAX_POINTS = 80;
const MIN_DIST = 1.5;
const BUCKETS = 6;

export default function MouseTrail() {
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: null,
    smoothed: null,
    points: [],
    raf: null,
    lastFrameTime: null,
  });

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 640);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handlePointerMove = (e) => {
      s.mouse = { x: e.clientX, y: e.clientY };
      if (!s.smoothed) {
        s.smoothed = { ...s.mouse };
        s.points.push({ ...s.mouse, t: performance.now() });
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    function catmullRomSegment(p0, p1, p2, p3) {
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    const draw = (timestamp) => {
      const now = timestamp;
      const delta = s.lastFrameTime === null ? 16.67 : timestamp - s.lastFrameTime;
      s.lastFrameTime = timestamp;

      if (!s.mouse) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        s.lastFrameTime = null;
        s.raf = requestAnimationFrame(draw);
        return;
      }
      const smoothing = 1 - Math.exp(-delta / SMOOTHING_TIME);
      s.smoothed.x += (s.mouse.x - s.smoothed.x) * smoothing;
      s.smoothed.y += (s.mouse.y - s.smoothed.y) * smoothing;

      const last = s.points[s.points.length - 1];
      const dist = last
        ? Math.hypot(s.smoothed.x - last.x, s.smoothed.y - last.y)
        : Infinity;

      if (dist > MIN_DIST) {
        s.points.push({ x: s.smoothed.x, y: s.smoothed.y, t: now });
      }

      s.points = s.points.filter((p) => now - p.t < TRAIL_DURATION);
      if (s.points.length > MAX_POINTS) {
        s.points = s.points.slice(-MAX_POINTS);
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const pts = s.points;
      if (pts.length < 4) {
        s.raf = requestAnimationFrame(draw);
        return;
      }

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Pass 1 — single wide glow (1 draw call)
      ctx.beginPath();
      ctx.moveTo(pts[1].x, pts[1].y);
      for (let i = 1; i < pts.length - 2; i++) {
        catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
      }
      ctx.strokeStyle = "rgba(254, 119, 2, 0.05)";
      ctx.lineWidth = 14;
      ctx.stroke();

      // Pass 2 — BUCKETS opacity levels (6 draw calls instead of 80)
      // Each bucket covers an equal slice of the age range.
      for (let b = 0; b < BUCKETS; b++) {
        const loFrac = b / BUCKETS;
        const hiFrac = (b + 1) / BUCKETS;
        const midAlpha = 1 - (loFrac + hiFrac) / 2;

        ctx.beginPath();
        let started = false;

        for (let i = 1; i < pts.length - 2; i++) {
          const frac = (now - pts[i].t) / TRAIL_DURATION;
          if (frac >= loFrac && frac < hiFrac) {
            if (!started) {
              ctx.moveTo(pts[i].x, pts[i].y);
              started = true;
            }
            catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
          }
        }

        if (started) {
          ctx.strokeStyle = `rgba(254, 119, 2, ${(midAlpha * 0.9).toFixed(3)})`;
          ctx.lineWidth = 2.5 * midAlpha + 0.4;
          ctx.stroke();
        }
      }

      // Bright tip dot
      const tip = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 160, 60, 0.95)";
      ctx.fill();

      ctx.restore();

      s.raf = requestAnimationFrame(draw);
    };

    s.raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  return !isMobile && (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
