import {
  buildIcs,
  getMarchCalendarEvent,
  getRehearsalCalendarEvent,
  type CalendarEvent,
} from "@/lib/calendar/ics";
import { REHEARSAL_DATES, type RehearsalDate } from "@/lib/db/schema";

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
 * The `.ics` suffix is optional — we strip it before matching. Including
 * the suffix in the URL gives the downloaded file a nicer filename.
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
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function resolveEvent(slug: string): CalendarEvent | null {
  if (slug === "march") return getMarchCalendarEvent();
  if (slug.startsWith("rehearsal-")) {
    const date = slug.replace(/^rehearsal-/, "");
    if (!REHEARSAL_DATES.includes(date as RehearsalDate)) return null;
    return getRehearsalCalendarEvent(date as RehearsalDate);
  }
  return null;
}
