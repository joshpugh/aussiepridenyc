import { buildIcs, type CalendarEvent } from "@/lib/calendar/ics";
import { EVENT, REHEARSALS, REHEARSAL_VENUE } from "@/config/event";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aussiepridenyc.com";

export const dynamic = "force-static";

/**
 * Calendar download endpoint.
 *
 * Accepts:
 *   /calendar/march
 *   /calendar/march.ics
 *   /calendar/rehearsal-2026-06-10
 *   /calendar/rehearsal-2026-06-10.ics
 *
 * The `.ics` suffix is optional — we strip it before matching. Most browsers
 * recognise the response as a calendar file from the Content-Type alone, but
 * including the suffix in the URL makes the download filename nicer.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ event: string }> },
) {
  const { event } = await params;
  const slug = event.replace(/\.ics$/i, "");
  const calEvent = resolveEvent(slug);

  if (!calEvent) {
    return new Response("Not found", { status: 404 });
  }

  const ics = buildIcs(calEvent);
  const filename = `${slug}.ics`;

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function resolveEvent(slug: string): CalendarEvent | null {
  if (slug === "march") {
    return {
      uid: "march@aussiepridenyc.com",
      title: "NYC Pride March — Aussie contingent",
      description:
        "March with the Australian contingent at the NYC Pride March. Exact assembly time and meeting point will be emailed closer to the day. More info: " +
        SITE_URL,
      location: "Midtown Manhattan, New York, NY (assembly point TBA)",
      // NYC Pride traditionally steps off around noon. Window covers
      // assembly + march. We'll send a calendar update when the official
      // step-off time is confirmed.
      start: new Date(`${EVENT.iso}T15:00:00Z`), // 11am ET
      end: new Date(`${EVENT.iso}T21:00:00Z`), // 5pm ET
      url: SITE_URL,
    };
  }

  if (slug.startsWith("rehearsal-")) {
    const date = slug.replace(/^rehearsal-/, "");
    const rehearsal = REHEARSALS.find((r) => r.id === date);
    if (!rehearsal) return null;
    return {
      uid: `rehearsal-${date}@aussiepridenyc.com`,
      title: `Aussie Pride dance rehearsal — ${rehearsal.label}`,
      description:
        `Optional dance rehearsal for the NYC Pride march. Arrive ${rehearsal.arriveBy} so we can get you into the building before the 6pm start. Drinks with the crew after.\n\nMore info: ${SITE_URL}`,
      location: `${REHEARSAL_VENUE.name}, ${REHEARSAL_VENUE.address}`,
      // 6pm – 7pm ET = 22:00 – 23:00 UTC (EDT in June)
      start: new Date(`${date}T22:00:00Z`),
      end: new Date(`${date}T23:00:00Z`),
      url: SITE_URL,
    };
  }

  return null;
}
