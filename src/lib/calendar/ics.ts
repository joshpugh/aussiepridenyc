/**
 * iCalendar (RFC 5545) builders for single- and multi-event payloads.
 *
 * Used by:
 * - /calendar/[event]/route.ts → single-event downloads
 * - email send pipeline → combined attachment so mail clients (Apple Mail,
 *   Outlook, etc.) offer "Add to calendar" prompts inline for ALL confirmed
 *   events at once
 */

import { EVENT, REHEARSALS, REHEARSAL_VENUE } from "@/config/event";
import type { RehearsalDate } from "@/lib/db/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aussiepridenyc.com";

export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  url?: string;
};

// ---------------------------------------------------------------------------
// Event source-of-truth (used by both the calendar route and email composer)
// ---------------------------------------------------------------------------

export function getMarchCalendarEvent(): CalendarEvent {
  return {
    uid: "march@aussiepridenyc.com",
    title: "NYC Pride March — Aussie contingent",
    description:
      "March with the Australian contingent at the NYC Pride March. Exact assembly time and meeting point will be emailed closer to the day. More info: " +
      SITE_URL,
    location: "Midtown Manhattan, New York, NY (assembly point TBA)",
    // NYC Pride traditionally steps off around noon. Window covers assembly
    // + march. We'll send a calendar update when official step-off lands.
    start: new Date(`${EVENT.iso}T15:00:00Z`), // 11am ET
    end: new Date(`${EVENT.iso}T21:00:00Z`), // 5pm ET
    url: SITE_URL,
  };
}

export function getRehearsalCalendarEvent(
  date: RehearsalDate,
): CalendarEvent | null {
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

// ---------------------------------------------------------------------------
// ICS builders
// ---------------------------------------------------------------------------

export function buildIcs(event: CalendarEvent): string {
  return wrapCalendar(renderVevent(event, formatIcsDate(new Date())));
}

export function buildIcsMultiple(events: CalendarEvent[]): string {
  const dtstamp = formatIcsDate(new Date());
  const vevents = events.map((e) => renderVevent(e, dtstamp)).join("");
  return wrapCalendar(vevents);
}

function wrapCalendar(body: string): string {
  // RFC 5545 expects CRLF line endings.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aussie Pride NYC//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    body.replace(/\r?\n$/, ""),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function renderVevent(event: CalendarEvent, dtstamp: string): string {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatIcsDate(event.start)}`,
    `DTEND:${formatIcsDate(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    event.url ? `URL:${event.url}` : null,
    "END:VEVENT",
  ].filter(Boolean) as string[];
  return lines.join("\r\n") + "\r\n";
}

function formatIcsDate(d: Date): string {
  // YYYYMMDDTHHMMSSZ in UTC.
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
