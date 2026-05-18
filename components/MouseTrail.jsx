"use client";
import { useEffect } from "react";

export default function MouseTrail() {
  useEffect(() => {
    let prevPos = null;
    const handle = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (prevPos) {
        const dx = x - prevPos.x;
        const dy = y - prevPos.y;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const line = document.createElement("div");
        line.style.position = "fixed";
        line.style.left = `${prevPos.x}px`;
        line.style.top = `${prevPos.y}px`;
        line.style.width = `${length}px`;
        line.style.height = "4px";
        line.style.background = "#FE7702";
        line.style.transformOrigin = "0 0";
        line.style.transform = `rotate(${angle}deg)`;
        line.style.pointerEvents = "none";
        line.style.transition = "opacity 0.8s ease";
        line.style.zIndex = "9999";
        document.body.appendChild(line);
        requestAnimationFrame(() => {
          line.style.opacity = "0";
          setTimeout(() => line.remove(), 800);
        });
      }
      prevPos = { x, y };
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return null;
}
