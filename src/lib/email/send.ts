import { Resend } from "resend";
import { REHEARSALS, REHEARSAL_VENUE, EVENT } from "@/config/event";
import type { RehearsalDate } from "@/lib/db/schema";

let _resend: Resend | null = null;
function getResend() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

function fromAddress() {
  return process.env.RESEND_FROM ?? process.env.RESEND_FROM_FALLBACK ?? "Aussie Pride NYC <onboarding@resend.dev>";
}

export type ConfirmationData = {
  name: string;
  email: string;
  marchStatus: "confirmed" | "waitlist";
  rehearsals: { date: RehearsalDate; status: "confirmed" | "waitlist" }[];
  tshirtSize: string;
};

export async function sendRegistrantConfirmation(data: ConfirmationData) {
  const resend = getResend();
  if (!resend) return { sent: false as const, reason: "no-api-key" };

  const rehearsalLines = data.rehearsals
    .map((r) => {
      const meta = REHEARSALS.find((x) => x.id === r.date);
      if (!meta) return null;
      const tag = r.status === "waitlist" ? " (waitlist — we'll be in touch)" : "";
      return `• ${meta.label}, ${meta.time}${tag}`;
    })
    .filter(Boolean)
    .join("\n");

  const subject =
    data.marchStatus === "waitlist"
      ? "You're on the Aussie Pride NYC waitlist"
      : "You're in! Aussie Pride NYC 2026";

  const text = [
    `G'day ${data.name.split(" ")[0]},`,
    "",
    data.marchStatus === "waitlist"
      ? "We've reached our cap of 200 marchers, so you're on the waitlist. We'll let you know if a spot opens up."
      : `You're officially registered to march with the Aussie contingent at the NYC Pride March on ${EVENT.date}.`,
    "",
    `T-shirt size: ${data.tshirtSize} (free, mandatory per NYC Pride guidelines — we'll get this to you closer to the day).`,
    "",
    rehearsalLines ? `You opted in to the following dance rehearsals:\n${rehearsalLines}` : "You haven't opted in to dance rehearsals — let us know if you change your mind!",
    "",
    rehearsalLines
      ? `Rehearsals are at the ${REHEARSAL_VENUE.name}, ${REHEARSAL_VENUE.address}. Please arrive at 5:45pm so we can get you into the building before the 6pm start. Stick around for a drink afterwards!`
      : "",
    "",
    "More info, song reveals, and parade-day instructions to follow.",
    "",
    "Cheers,",
    "Aussie Pride NYC",
    "",
    `Questions? ${EVENT.contactEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: data.email,
    subject,
    text,
    replyTo: EVENT.contactEmail,
  });

  if (error) return { sent: false as const, reason: error.message };
  return { sent: true as const };
}

export async function sendAdminNotification(data: ConfirmationData) {
  const resend = getResend();
  const adminTo = process.env.RESEND_ADMIN_NOTIFY;
  if (!resend || !adminTo) return { sent: false as const, reason: "no-config" };

  const rehearsalLines = data.rehearsals
    .map((r) => {
      const meta = REHEARSALS.find((x) => x.id === r.date);
      if (!meta) return null;
      return `• ${meta.label} — ${r.status}`;
    })
    .filter(Boolean)
    .join("\n");

  const subject = `New Aussie Pride NYC RSVP: ${data.name}`;
  const text = [
    `New registration for NYC Pride 2026:`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `T-shirt: ${data.tshirtSize}`,
    `March status: ${data.marchStatus}`,
    ``,
    rehearsalLines ? `Rehearsals:\n${rehearsalLines}` : `Rehearsals: none`,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: adminTo,
    subject,
    text,
  });
  if (error) return { sent: false as const, reason: error.message };
  return { sent: true as const };
}
