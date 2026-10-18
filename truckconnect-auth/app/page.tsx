import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const u = session.user as typeof session.user & { role?: string };
  if (u.role === "super_admin") redirect("/admin");
  redirect("/dashboard");
}
