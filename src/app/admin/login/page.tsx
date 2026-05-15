import { redirect } from "next/navigation";
import { checkPassword, createSession, isLoggedIn } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin/registrations");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isLoggedIn()) redirect("/admin/registrations");
  const params = await searchParams;
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
      <h1 className="font-display text-2xl text-pink-dark mb-1">Admin login</h1>
      <p className="text-sm text-foreground/70 mb-6">
        Enter the admin password to manage registrations.
      </p>
      <form action={loginAction} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium block mb-1">Password</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="input"
          />
        </label>
        {params.error && (
          <p className="text-sm text-pink-dark">Wrong password — try again.</p>
        )}
        <button
          type="submit"
          className="w-full font-display uppercase tracking-wider bg-pink-dark text-white py-3 rounded-full hover:bg-pink transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
