const ICONS = ["🦘", "🐨", "🏄", "🎩", "🪃", "☀️", "🏳️‍🌈", "🦘", "🐨", "🏄", "🎩", "🪃"];

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
        const size = 36 + ((i * 13) % 60);
        const delay = (i * 0.4) % 3;
        return (
          <span
            key={i}
            className="absolute float opacity-25"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              transform: `rotate(${rotate}deg)`,
              ["--r" as string]: `${rotate}deg`,
              animationDelay: `${delay}s`,
              filter: "saturate(0.7) brightness(0.95)",
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
