"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlistAction, type WaitlistState } from "@/app/actions";
import { Turnstile } from "./Turnstile";

const initialState: WaitlistState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-base uppercase tracking-wider font-semibold bg-pink-dark text-white py-4 px-8 rounded-full hover:bg-pink transition-colors shadow-lg shadow-pink/30 disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? "Adding you…" : "Join the waitlist"}
    </button>
  );
}

export function WaitlistForm({
  turnstileSitekey,
}: {
  turnstileSitekey: string | undefined;
}) {
  const [state, formAction] = useActionState(joinWaitlistAction, initialState);

  if (state.status === "success") {
    const firstName = state.name.split(" ")[0] || "mate";
    return (
      <div className="hero-rise bg-white rounded-3xl shadow-xl shadow-pink/20 p-8 sm:p-10 text-center space-y-4">
        <p className="text-5xl" aria-hidden>
          🦘
        </p>
        <h3 className="font-serif text-3xl sm:text-4xl text-pink-dark leading-tight">
          Onya {firstName} — you&rsquo;re on the waitlist
        </h3>
        <p className="text-foreground/80">
          We&rsquo;ve hit our 250-marcher cap, but spots do open up. If one does,
          we&rsquo;ll email you straight away to grab the rest of your details
          (phone, t-shirt size, rehearsal opt-in).
        </p>
        <p className="text-xs text-foreground/60">
          Adding a friend? Refresh and they can join the waitlist too.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-white rounded-3xl shadow-xl shadow-pink/20 p-6 sm:p-10 space-y-6"
    >
      <div className="space-y-1">
        <h3 className="font-serif text-3xl sm:text-4xl text-pink-dark leading-tight">
          Join the waitlist
        </h3>
        <p className="text-sm text-foreground/70">
          We&rsquo;ve hit our 250-marcher cap. Drop your name and email and
          we&rsquo;ll get in touch the moment a spot opens up.
        </p>
      </div>

      {state.status === "error" && (
        <div className="bg-pink/10 border border-pink/30 text-pink-dark text-sm rounded-2xl px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground/80">
            Full name <span className="text-pink-dark">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="input"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground/80">
            Email <span className="text-pink-dark">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
          />
        </label>
      </div>

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
        By joining the waitlist you consent to receiving emails from the
        organizing team. We won&rsquo;t share your details.
      </p>
    </form>
  );
}
