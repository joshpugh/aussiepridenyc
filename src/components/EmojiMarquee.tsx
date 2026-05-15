const STRIP = ["🦘", "🏳️‍🌈", "🐨", "✨", "🏄", "🪩", "☀️", "🌺", "🎩", "🌴"];

export function EmojiMarquee() {
  // Render the strip twice so the loop seam is invisible
  const items = [...STRIP, ...STRIP, ...STRIP, ...STRIP];
  return (
    <div
      aria-hidden
      className="bg-aussie-gradient grain relative overflow-hidden py-4"
    >
      <div className="marquee-mask">
        <div className="marquee-track text-3xl select-none">
          {items.map((emoji, i) => (
            <span key={i} aria-hidden>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
