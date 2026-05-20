// Pool of candidate icons — Aussie, Pride, party vibes.
const ICON_POOL = [
  "🦘",
  "🐨",
  "🏄",
  "🎩",
  "☀️",
  "🇦🇺",
  "🏳️‍🌈",
  "🏳️‍⚧️",
  "🌴",
  "✨",
  "🪩",
  "🌺",
  "🐊",
  "🦩",
  "💃",
  "🕺",
  "🌈",
  "🎉",
  "🦋",
  "💖",
  "🌸",
  "🌊",
  "🦜",
  "🌟",
  "🥳",
];

const MOTION = ["bob", "drift", "spin", "wiggle"] as const;
const COUNT = 22;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Floating-emoji backdrop for the Hero. Positions, sizes, rotations, motion
 * variants and the icon choices themselves are all randomised on every render.
 *
 * Why this doesn't break hydration: IconBackdrop is a server component (no
 * "use client"), so Math.random() runs once on the server and the values are
 * baked into the HTML React ships to the browser. The browser never re-runs
 * this component, so client and server can't disagree. The parent page is
 * `force-dynamic`, so every request is a fresh server render → fresh layout.
 */
export function IconBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      {Array.from({ length: COUNT }).map((_, i) => {
        const icon = pick(ICON_POOL);
        const top = Math.random() * 95;
        const left = Math.random() * 92;
        const rotate = Math.random() * 70 - 35;
        const size = 36 + Math.random() * 70;
        const delay = Math.random() * 4;
        const duration = 4 + Math.random() * 5;
        const motion = pick(MOTION);
        return (
          <span
            key={i}
            className={`absolute opacity-30 motion-${motion}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              ["--r" as string]: `${rotate}deg`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              filter: "saturate(0.8) brightness(1)",
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
