import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { registrations, rehearsalSignups } from "@/lib/db/schema";
import { REHEARSALS, CAPS } from "@/config/event";
import { getCounts } from "@/lib/registrations";
import { destroySession } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function RegistrationsPage() {
  await requireAdmin();
  const [rows, counts] = await Promise.all([
    db.select().from(registrations).orderBy(desc(registrations.createdAt)),
    getCounts(),
  ]);
  const signups = await db.select().from(rehearsalSignups);

  const byReg = new Map<string, typeof signups>();
  for (const s of signups) {
    const arr = byReg.get(s.registrationId) ?? [];
    arr.push(s);
    byReg.set(s.registrationId, arr);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-pink-dark">Registrations</h1>
          <p className="text-sm text-foreground/70 mt-1">
            {rows.length} total · {counts.march} confirmed marchers (cap {CAPS.march})
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <a
            href="/api/admin/export"
            className="text-sm font-medium bg-white border border-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-50"
          >
            Download CSV
          </a>
          <form action={logoutAction}>
            <button className="text-sm text-foreground/70 hover:text-pink-dark">
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {REHEARSALS.map((r) => {
          const count = counts.rehearsals[r.id] ?? 0;
          return (
            <div key={r.id} className="bg-white border border-zinc-200 rounded-2xl p-4">
              <p className="text-sm text-foreground/60">{r.label}</p>
              <p className="font-display text-2xl text-pink-dark mt-1">
                {count}
                <span className="text-sm text-foreground/60 font-normal">
                  /{CAPS.rehearsal}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-foreground/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Tee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rehearsals</th>
              <th className="px-4 py-3">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((r) => {
              const sigs = byReg.get(r.id) ?? [];
              const dates = new Set(sigs.map((s) => s.rehearsalDate));
              return (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-foreground/80">
                    <div>{r.email}</div>
                    <div className="text-xs text-foreground/60">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.tshirtSize}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {REHEARSALS.map((rh) => (
                      <span
                        key={rh.id}
                        className={`inline-block px-1.5 py-0.5 rounded mr-1 ${
                          dates.has(rh.id)
                            ? "bg-pink/15 text-pink-dark"
                            : "bg-zinc-100 text-zinc-400"
                        }`}
                        title={rh.label}
                      >
                        {rh.label.split(" ")[1]}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-foreground/60 text-xs">
                    {r.createdAt.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-foreground/50">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "confirmed"
      ? "bg-green-100 text-green-800"
      : status === "waitlist"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-zinc-100 text-zinc-700";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tone}`}>
      {status}
    </span>
  );
}
