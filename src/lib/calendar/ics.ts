/**
 * Tiny iCalendar (RFC 5545) builder for single-event downloads.
 *
 * Output is intentionally minimal: one VEVENT inside one VCALENDAR, in UTC,
 * with the fields macOS Calendar / iOS Calendar / Google Calendar / Outlook
 * all import cleanly.
 */

export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  url?: string;
};

export function buildIcs(event: CalendarEvent): string {
  const dtstamp = formatIcsDate(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aussie Pride NYC//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
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
    "END:VCALENDAR",
  ].filter(Boolean) as string[];
  // RFC 5545 expects CRLF line endings.
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
