import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member, organization } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import OrgSidebar from "@/components/org/OrgSidebar";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

function getOrgType(orgType: string | null): string {
  return orgType ?? "unknown";
}

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const u = session.user as typeof session.user & { role?: string; image?: string | null };

  // Verify membership and role
  const [membership] = await db
    .select({ role: member.role, orgName: organization.name, orgType: organization.orgType })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(
      and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, orgId)
      )
    )
    .limit(1);

  // super_admin can also access
  if (!membership && u.role !== "super_admin") {
    redirect("/dashboard");
  }

  if (membership && !ORG_ADMIN_ROLES.has(membership.role) && u.role !== "super_admin") {
    redirect("/dashboard");
  }

  const orgName = membership?.orgName ?? "Organization";
  const orgType = getOrgType(membership?.orgType ?? null);

  return (
    <div className="app-layout">
      <OrgSidebar
        user={{ name: u.name, email: u.email, image: u.image }}
        orgId={orgId}
        orgName={orgName}
        orgType={orgType}
      />
      <main>
        {children}
      </main>
    </div>
  );
}
