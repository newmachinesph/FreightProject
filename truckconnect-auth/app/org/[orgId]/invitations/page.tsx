import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invitation, user, member } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import OrgInvitationsClient from "@/components/org/OrgInvitationsClient";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

export default async function OrgInvitationsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const u = session.user as typeof session.user & { role?: string };

  const [callerMember] = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
    .limit(1);

  const callerRole = u.role === "super_admin" ? "super_admin" : (callerMember?.role ?? "member");
  const isAdmin = ORG_ADMIN_ROLES.has(callerRole);

  // All invitations for this org
  const invites = await db
    .select({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      inviterName: user.name,
    })
    .from(invitation)
    .innerJoin(user, eq(invitation.inviterId, user.id))
    .where(eq(invitation.organizationId, orgId))
    .orderBy(desc(invitation.createdAt))
    .limit(100);

  return (
    <OrgInvitationsClient
      orgId={orgId}
      invitations={invites}
      isAdmin={isAdmin}
    />
  );
}
