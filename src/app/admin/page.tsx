import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  if (!(await isLoggedIn())) redirect("/admin/login");
  redirect("/admin/registrations");
}
