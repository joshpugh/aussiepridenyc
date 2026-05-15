const ICONS = [
  "🦘",
  "🐨",
  "🏄",
  "🎩",
  "☀️",
  "🏳️‍🌈",
  "🦘",
  "🐨",
  "🏄",
  "🎩",
  "🌴",
  "✨",
  "🪩",
  "🌺",
  "🦘",
];

const MOTION = ["bob", "drift", "spin", "wiggle"] as const;

export function IconBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      {ICONS.map((icon, i) => {
        const top = (i * 11.7) % 95;
        const left = (i * 17.3) % 92;
        const rotate = ((i * 47) % 70) - 35;
        const size = 36 + ((i * 13) % 70);
        const delay = (i * 0.37) % 4;
        const duration = 4 + ((i * 1.7) % 5);
        const motion = MOTION[i % MOTION.length];
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
