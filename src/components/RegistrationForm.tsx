"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import confetti from "canvas-confetti";
import { registerAction, type RegisterState } from "@/app/actions";
import { REHEARSALS, REHEARSAL_VENUE, TSHIRT_OPTIONS } from "@/config/event";
import { Turnstile } from "./Turnstile";

const initialState: RegisterState = { status: "idle" };

function fireConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ff2d92", "#d61c75", "#ff6b47", "#ffcd00", "#ffffff"];
  const burst = (originX: number) => {
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      origin: { x: originX, y: 0.65 },
      colors,
      scalar: 1.1,
    });
  };
  burst(0.2);
  setTimeout(() => burst(0.8), 180);
  setTimeout(() => burst(0.5), 360);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-base uppercase tracking-wider font-semibold bg-pink-dark text-white py-4 px-8 rounded-full hover:bg-pink transition-colors shadow-lg shadow-pink/30 disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? "Registering…" : "Count me in!"}
    </button>
  );
}

export function RegistrationForm({
  turnstileSitekey,
  rehearsalCounts,
  rehearsalCap,
}: {
  turnstileSitekey: string | undefined;
  rehearsalCounts: Record<string, number>;
  rehearsalCap: number;
}) {
  const [state, formAction] = useActionState(registerAction, initialState);

  if (state.status === "success") {
    return <SuccessPanel state={state} />;
  }

  return (
    <form
      action={formAction}
      className="bg-white rounded-3xl shadow-xl shadow-pink/20 p-6 sm:p-10 space-y-6"
    >
      <div className="space-y-1">
        <h3 className="font-serif text-3xl sm:text-4xl text-pink-dark leading-tight">Register to march</h3>
        <p className="text-sm text-foreground/70">
          Spots are strictly limited. Registration closes 1 May 2026 (or when we hit our cap).
        </p>
      </div>

      {state.status === "error" && (
        <div className="bg-pink/10 border border-pink/30 text-pink-dark text-sm rounded-2xl px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" required>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="input"
          />
        </Field>
        <Field label="Email" required>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
          />
        </Field>
        <Field label="Phone" required>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1 555 123 4567"
            className="input"
          />
        </Field>
        <Field label="T-shirt size" required hint="Free, mandatory per NYC Pride.">
          <select name="tshirtSize" required defaultValue="" className="input">
            <option value="" disabled>
              Pick a size
            </option>
            {TSHIRT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-xl sm:text-2xl font-extrabold text-pink-dark tracking-tight">
          Optional dance rehearsals
        </legend>
        <p className="text-sm text-foreground/70">
          Free, optional, and (if past years are anything to go by) one of the highlights.
          Held at the {REHEARSAL_VENUE.name} — arrive at 5:45pm so we can get you in the
          building. Stay for a drink afterwards!
        </p>
        <div className="space-y-2">
          {REHEARSALS.map((r) => {
            const count = rehearsalCounts[r.id] ?? 0;
            const remaining = Math.max(rehearsalCap - count, 0);
            const tone =
              remaining === 0
                ? "Waitlist"
                : remaining <= 10
                  ? `${remaining} spots left`
                  : null;
            return (
              <label
                key={r.id}
                className="flex items-start gap-3 p-3 rounded-2xl border border-pink/20 hover:border-pink/40 hover:bg-pink/5 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="rehearsals"
                  value={r.id}
                  className="mt-1 size-5 accent-[var(--color-pink-dark)]"
                />
                <span className="flex-1">
                  <span className="block font-medium">
                    {r.label} · {r.time}
                  </span>
                  <span className="block text-xs text-foreground/60">
                    Arrive {r.arriveBy} · {REHEARSAL_VENUE.address}
                  </span>
                </span>
                {tone && (
                  <span className="text-xs font-medium text-pink-dark whitespace-nowrap mt-1">
                    {tone}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-hidden="true" className="hidden">
        <label>
          Leave this empty
          <input
            type="text"
            name="website_url_alt"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Turnstile sitekey={turnstileSitekey} />

      <SubmitButton />

      <p className="text-xs text-foreground/60 text-center">
        By registering you consent to receiving event-related emails from us. We won&rsquo;t
        share your details with anyone outside the organising team.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-pink-dark"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-foreground/60">{hint}</span>}
    </label>
  );
}

function SuccessPanel({
  state,
}: {
  state: Extract<RegisterState, { status: "success" }>;
}) {
  useEffect(() => {
    if (state.marchStatus === "confirmed") fireConfetti();
  }, [state.marchStatus]);
  const firstName = state.name.split(" ")[0] || "mate";
  return (
    <div className="hero-rise bg-white rounded-3xl shadow-xl shadow-pink/20 p-8 sm:p-10 text-center space-y-4">
      <p className="text-5xl" aria-hidden>
        🦘
      </p>
      <h3 className="text-3xl sm:text-4xl font-extrabold text-pink-dark tracking-tight">
        {state.marchStatus === "waitlist"
          ? `Onya ${firstName} — you're on the waitlist`
          : `You're in, ${firstName}!`}
      </h3>
      <p className="text-foreground/80">
        {state.marchStatus === "waitlist"
          ? "We've hit our 200-marcher cap. We'll be in touch if a spot opens up."
          : "Check your email for confirmation. We'll send updates as we lock in the song, t-shirt design, and parade-day details."}
      </p>
      {state.rehearsals.length > 0 && (
        <div className="text-sm text-foreground/70 bg-pink/5 rounded-2xl p-4">
          <p className="font-medium mb-1">Dance rehearsals</p>
          <ul className="space-y-1">
            {state.rehearsals.map((r) => {
              const meta = REHEARSALS.find((x) => x.id === r.date);
              if (!meta) return null;
              return (
                <li key={r.date}>
                  {meta.label} · {meta.time}
                  {r.status === "waitlist" && " (waitlist)"}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <p className="text-xs text-foreground/60">
        Add a friend? Refresh and they can register too.
      </p>
    </div>
  );
}
