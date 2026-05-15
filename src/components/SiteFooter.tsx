import { PARTNERS, EVENT } from "@/config/event";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-pink/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-foreground/60 text-center mb-8">
          Powered by
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 items-center">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="flex items-center justify-center h-24 opacity-80 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-20 max-w-[240px] w-auto h-auto object-contain"
              />
            </a>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-pink/10 text-center text-xs text-foreground/60 space-y-2">
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
