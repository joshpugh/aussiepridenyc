import { PARTNERS, EVENT, type PartnerSocial } from "@/config/event";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-pink/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-foreground/60 text-center mb-8">
          Powered by
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 items-start">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-3">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-44 sm:w-48 h-auto max-h-28 object-contain"
                />
              </a>
              {p.socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {p.socials.map((s) => (
                    <a
                      key={s.network}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} on ${s.network}`}
                      className="text-foreground/50 hover:text-pink-dark transition-colors"
                    >
                      <SocialIcon network={s.network} />
                    </a>
                  ))}
                </div>
              )}
            </div>
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

function SocialIcon({ network }: { network: PartnerSocial["network"] }) {
  const size = 20;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;

  if (network === "instagram") {
    return (
      <svg {...common}>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 00-2.12 1.38A5.86 5.86 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 002.12-1.38 5.86 5.86 0 001.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 00-1.38-2.12A5.86 5.86 0 0019.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-10.41a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    );
  }
  if (network === "facebook") {
    return (
      <svg {...common}>
        <path d="M24 12a12 12 0 10-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0024 12z" />
      </svg>
    );
  }
  // linkedin
  return (
    <svg {...common}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 013.38-1.85c3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
