"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  createRegistration,
  createWaitlistEntry,
  markConfirmationSent,
} from "@/lib/registrations";
import { sendRegistrantConfirmation, sendAdminNotification } from "@/lib/email/send";
import {
  REHEARSAL_DATES,
  TSHIRT_SIZES,
  type RehearsalDate,
  type TshirtSize,
} from "@/lib/db/schema";

export type RegisterState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      marchStatus: "confirmed" | "waitlist";
      rehearsals: { date: RehearsalDate; status: "confirmed" | "waitlist" }[];
      name: string;
    };

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const honeypot = String(formData.get("website_url_alt") ?? "").trim();
  if (honeypot) {
    return {
      status: "success",
      marchStatus: "confirmed",
      rehearsals: [],
      name: String(formData.get("name") ?? ""),
    };
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    undefined;

  const ok = await verifyTurnstile(turnstileToken, ip);
  if (!ok) {
    return {
      status: "error",
      message: "We couldn't verify that you're human. Please try again.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const tshirtSizeRaw = String(formData.get("tshirtSize") ?? "");

  if (!TSHIRT_SIZES.includes(tshirtSizeRaw as TshirtSize)) {
    return { status: "error", message: "Please pick a t-shirt size." };
  }
  const tshirtSize = tshirtSizeRaw as TshirtSize;

  const rehearsals = formData
    .getAll("rehearsals")
    .map((v) => String(v))
    .filter((v): v is RehearsalDate =>
      REHEARSAL_DATES.includes(v as RehearsalDate),
    );

  const result = await createRegistration({
    name,
    email,
    phone,
    tshirtSize,
    rehearsals,
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  // best-effort emails
  try {
    const payload = {
      name,
      email,
      tshirtSize,
      marchStatus: result.marchStatus,
      rehearsals: result.rehearsals,
    };
    const [confirm] = await Promise.all([
      sendRegistrantConfirmation(payload),
      sendAdminNotification(payload),
    ]);
    if (confirm.sent) {
      await markConfirmationSent(result.id);
    }
  } catch (err) {
    console.error("Email send failed", err);
  }

  revalidatePath("/");

  return {
    status: "success",
    marchStatus: result.marchStatus,
    rehearsals: result.rehearsals,
    name,
  };
}

// ---------------------------------------------------------------------------
// Waitlist (used when march cap is already hit)
// ---------------------------------------------------------------------------

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; name: string };

export async function joinWaitlistAction(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const honeypot = String(formData.get("website_url_alt") ?? "").trim();
  if (honeypot) {
    return {
      status: "success",
      name: String(formData.get("name") ?? ""),
    };
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    undefined;

  const ok = await verifyTurnstile(turnstileToken, ip);
  if (!ok) {
    return {
      status: "error",
      message: "We couldn't verify that you're human. Please try again.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const result = await createWaitlistEntry({ name, email });
  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  // Best-effort confirmation email — uses the same template, which now
  // hides the t-shirt callout and rehearsal block when those fields are empty.
  try {
    const payload = {
      name,
      email,
      tshirtSize: "",
      marchStatus: "waitlist" as const,
      rehearsals: [],
    };
    const [confirm] = await Promise.all([
      sendRegistrantConfirmation(payload),
      sendAdminNotification(payload),
    ]);
    if (confirm.sent) {
      await markConfirmationSent(result.id);
    }
  } catch (err) {
    console.error("Waitlist email send failed", err);
  }

  revalidatePath("/");

  return { status: "success", name };
}
