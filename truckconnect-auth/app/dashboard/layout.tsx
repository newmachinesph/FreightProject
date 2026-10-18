import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member, organization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) redirect("/sign-in");

  // Fetch user's org memberships for sidebar
  const memberships = await db
    .select({ orgId: member.organizationId, role: member.role, name: organization.name })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, session.user.id));

  const orgs = memberships.map(m => ({ id: m.orgId, name: m.name, role: m.role }));
  const u = session.user as typeof session.user & { role?: string; image?: string | null };

  return (
    <div className="app-layout">
      <DashboardSidebar
        user={{ name: u.name, email: u.email, image: u.image, role: u.role }}
        orgs={orgs}
      />
      <main>
        {children}
      </main>
    </div>
  );
}
