import { Hero } from "@/components/Hero";
import { RegistrationForm } from "@/components/RegistrationForm";
import { getCounts } from "@/lib/registrations";
import { REHEARSALS, REHEARSAL_VENUE, EVENT } from "@/config/event";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aussiepridenyc.com";

const eventLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Australian Contingent at NYC Pride March 2026",
  startDate: `${EVENT.iso}T11:00:00-04:00`,
  endDate: `${EVENT.iso}T17:00:00-04:00`,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description:
    "March with the Australian contingent at the NYC Pride March on Sunday 28 June 2026.",
  location: {
    "@type": "Place",
    name: "NYC Pride March route",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
  },
  organizer: [
    { "@type": "Organization", name: "America Josh", url: "https://americajosh.com" },
    { "@type": "Organization", name: "Australian Consulate-General New York" },
    { "@type": "Organization", name: "American Australian Association" },
  ],
  url: SITE,
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const counts = await getCounts();
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <Hero marchCount={counts.march} marchCap={counts.marchCap} />

      <section id="about" className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-pink-dark mb-6 leading-tight">
            We&rsquo;re going bigger this year.
          </h2>
          <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
            Last year, 200+ Aussies and friends-of-Aussies marched in NYC Pride.
            This year, we&rsquo;re bringing a proper float, a choreographed routine
            from one of our Broadway choreographer mates, and (fingers crossed)
            a special guest or two.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Spots are capped at 200 per NYC Pride. Register your interest below
            to secure yours.
          </p>
        </div>
      </section>

      <section className="bg-aussie-gradient-soft">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-serif text-4xl sm:text-5xl text-pink-dark text-center mb-4 leading-tight">
            Free dance rehearsals
          </h2>
          <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-10">
            Optional but highly recommended. Three weekly classes in the lead-up,
            led by a Broadway-credited choreographer. Stick around for a drink
            with your fellow dancers afterwards.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {REHEARSALS.map((r) => (
              <div
                key={r.id}
                className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center"
              >
                <p className="text-lg font-extrabold text-pink-dark tracking-tight mb-1">
                  {r.label}
                </p>
                <p className="text-foreground/80 text-sm mb-3">{r.time}</p>
                <p className="text-xs text-foreground/70">
                  Arrive {r.arriveBy}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-foreground/70 mt-6">
            All classes at the {REHEARSAL_VENUE.name},
            <br className="sm:hidden" /> {REHEARSAL_VENUE.address}
          </p>
        </div>
      </section>

      <section id="register" className="bg-white scroll-mt-8">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <RegistrationForm
            turnstileSitekey={sitekey}
            rehearsalCounts={counts.rehearsals}
            rehearsalCap={counts.rehearsalCap}
          />
        </div>
      </section>

      <section className="bg-aussie-gradient-soft">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="font-serif text-4xl sm:text-5xl text-pink-dark text-center mb-10 leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Faq q="When does the march start?">
              {EVENT.date}. NYC Pride traditionally steps off around noon, with
              assembly a couple of hours before. We&rsquo;ll email every
              registered marcher the exact step-off time and assembly window
              once NYC Pride confirms in the weeks before.
            </Faq>
            <Faq q="Where does it start?">
              NYC Pride assembles in midtown Manhattan — historically around
              25th Street &amp; 5th Avenue — and heads south down 5th Avenue.
              The Aussie contingent has its own meeting point within the
              assembly area; you&rsquo;ll get the exact corner (with a map) by
              email the week of the march.
            </Faq>
            <Faq q="How long does the whole thing take?">
              Block out the afternoon. Assembly and wait time can run a couple
              of hours, the march itself is around 2 hours, and most of us end
              up at the official Aussie post-march pub afterwards (TBA closer
              to the day). Plan for a full day out.
            </Faq>
            <Faq q="How far is the march?">
              About 2.5 miles (4 km). 5th Avenue south from midtown, through
              the Village, ending in the West Village near Christopher Street
              and Stonewall. It&rsquo;s flat and slow-paced — more of a long
              celebratory stroll than a hike.
            </Faq>
            <Faq q="What should I wear and bring?">
              <ul className="list-disc pl-5 space-y-1">
                <li>Your free Aussie Pride tee — handed out at assembly</li>
                <li>Comfortable shoes you can stand and walk in for hours</li>
                <li>Sun protection: hat, sunscreen, sunnies (late June NYC = hot)</li>
                <li>A refillable water bottle</li>
                <li>A light layer in case it cools off after</li>
                <li>Any Aussie flair you&rsquo;ve got — flags, glitter, vibes</li>
              </ul>
            </Faq>
            <Faq q="What's the t-shirt situation?">
              Per NYC Pride guidelines, marchers must wear an event t-shirt.
              We&rsquo;ll provide one free of charge — your size goes on the
              registration form. Last year&rsquo;s &ldquo;G&rsquo;Day&rdquo; tees
              were popular, so we&rsquo;re aiming to top them.
            </Faq>
            <Faq q="Do I have to come to dance rehearsals?">
              You don&rsquo;t <em>have</em> to — but you&rsquo;ll want to. The
              choreographed routine on the float is the visual centrepiece of
              our section, and rehearsals are how it comes together. Classes
              are free, the choreographer is Broadway-credited, there&rsquo;s
              a drink with the crew after each one, and you&rsquo;ll spend
              three Wednesday evenings meeting other Aussies before march day.
              Come to one and we reckon you&rsquo;ll be back for all three.
            </Faq>
            <Faq q="Can I bring friends?">
              Absolutely — every friend needs to register individually so we can
              count them toward our 200-person cap and get them a t-shirt in their
              size.
            </Faq>
            <Faq q="Do I have to be Australian?">
              Not at all. Aussies, Kiwis, friends-of-Aussies, family,
              partners, anyone with a soft spot for the Southern Hemisphere —
              all welcome. The more the merrier.
            </Faq>
            <Faq q="Who's running this?">
              A team of three: <a className="text-pink-dark underline-offset-2 hover:underline" href="https://americajosh.com" target="_blank" rel="noopener">America Josh</a>, the Australian Consulate-General in New York, and the American Australian Association. With a major sponsor to be announced.
            </Faq>
            <Faq q="I want to sponsor / I have questions">
              Email us at{" "}
              <a
                className="text-pink-dark underline-offset-2 hover:underline"
                href={`mailto:${EVENT.contactEmail}`}
              >
                {EVENT.contactEmail}
              </a>
              .
            </Faq>
          </div>
        </div>
      </section>
    </>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="bg-white/80 backdrop-blur rounded-2xl p-5 group">
      <summary className="text-lg sm:text-xl font-bold text-pink-dark tracking-tight cursor-pointer list-none flex items-center justify-between">
        {q}
        <span className="ml-4 text-2xl font-sans group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <div className="mt-3 text-foreground/80 text-[0.95rem] leading-relaxed">
        {children}
      </div>
    </details>
  );
}
