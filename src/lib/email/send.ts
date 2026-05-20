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

/**
 * BCC list for every user-facing confirmation. Always copies Josh so he sees
 * exactly what a registrant receives. Override / extend via env var, comma-sep.
 */
function confirmationBccList(): string[] {
  const defaultBcc = ["josh@americajosh.com"];
  const fromEnv = (process.env.RESEND_CONFIRMATION_BCC ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaultBcc, ...fromEnv]));
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

  const subject =
    data.marchStatus === "waitlist"
      ? "You're on the Aussie Pride NYC waitlist"
      : "You're in! Aussie Pride NYC 2026";

  const { html, text } = renderConfirmationEmail(data);

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: data.email,
    bcc: confirmationBccList(),
    subject,
    html,
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

// ---------------------------------------------------------------------------
// Email template
// ---------------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aussiepridenyc.com";

// Brand palette (matches /src/app/globals.css)
const COLOR = {
  pink: "#ff2d92",
  pinkDark: "#d61c75",
  coral: "#ff6b47",
  peach: "#ffd9b0",
  cream: "#fff5ef",
  text: "#1a0a14",
  textMuted: "#6b5560",
};

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderConfirmationEmail(data: ConfirmationData) {
  const firstName = (data.name.split(" ")[0] || "mate").trim();
  const isWaitlist = data.marchStatus === "waitlist";

  const headline = isWaitlist
    ? `Onya ${firstName} — you're on the waitlist`
    : `You're in, ${firstName}!`;

  const subhead = isWaitlist
    ? "We've hit our 250-marcher cap. We'll be in touch the moment a spot opens up."
    : `You're officially registered to march with the Aussie contingent at NYC Pride on ${EVENT.date}.`;

  const optedInRehearsals = data.rehearsals
    .map((r) => {
      const meta = REHEARSALS.find((x) => x.id === r.date);
      if (!meta) return null;
      return { ...meta, status: r.status };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  // -- HTML ---------------------------------------------------------------

  const rehearsalsHtmlBlock =
    optedInRehearsals.length > 0
      ? `
        <h3 style="margin: 0 0 12px; font-family: Georgia, 'Times New Roman', serif; color: ${COLOR.pinkDark}; font-size: 22px; font-weight: 600;">
          Dance rehearsals you signed up for
        </h3>
        <ul style="margin: 0 0 12px; padding: 0; list-style: none;">
          ${optedInRehearsals
            .map(
              (r) => `
            <li style="padding: 12px 16px; border-radius: 12px; background: ${COLOR.cream}; margin-bottom: 8px; font-size: 15px; color: ${COLOR.text};">
              <strong>${escape(r.label)}</strong> · ${escape(r.time)}
              ${r.status === "waitlist" ? `<span style="display:inline-block; margin-left:8px; padding:2px 8px; border-radius:999px; background:${COLOR.pinkDark}; color:white; font-size:12px; font-weight:600;">Waitlist</span>` : ""}
              <div style="color: ${COLOR.textMuted}; font-size: 13px; margin-top: 4px;">
                Arrive ${escape(r.arriveBy)} — ${escape(REHEARSAL_VENUE.name)}
              </div>
            </li>`,
            )
            .join("")}
        </ul>
        <p style="margin: 0 0 8px; font-size: 14px; color: ${COLOR.textMuted}; line-height: 1.5;">
          ${escape(REHEARSAL_VENUE.address)}. Please arrive 15 minutes early so we can get you into the building before the 6pm start. Stick around for a drink with the crew after.
        </p>`
      : `
        <h3 style="margin: 0 0 8px; font-family: Georgia, 'Times New Roman', serif; color: ${COLOR.pinkDark}; font-size: 22px; font-weight: 600;">
          Dance rehearsals
        </h3>
        <p style="margin: 0; font-size: 15px; color: ${COLOR.text}; line-height: 1.5;">
          You didn't opt in to rehearsals — no worries. If you change your mind, the choreographed routine on the float is the visual centerpiece of our section, classes are free, and there's a drink with the crew after each one. Reply to this email and we'll add you.
        </p>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(headline)}</title>
</head>
<body style="margin:0; padding:0; background:${COLOR.cream}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color:${COLOR.text}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${escape(subhead)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.cream}; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:white; border-radius:24px; overflow:hidden; box-shadow: 0 8px 32px rgba(214, 28, 117, 0.12);">

          <!-- Hero band -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLOR.pink} 0%, ${COLOR.coral} 100%); padding: 56px 40px 48px; text-align:center; color:white;">
              <div style="font-size: 12px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600; opacity: 0.9; margin-bottom: 16px;">
                ${escape(EVENT.date)}
              </div>
              <div style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 42px; font-weight: 600; line-height: 1.15; margin: 0;">
                ${escape(headline)}
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 17px; line-height: 1.55; color: ${COLOR.text};">
                G'day ${escape(firstName)},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.55; color: ${COLOR.text};">
                ${escape(subhead)}
              </p>

              ${
                data.tshirtSize
                  ? `<!-- T-shirt callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px; background: ${COLOR.cream}; border-radius: 16px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; color: ${COLOR.pinkDark}; margin-bottom: 6px;">
                      Your t-shirt size
                    </div>
                    <div style="font-size: 28px; font-weight: 700; color: ${COLOR.text}; line-height: 1;">
                      ${escape(data.tshirtSize)}
                    </div>
                    <div style="margin-top: 8px; font-size: 13px; color: ${COLOR.textMuted}; line-height: 1.45;">
                      Free and mandatory per NYC Pride. We'll get this to you on march day at the assembly point.
                    </div>
                  </td>
                </tr>
              </table>`
                  : ""
              }

              <!-- Rehearsals block -->
              ${data.tshirtSize ? rehearsalsHtmlBlock : ""}

              <!-- What's next -->
              <div style="margin-top: 32px; padding-top: 28px; border-top: 1px solid rgba(214, 28, 117, 0.12);">
                <h3 style="margin: 0 0 12px; font-family: Georgia, 'Times New Roman', serif; color: ${COLOR.pinkDark}; font-size: 22px; font-weight: 600;">
                  What happens next
                </h3>
                <ul style="margin: 0 0 0 0; padding-left: 20px; font-size: 15px; line-height: 1.6; color: ${COLOR.text};">
                  <li>We'll email the assembly time and exact meeting point as soon as NYC Pride confirms (usually a few weeks out).</li>
                  <li>T-shirt design reveal + the song you'll be dancing to: coming closer to the day.</li>
                  <li>Want to bring a mate? Send them <a href="${SITE_URL}" style="color: ${COLOR.pinkDark}; text-decoration: underline;">aussiepridenyc.com</a> — every marcher needs to register individually.</li>
                </ul>
              </div>

              <!-- CTA -->
              <div style="margin-top: 36px; text-align: center;">
                <a href="${SITE_URL}" style="display: inline-block; background: ${COLOR.pinkDark}; color: white; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 13px;">
                  Visit aussiepridenyc.com
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px; text-align: center; font-size: 12px; color: ${COLOR.textMuted}; line-height: 1.6;">
              <p style="margin: 0 0 8px;">
                Cheers,<br>
                <strong style="color: ${COLOR.pinkDark};">Aussie Pride NYC</strong>
              </p>
              <p style="margin: 0;">
                A community initiative of America Josh, the Australian Consulate-General in New York, and the American Australian Association.
              </p>
              <p style="margin: 12px 0 0;">
                Questions? <a href="mailto:${EVENT.contactEmail}" style="color: ${COLOR.pinkDark}; text-decoration: none;">${EVENT.contactEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // -- Text fallback ------------------------------------------------------

  const rehearsalLines = optedInRehearsals
    .map((r) => {
      const tag = r.status === "waitlist" ? " (waitlist — we'll be in touch)" : "";
      return `• ${r.label}, ${r.time}${tag}`;
    })
    .join("\n");

  const text = [
    `G'day ${firstName},`,
    "",
    subhead,
    "",
    data.tshirtSize
      ? `T-shirt size: ${data.tshirtSize} (free, mandatory per NYC Pride — we'll get this to you on march day).`
      : "",
    data.tshirtSize
      ? (rehearsalLines
          ? `Dance rehearsals you signed up for:\n${rehearsalLines}\n\nRehearsals at ${REHEARSAL_VENUE.name}, ${REHEARSAL_VENUE.address}. Arrive 5:45pm so we can get you into the building. Drinks with the crew after!`
          : "You haven't opted in to dance rehearsals — let us know if you change your mind! The routine on the float is the visual centerpiece of our section.")
      : "If a spot opens up we'll email you to grab the rest of your details — phone, t-shirt size, and rehearsal opt-in.",
    "",
    "What's next:",
    "• Assembly time + exact meeting point: as soon as NYC Pride confirms.",
    "• T-shirt design + song reveal: closer to the day.",
    `• Bringing a mate? Send them ${SITE_URL} — every marcher registers individually.`,
    "",
    "Cheers,",
    "Aussie Pride NYC",
    "",
    `Questions? ${EVENT.contactEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
