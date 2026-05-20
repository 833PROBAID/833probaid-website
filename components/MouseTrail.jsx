"use client";
import { useEffect, useRef } from "react";

const TRAIL_DURATION = 1200; // ms — how long the rope persists
const SMOOTH_FACTOR = 0.13; // 0.05 = very floaty, 0.3 = snappier
const MAX_POINTS = 80; // cap to keep perf stable

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: -999, y: -999 },
    smoothed: null,
    points: [],
    raf: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Catmull-Rom segment between p1→p2 using p0 and p3 as tangent guides
    function catmullRomSegment(p0, p1, p2, p3) {
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    const draw = () => {
      const now = Date.now();

      // Physics lag — smoothed position chases real mouse
      if (!s.smoothed) s.smoothed = { ...s.mouse };
      s.smoothed.x += (s.mouse.x - s.smoothed.x) * SMOOTH_FACTOR;
      s.smoothed.y += (s.mouse.y - s.smoothed.y) * SMOOTH_FACTOR;

      // Only push a new point if we moved enough (avoids duplicate stacking)
      const last = s.points[s.points.length - 1];
      const dist = last
        ? Math.hypot(s.smoothed.x - last.x, s.smoothed.y - last.y)
        : Infinity;

      if (dist > 1.5) {
        s.points.push({ x: s.smoothed.x, y: s.smoothed.y, t: now });
      }

      // Expire old points and cap length
      s.points = s.points.filter((p) => now - p.t < TRAIL_DURATION);
      if (s.points.length > MAX_POINTS) {
        s.points = s.points.slice(-MAX_POINTS);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = s.points;

      if (pts.length >= 4) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Pass 1 — wide soft glow behind the rope
        ctx.beginPath();
        ctx.moveTo(pts[1].x, pts[1].y);
        for (let i = 1; i < pts.length - 2; i++) {
          catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
        }
        ctx.strokeStyle = "rgba(254, 119, 2, 0.07)";
        ctx.lineWidth = 14;
        ctx.stroke();

        // Pass 2 — main rope, tapered alpha + width per segment
        for (let i = 1; i < pts.length - 2; i++) {
          const age = now - pts[i].t;
          const alpha = Math.max(0, 1 - age / TRAIL_DURATION);
          const lineWidth = 2.5 * alpha + 0.4;

          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          catmullRomSegment(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
          ctx.strokeStyle = `rgba(254, 119, 2, ${alpha * 0.9})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }

        // Bright tip dot at the head of the rope
        const tip = pts[pts.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 160, 60, 0.95)";
        ctx.fill();

        ctx.restore();
      }

      s.raf = requestAnimationFrame(draw);
    };

    s.raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(s.raf);
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
