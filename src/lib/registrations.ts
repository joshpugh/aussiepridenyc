import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  registrations,
  rehearsalSignups,
  TSHIRT_SIZES,
  REHEARSAL_DATES,
  type RehearsalDate,
  type TshirtSize,
} from "@/lib/db/schema";
import { CAPS, REHEARSALS } from "@/config/event";

export type RegistrationInput = {
  name: string;
  email: string;
  phone: string;
  tshirtSize: TshirtSize;
  rehearsals: RehearsalDate[];
};

export async function getMarchCount(): Promise<number> {
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(registrations)
    .where(eq(registrations.status, "confirmed"));
  return Number(rows[0]?.c ?? 0);
}

export async function getRehearsalCounts(): Promise<Record<RehearsalDate, number>> {
  const rows = await db
    .select({
      date: rehearsalSignups.rehearsalDate,
      c: sql<number>`count(*)`,
    })
    .from(rehearsalSignups)
    .where(eq(rehearsalSignups.status, "confirmed"))
    .groupBy(rehearsalSignups.rehearsalDate);

  const result: Record<string, number> = Object.fromEntries(
    REHEARSALS.map((r) => [r.id, 0]),
  );
  for (const row of rows) result[row.date] = Number(row.c);
  return result as Record<RehearsalDate, number>;
}

export async function getCounts() {
  const [march, rehearsalsByDate] = await Promise.all([
    getMarchCount(),
    getRehearsalCounts(),
  ]);
  return { march, marchCap: CAPS.march, rehearsals: rehearsalsByDate, rehearsalCap: CAPS.rehearsal };
}

export type CreateResult =
  | { ok: true; id: string; marchStatus: "confirmed" | "waitlist"; rehearsals: { date: RehearsalDate; status: "confirmed" | "waitlist" }[] }
  | { ok: false; error: string };

export async function createRegistration(input: RegistrationInput): Promise<CreateResult> {
  const email = input.email.trim().toLowerCase();

  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Please enter a valid email." };
  if (!input.phone.trim()) return { ok: false, error: "Phone is required." };
  if (!TSHIRT_SIZES.includes(input.tshirtSize))
    return { ok: false, error: "Please pick a valid t-shirt size." };

  const rehearsals = input.rehearsals.filter((r): r is RehearsalDate =>
    REHEARSAL_DATES.includes(r),
  );

  const existing = await db
    .select({ id: registrations.id })
    .from(registrations)
    .where(eq(registrations.email, email))
    .limit(1);
  if (existing[0]) {
    return {
      ok: false,
      error: "This email is already registered. Please email us if you'd like to update your details.",
    };
  }

  const marchCount = await getMarchCount();
  const marchStatus: "confirmed" | "waitlist" =
    marchCount >= CAPS.march ? "waitlist" : "confirmed";

  const id = randomUUID();
  await db.insert(registrations).values({
    id,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    tshirtSize: input.tshirtSize,
    status: marchStatus,
  });

  const rehearsalCounts = await getRehearsalCounts();
  const rehearsalResults: { date: RehearsalDate; status: "confirmed" | "waitlist" }[] = [];
  for (const date of rehearsals) {
    const count = rehearsalCounts[date] ?? 0;
    const status: "confirmed" | "waitlist" =
      count >= CAPS.rehearsal ? "waitlist" : "confirmed";
    await db.insert(rehearsalSignups).values({
      id: randomUUID(),
      registrationId: id,
      rehearsalDate: date,
      status,
    });
    rehearsalResults.push({ date, status });
    rehearsalCounts[date] = count + 1;
  }

  return { ok: true, id, marchStatus, rehearsals: rehearsalResults };
}

export async function markConfirmationSent(id: string) {
  await db
    .update(registrations)
    .set({ confirmationSentAt: new Date() })
    .where(and(eq(registrations.id, id)));
}
