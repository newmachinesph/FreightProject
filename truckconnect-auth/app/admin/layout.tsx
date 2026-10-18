import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  // Only admin or super_admin can access the admin dashboard
  const userWithRole = session.user as typeof session.user & { role?: string };
  if (userWithRole.role !== "admin" && userWithRole.role !== "super_admin") {
    redirect("/sign-in?error=unauthorized");
  }

  return (
    <div className="app-layout">
      <AdminSidebar user={userWithRole as Parameters<typeof AdminSidebar>[0]["user"]} />
      <main>
        {children}
      </main>
    </div>
  );
}
