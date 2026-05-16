"use client";

import { useEffect, useState } from "react";

/**
 * Floating font picker for the "swirly" --font-display variable.
 * Lets us preview script fonts live on the site.
 *
 * DELETE THIS FILE (and its imports in layout.tsx) once a font is chosen.
 */

const FONTS = [
  "Great Vibes",
  "Sacramento",
  "Allura",
  "Pinyon Script",
  "Dancing Script",
  "Caveat",
  "Allison",
  "Italianno",
  "Yellowtail",
  "Pacifico",
  "Tangerine",
  "Parisienne",
  "Kaushan Script",
  "Satisfy",
  "Marck Script",
  "Mr Dafoe",
  "Niconne",
  "Lobster",
];

const STORAGE_KEY = "aussie-display-font";

export function FontPicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("Great Vibes");

  // Preload all candidate fonts so the dropdown previews render correctly.
  useEffect(() => {
    const id = "font-picker-preload";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?${FONTS.map(
        (f) => `family=${encodeURIComponent(f)}`,
      ).join("&")}&display=swap`;
      document.head.appendChild(link);
    }

    // Restore previous selection
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && FONTS.includes(saved)) {
      apply(saved);
    }
  }, []);

  function apply(font: string) {
    setActive(font);
    document.documentElement.style.setProperty(
      "--font-display",
      `"${font}"`,
    );
    localStorage.setItem(STORAGE_KEY, font);
  }

  function pick(font: string) {
    apply(font);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div
          className="mb-3 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-pink-dark/20 p-2"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-foreground/60 font-bold border-b border-pink-dark/10 mb-1">
            Pick a display font
          </div>
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => pick(f)}
              className={`w-full text-left px-3 py-2 rounded-xl hover:bg-pink-dark/5 transition-colors ${
                active === f ? "bg-pink-dark/10 ring-1 ring-pink-dark/30" : ""
              }`}
            >
              <span
                className="block text-3xl text-pink-dark leading-none mb-1"
                style={{ fontFamily: `"${f}", cursive` }}
              >
                March with us
              </span>
              <span className="text-[11px] text-foreground/60">
                {f}
                {active === f && " · active"}
              </span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-pink-dark text-white rounded-full pl-3 pr-4 py-2.5 shadow-lg hover:scale-105 active:scale-100 transition-transform flex items-center gap-2 text-sm font-semibold"
        style={{ fontFamily: "system-ui, sans-serif" }}
        aria-label="Toggle font picker"
      >
        <span className="bg-white text-pink-dark rounded-full w-7 h-7 grid place-items-center font-extrabold">
          Aa
        </span>
        <span className="truncate max-w-[140px]">{active}</span>
      </button>
    </div>
  );
}
