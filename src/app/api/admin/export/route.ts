import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { isLoggedIn } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { registrations, rehearsalSignups } from "@/lib/db/schema";
import { REHEARSALS } from "@/config/event";

export const dynamic = "force-dynamic";

function csvField(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  if (!(await isLoggedIn())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [rows, signups] = await Promise.all([
    db.select().from(registrations).orderBy(desc(registrations.createdAt)),
    db.select().from(rehearsalSignups),
  ]);

  // Per-registration map of rehearsal_date → status, so the CSV writes the
  // actual status ("confirmed" / "waitlist") in each rehearsal column rather
  // than a flat "yes".
  const byReg = new Map<string, Map<string, string>>();
  for (const s of signups) {
    const inner = byReg.get(s.registrationId) ?? new Map<string, string>();
    inner.set(s.rehearsalDate, s.status);
    byReg.set(s.registrationId, inner);
  }

  const headers = [
    "Name",
    "Email",
    "Phone",
    "T-shirt size",
    "Status",
    ...REHEARSALS.map((r) => r.label),
    "Registered (UTC)",
  ];

  const lines = [headers.map(csvField).join(",")];
  for (const r of rows) {
    const byDate = byReg.get(r.id) ?? new Map<string, string>();
    const cells = [
      r.name,
      r.email,
      r.phone,
      r.tshirtSize,
      r.status,
      ...REHEARSALS.map((rh) => byDate.get(rh.id) ?? ""),
      r.createdAt.toISOString(),
    ];
    lines.push(cells.map(csvField).join(","));
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aussiepridenyc-registrations-${stamp}.csv"`,
    },
  });
}
