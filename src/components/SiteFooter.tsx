import { PARTNERS, EVENT } from "@/config/event";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-pink/10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="font-display text-sm uppercase tracking-widest text-pink-dark text-center mb-5">
          Powered by
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-16 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="font-display text-base text-foreground/80 text-center">
                {p.name}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-pink/10 text-center text-xs text-foreground/60 space-y-2">
          <p>
            Aussie Pride NYC is a community initiative of America Josh, the
            Australian Consulate-General in New York, and the American Australian
            Association. Not affiliated with NYC Pride.
          </p>
          <p>
            Questions?{" "}
            <a
              href={`mailto:${EVENT.contactEmail}`}
              className="text-pink-dark underline-offset-2 hover:underline"
            >
              {EVENT.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
