"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/**
 * Fires a ~3-second confetti rain from above the viewport on first visit.
 * Subsequent visits: nothing (localStorage flag).
 * Respects prefers-reduced-motion.
 *
 * To re-trigger for testing: in DevTools console run
 *   localStorage.removeItem("aussie-confetti-shown")
 * and reload.
 */
const STORAGE_KEY = "aussie-confetti-shown";
const COLORS = ["#ff2d92", "#d61c75", "#ff6b47", "#ffcd00", "#ffffff"];

export function WelcomeConfetti() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Mark as shown immediately so a quick reload mid-animation doesn't re-fire.
    localStorage.setItem(STORAGE_KEY, "1");

    // Slight delay so the hero copy lands first, then the celebration drops.
    const start = window.setTimeout(rain, 400);
    return () => window.clearTimeout(start);
  }, []);

  return null;
}

function rain() {
  const duration = 2800;
  const end = Date.now() + duration;

  // Two-stream rain: one slightly heavier "confetti" stream, one slow drifting
  // "shimmer" stream. Together they read as a celebration shower rather than
  // a single burst.
  (function frame() {
    if (Date.now() > end) return;

    confetti({
      particleCount: 4,
      startVelocity: 0,
      ticks: 280,
      origin: { x: Math.random(), y: -0.08 },
      colors: COLORS,
      gravity: 0.65,
      scalar: 1.15,
      drift: (Math.random() - 0.5) * 1.2,
      shapes: ["square", "circle"],
    });

    confetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 360,
      origin: { x: Math.random(), y: -0.05 },
      colors: COLORS,
      gravity: 0.4,
      scalar: 0.9,
      drift: (Math.random() - 0.5) * 1.6,
      shapes: ["circle"],
    });

    window.requestAnimationFrame(frame);
  })();
}
